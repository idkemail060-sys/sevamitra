-- ==============================================================================
-- SEVAMITRA - Cooperative Gig Services Platform
-- Smart India Hackathon 2026 | Problem Statement ID: SIH26089 | Team Techforge
-- Database: Supabase PostgreSQL Normalized Schema with Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('HOUSEHOLD', 'WORKER', 'ADMIN');
CREATE TYPE worker_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE booking_status AS ENUM ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED');
CREATE TYPE grievance_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED');
CREATE TYPE grievance_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE proposal_status AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'IMPLEMENTED');

-- 3. USERS & PROFILES
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'HOUSEHOLD',
    locality TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    preferred_language VARCHAR(50) DEFAULT 'en',
    alternate_phone TEXT,
    emergency_contact TEXT,
    address_line TEXT,
    landmark TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICES CATALOG
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_rate_inr NUMERIC(10, 2) NOT NULL DEFAULT 350.00,
    rate_unit VARCHAR(30) DEFAULT 'per service',
    icon_name VARCHAR(50) DEFAULT 'Wrench',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKERS PROFILE
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    service_category_code VARCHAR(50) REFERENCES public.services(category_code),
    skills TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 1,
    service_areas TEXT[] DEFAULT '{}',
    primary_pincode VARCHAR(10) NOT NULL,
    verification_status worker_status NOT NULL DEFAULT 'PENDING',
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.users(id),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    rating_count INT DEFAULT 0,
    total_completed_jobs INT DEFAULT 0,
    jobs_this_week INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    is_cooperative_member BOOLEAN DEFAULT TRUE,
    cooperative_id VARCHAR(50) DEFAULT 'BLR-COOP-01',
    cooperative_share_percent NUMERIC(5, 2) DEFAULT 100.00,
    kyc_document_url TEXT,
    kyc_document_type VARCHAR(50) DEFAULT 'AADHAAR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WORKER AVAILABILITY SLOTS
CREATE TABLE IF NOT EXISTS public.worker_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
    start_time TIME NOT NULL DEFAULT '08:00',
    end_time TIME NOT NULL DEFAULT '18:00',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COOPERATIVE MEMBERS
CREATE TABLE IF NOT EXISTS public.cooperative_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID UNIQUE REFERENCES public.workers(id) ON DELETE CASCADE,
    member_id_number VARCHAR(50) UNIQUE NOT NULL,
    cooperative_branch TEXT NOT NULL DEFAULT 'Karnataka State Urban Gig Workers Welfare Cooperative Society Ltd.',
    membership_date DATE DEFAULT CURRENT_DATE,
    membership_status VARCHAR(20) DEFAULT 'ACTIVE',
    share_capital_inr NUMERIC(10, 2) DEFAULT 1000.00,
    welfare_fund_balance NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    household_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE SET NULL,
    service_category_code VARCHAR(50) REFERENCES public.services(category_code),
    task_description TEXT NOT NULL,
    locality TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time_slot VARCHAR(50) NOT NULL,
    status booking_status NOT NULL DEFAULT 'REQUESTED',
    match_score NUMERIC(5, 2),
    fairness_bonus NUMERIC(5, 2),
    quote_amount NUMERIC(10, 2) NOT NULL DEFAULT 450.00,
    platform_fee NUMERIC(10, 2) DEFAULT 22.50,
    cooperative_fund NUMERIC(10, 2) DEFAULT 9.00,
    worker_net_payout NUMERIC(10, 2) DEFAULT 418.50,
    special_instructions TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BOOKING STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    from_status booking_status,
    to_status booking_status NOT NULL,
    changed_by UUID REFERENCES public.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PAYMENTS (RAZORPAY TEST INTEGRATION)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    cooperative_fund NUMERIC(10, 2) NOT NULL,
    worker_earnings NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY_UPI',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. WORKER EARNINGS LEDGER
CREATE TABLE IF NOT EXISTS public.worker_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee_deducted NUMERIC(10, 2) NOT NULL,
    cooperative_welfare_deducted NUMERIC(10, 2) NOT NULL,
    net_earnings NUMERIC(10, 2) NOT NULL,
    payout_status VARCHAR(30) DEFAULT 'CREDITED_TO_WALLET',
    settled_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RATINGS & REVIEWS
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
    household_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    rating_score INT NOT NULL CHECK (rating_score BETWEEN 1 AND 5),
    review_comment TEXT,
    cleanliness_score INT CHECK (cleanliness_score BETWEEN 1 AND 5),
    punctuality_score INT CHECK (punctuality_score BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COOPERATIVE GOVERNANCE PROPOSALS
CREATE TABLE IF NOT EXISTS public.governance_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposed_by UUID REFERENCES public.users(id),
    category VARCHAR(50) DEFAULT 'PLATFORM_FEES',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    status proposal_status DEFAULT 'ACTIVE',
    yes_votes INT DEFAULT 0,
    no_votes INT DEFAULT 0,
    total_eligible_voters INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. GOVERNANCE VOTES (ONE WORKER = ONE VOTE)
CREATE TABLE IF NOT EXISTS public.governance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    vote VARCHAR(10) NOT NULL CHECK (vote IN ('YES', 'NO')),
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (proposal_id, worker_id)
);

-- 15. GRIEVANCES
CREATE TABLE IF NOT EXISTS public.grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(30) UNIQUE NOT NULL,
    worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    priority grievance_priority DEFAULT 'MEDIUM',
    status grievance_status DEFAULT 'OPEN',
    admin_response TEXT,
    resolved_by UUID REFERENCES public.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. PLATFORM SETTINGS (DYNAMIC CONFIGURATION)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'GLOBAL_CONFIG',
    platform_fee_percent NUMERIC(5, 2) DEFAULT 5.00,
    cooperative_fund_percent NUMERIC(5, 2) DEFAULT 2.00,
    weight_category_match NUMERIC(5, 2) DEFAULT 0.40,
    weight_locality_match NUMERIC(5, 2) DEFAULT 0.30,
    weight_rating NUMERIC(5, 2) DEFAULT 0.15,
    weight_availability NUMERIC(5, 2) DEFAULT 0.15,
    fairness_bonus_weight NUMERIC(5, 2) DEFAULT 0.25,
    max_active_jobs_per_worker INT DEFAULT 3,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );

-- WORKERS POLICIES
CREATE POLICY "Verified workers are viewable by all authenticated users" ON public.workers
    FOR SELECT USING (verification_status = 'VERIFIED' OR auth.uid() = id);

CREATE POLICY "Workers can update own profile" ON public.workers
    FOR UPDATE USING (auth.uid() = id);

-- BOOKINGS POLICIES
CREATE POLICY "Households can see own bookings" ON public.bookings
    FOR SELECT USING (household_id = auth.uid());

CREATE POLICY "Workers can see assigned bookings" ON public.bookings
    FOR SELECT USING (worker_id = auth.uid());

CREATE POLICY "Households can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (household_id = auth.uid());

CREATE POLICY "Parties can update booking status" ON public.bookings
    FOR UPDATE USING (household_id = auth.uid() OR worker_id = auth.uid());

-- EARNINGS POLICIES
CREATE POLICY "Workers can view own earnings only" ON public.worker_earnings
    FOR SELECT USING (worker_id = auth.uid());

-- GOVERNANCE POLICIES
CREATE POLICY "All active proposals viewable by cooperative workers and admins" ON public.governance_proposals
    FOR SELECT USING (true);

CREATE POLICY "Workers can cast one vote" ON public.governance_votes
    FOR INSERT WITH CHECK (worker_id = auth.uid());

CREATE POLICY "Workers can see own vote" ON public.governance_votes
    FOR SELECT USING (worker_id = auth.uid());

-- GRIEVANCE POLICIES
CREATE POLICY "Workers can manage own grievances" ON public.grievances
    FOR ALL USING (worker_id = auth.uid());

CREATE POLICY "Admins can manage all grievances" ON public.grievances
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'ADMIN')
    );
