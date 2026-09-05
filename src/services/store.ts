/**
 * SEVAMITRA - Reactive Data Store & Synchronization Engine
 * SIH26089 | Team Techforge
 *
 * Provides persistent local state, realistic seed data (Ramesh Kumar, Sunita Verma,
 * Arjun Patel, Neha Sharma, Imran Khan), real-time event distribution, and
 * full lifecycle mutation operations for Household, Worker, and Admin.
 */

import {
  UserProfile,
  WorkerProfile,
  ServiceCategory,
  Booking,
  BookingStatus,
  PaymentTransaction,
  GovernanceProposal,
  GrievanceTicket,
  NotificationItem,
  PlatformConfig,
  PaymentStatus,
} from '../types';
import { calculateTransparentFeeSplit } from './matchingEngine';
import { syncBookingToSupabase, recordUserLogin, updateUserProfileMetadataInSupabase } from './supabaseService';

const STORAGE_KEY = 'sevamitra_coop_db_v2';

// 1. Initial Service Catalog (12 categories)
export const INITIAL_SERVICES: ServiceCategory[] = [
  {
    id: 'srv-plumb',
    code: 'Plumbing',
    name: 'Plumbing Services',
    description: 'Pipe leakage, tap fitting, bathroom sanitary, pump repair & drainage clearing',
    baseRate: 400,
    rateUnit: 'per visit / standard repair',
    icon: 'Wrench',
    popular: true,
  },
  {
    id: 'srv-elec',
    code: 'Electrician',
    name: 'Electrical Repairs & Wiring',
    description: 'Switchboard repair, MCB tripping, fan installation, chandelier & earthing fix',
    baseRate: 350,
    rateUnit: 'per inspection / repair',
    icon: 'Zap',
    popular: true,
  },
  {
    id: 'srv-clean',
    code: 'Cleaning',
    name: 'Home & Kitchen Deep Cleaning',
    description: 'Eco-friendly deep cleaning, sofa shampooing, bathroom scrubbing & sanitization',
    baseRate: 450,
    rateUnit: 'per standard room / 2 hours',
    icon: 'Sparkles',
    popular: true,
  },
  {
    id: 'srv-cook',
    code: 'Cooking',
    name: 'Home Chef & Meal Preparation',
    description: 'Nutritious North & South Indian meals, diabetic-friendly, hygiene-certified cooking',
    baseRate: 500,
    rateUnit: 'per session (lunch / dinner)',
    icon: 'Utensils',
    popular: true,
  },
  {
    id: 'srv-appliance',
    code: 'Appliance Repair',
    name: 'Appliance Repair & Servicing',
    description: 'Refrigerator, washing machine, microwave, RO purifier & geyser troubleshooting',
    baseRate: 550,
    rateUnit: 'per diagnosis & service',
    icon: 'Tv',
    popular: true,
  },
  {
    id: 'srv-tutor',
    code: 'Tutoring',
    name: 'Neighborhood Academic Tutoring',
    description: 'CBSE / ICSE / State board primary & middle school Math, Science & English tuition',
    baseRate: 400,
    rateUnit: 'per hour session',
    icon: 'GraduationCap',
  },
  {
    id: 'srv-elder',
    code: 'Elder Care',
    name: 'Elderly Companion & Health Care',
    description: 'Daily medication reminder, mobility assistance, gentle companionship & vitals log',
    baseRate: 600,
    rateUnit: 'per 4-hour visit',
    icon: 'HeartHandshake',
    popular: true,
  },
  {
    id: 'srv-carpentry',
    code: 'Carpentry',
    name: 'Carpentry & Furniture Works',
    description: 'Door hinge repair, wardrobe latch, customized shelf fitting & wooden restorations',
    baseRate: 450,
    rateUnit: 'per task',
    icon: 'Hammer',
  },
  {
    id: 'srv-paint',
    code: 'Painting',
    name: 'Home Painting & Waterproofing',
    description: 'Wall touch-ups, moisture patch treatment, exterior and interior emulsion coating',
    baseRate: 700,
    rateUnit: 'per wall / day estimate',
    icon: 'Paintbrush',
  },
  {
    id: 'srv-garden',
    code: 'Gardening',
    name: 'Balcony & Terrace Gardening',
    description: 'Pot repotting, pruning, organic compost dressing, insect shielding & plant care',
    baseRate: 350,
    rateUnit: 'per visit',
    icon: 'Trees',
  },
  {
    id: 'srv-beauty',
    code: 'Beauty / Personal Care',
    name: 'At-Home Grooming & Wellness',
    description: 'Hygienic salon treatments, hair care, massage therapy & organic skin treatments',
    baseRate: 500,
    rateUnit: 'per session',
    icon: 'Smile',
  },
  {
    id: 'srv-other',
    code: 'Other',
    name: 'Community Handyman & Assistance',
    description: 'General household task support, moving help, assembly & seasonal maintenance',
    baseRate: 350,
    rateUnit: 'per hour',
    icon: 'HelpCircle',
  },
];

// 2. Realistic Seed Workers (including the 5 named workers from problem statement)
export const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'w-arjun-patel',
    email: 'arjun.patel@sevamitra.coop',
    phone: '+91 98450 12345',
    fullName: 'Arjun Patel',
    role: 'WORKER',
    locality: 'Indiranagar',
    pincode: '560038',
    serviceCategory: 'Plumbing',
    skills: ['Pipe Fitting', 'Sanitary Repair', 'Overhead Tank', 'Drainage', 'Pressure Pump'],
    experienceYears: 7,
    serviceAreas: ['Indiranagar', 'Domlur', 'HAL', 'Old Airport Road', 'Ulsoor'],
    primaryPincode: '560038',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Physical KYC & skill verification certified by Karnataka Gig Workers Coop',
    rating: 4.7,
    ratingCount: 38,
    totalCompletedJobs: 112,
    jobsThisWeek: 4, // low jobs this week -> high fairness boost!
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2024-0042',
    cooperativeBranch: 'Bangalore East Workers Union Society',
    kycDocumentType: 'AADHAAR & TRADE_CERTIFICATE',
    kycDocumentUrl: '/assets/docs/kyc_arjun_patel.pdf',
    bio: 'Certified master plumber with 7+ years of experience in leak proofing and modern sanitary fittings.',
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    id: 'w-ramesh-kumar',
    email: 'ramesh.kumar@sevamitra.coop',
    phone: '+91 98230 54321',
    fullName: 'Ramesh Kumar',
    role: 'WORKER',
    locality: 'Koramangala',
    pincode: '560034',
    serviceCategory: 'Electrician',
    skills: ['MCB Troubleshooting', 'Three Phase Wiring', 'Smart Switches', 'Inverter Setup'],
    experienceYears: 9,
    serviceAreas: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Ejipura', 'Indiranagar'],
    primaryPincode: '560034',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Govt ITI Wireman License Verified',
    rating: 4.8,
    ratingCount: 64,
    totalCompletedJobs: 240,
    jobsThisWeek: 8,
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2023-0019',
    cooperativeBranch: 'South Bengaluru Energy Craftsmen Cooperative',
    kycDocumentType: 'ELECTRICAL_INSPECTION_LICENSE',
    kycDocumentUrl: '/assets/docs/kyc_ramesh_kumar.pdf',
    bio: 'Licensed electrician with safety accreditation. Expert in residential diagnostics and inverter setup.',
    createdAt: '2023-11-10T10:30:00Z',
  },
  {
    id: 'w-sunita-verma',
    email: 'sunita.verma@sevamitra.coop',
    phone: '+91 98860 99887',
    fullName: 'Sunita Verma',
    role: 'WORKER',
    locality: 'Indiranagar',
    pincode: '560038',
    serviceCategory: 'Cleaning',
    skills: ['Eco-friendly Scrubbing', 'Kitchen Degreasing', 'Sofa Extraction', 'Appliance Exterior Cleaning'],
    experienceYears: 5,
    serviceAreas: ['Indiranagar', 'Ulsoor', 'Frazer Town', 'Koramangala', 'Cox Town'],
    primaryPincode: '560038',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Police clearance verified, cooperative founding member',
    rating: 4.9,
    ratingCount: 82,
    totalCompletedJobs: 310,
    jobsThisWeek: 6,
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2023-0005',
    cooperativeBranch: 'Women Domestic Workers Cooperative Federation',
    kycDocumentType: 'AADHAAR & POLICE_VERIFICATION',
    kycDocumentUrl: '/assets/docs/kyc_sunita_verma.pdf',
    bio: 'Leader of local hygiene team. Believes in non-toxic cleaning agents and dignified labor standards.',
    createdAt: '2023-09-01T08:00:00Z',
  },
  {
    id: 'w-neha-sharma',
    email: 'neha.sharma@sevamitra.coop',
    phone: '+91 97410 33445',
    fullName: 'Neha Sharma',
    role: 'WORKER',
    locality: 'Jayanagar',
    pincode: '560041',
    serviceCategory: 'Tutoring',
    skills: ['Mathematics (Classes 4-10)', 'Science', 'English Grammar', 'Exam Strategy'],
    experienceYears: 4,
    serviceAreas: ['Jayanagar', 'JP Nagar', 'Banashankari', 'BTM Layout'],
    primaryPincode: '560041',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'B.Sc Physics Degree certified; background checked',
    rating: 4.9,
    ratingCount: 45,
    totalCompletedJobs: 95,
    jobsThisWeek: 5,
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2024-0104',
    cooperativeBranch: 'Educators & Skill Cooperative Guild',
    kycDocumentType: 'DEGREE_CERTIFICATE',
    kycDocumentUrl: '/assets/docs/kyc_neha_sharma.pdf',
    bio: 'Patient and enthusiastic tutor helping students build foundational clarity without exam anxiety.',
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'w-imran-khan',
    email: 'imran.khan@sevamitra.coop',
    phone: '+91 99000 66778',
    fullName: 'Imran Khan',
    role: 'WORKER',
    locality: 'HSR Layout',
    pincode: '560102',
    serviceCategory: 'Appliance Repair',
    skills: ['Inverter Refrigerator Gas Charging', 'Washing Machine Drum', 'Microwave PCB', 'Water Purifier'],
    experienceYears: 8,
    serviceAreas: ['HSR Layout', 'Koramangala', 'Bellandur', 'Sarjapur Road'],
    primaryPincode: '560102',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Technical Trade Certificate from National Skill Development Corporation (NSDC)',
    rating: 4.6,
    ratingCount: 52,
    totalCompletedJobs: 180,
    jobsThisWeek: 9,
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2023-0077',
    cooperativeBranch: 'South Bengaluru Energy Craftsmen Cooperative',
    kycDocumentType: 'NSDC_SKILL_CARD',
    kycDocumentUrl: '/assets/docs/kyc_imran_khan.pdf',
    bio: 'Honest diagnostic technician for home appliances. No unnecessary spare parts replacement.',
    createdAt: '2023-12-05T14:15:00Z',
  },
  {
    id: 'w-suresh-naik',
    email: 'suresh.naik@sevamitra.coop',
    phone: '+91 98452 77889',
    fullName: 'Suresh Naik',
    role: 'WORKER',
    locality: 'Domlur',
    pincode: '560071',
    serviceCategory: 'Plumbing',
    skills: ['Leakage Detection', 'Borewell Pipeline', 'Solar Water Heater Repair'],
    experienceYears: 12,
    serviceAreas: ['Domlur', 'Indiranagar', 'HAL', 'Old Airport Road'],
    primaryPincode: '560071',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Senior cooperative committee delegate',
    rating: 4.8,
    ratingCount: 90,
    totalCompletedJobs: 410,
    jobsThisWeek: 18, // High weekly load -> fairness rotation gives newer workers opportunities!
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2022-0002',
    cooperativeBranch: 'Bangalore East Workers Union Society',
    kycDocumentType: 'AADHAAR',
    kycDocumentUrl: '/assets/docs/kyc_suresh_naik.pdf',
    bio: 'Decades of experience resolving complex urban drainage and plumbing challenges in Bangalore.',
    createdAt: '2022-08-10T10:00:00Z',
  },
  {
    id: 'w-anandini-joshi',
    email: 'anandini.joshi@sevamitra.coop',
    phone: '+91 97310 11223',
    fullName: 'Anandini Joshi',
    role: 'WORKER',
    locality: 'Malleshwaram',
    pincode: '560003',
    serviceCategory: 'Elder Care',
    skills: ['Geriatric Nursing Support', 'Mobility Assistance', 'BP & Sugar Monitoring', 'Nutritional Care'],
    experienceYears: 6,
    serviceAreas: ['Malleshwaram', 'Rajajinagar', 'Sadashivanagar', 'Vyalikaval'],
    primaryPincode: '560003',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Certified Home Health Aide (St. John Ambulance)',
    rating: 4.9,
    ratingCount: 40,
    totalCompletedJobs: 88,
    jobsThisWeek: 3,
    isAvailable: true,
    isCooperativeMember: true,
    cooperativeId: 'COOP-KAR-2024-0088',
    cooperativeBranch: 'Women Domestic Workers Cooperative Federation',
    kycDocumentType: 'GERIATRIC_CARE_CERTIFICATE',
    kycDocumentUrl: '/assets/docs/kyc_anandini.pdf',
    bio: 'Warm and empathetic elder caregiver dedicated to helping senior citizens live comfortably.',
    createdAt: '2024-02-14T09:30:00Z',
  },
  // A PENDING worker to test Admin Verification feature
  {
    id: 'w-deepak-mali',
    email: 'deepak.mali@gmail.com',
    phone: '+91 96110 88776',
    fullName: 'Deepak Mali',
    role: 'WORKER',
    locality: 'Whitefield',
    pincode: '560066',
    serviceCategory: 'Gardening',
    skills: ['Drip Irrigation', 'Bonsai Pruning', 'Lawn Mowing', 'Pest Management'],
    experienceYears: 3,
    serviceAreas: ['Whitefield', 'Marathahalli', 'Kadugodi'],
    primaryPincode: '560066',
    verificationStatus: 'PENDING',
    verificationNotes: 'Uploaded Aadhaar card and municipal residency certificate awaiting admin review',
    rating: 5.0,
    ratingCount: 0,
    totalCompletedJobs: 0,
    jobsThisWeek: 0,
    isAvailable: true,
    isCooperativeMember: false,
    cooperativeId: 'APPLICANT-2026-908',
    cooperativeBranch: 'Pending Membership Enrollment',
    kycDocumentType: 'AADHAAR_CARD',
    kycDocumentUrl: '/assets/docs/deepak_aadhaar_front.jpg',
    bio: 'Passionate gardener looking to join the cooperative society and serve Whitefield residents.',
    createdAt: '2026-03-01T10:00:00Z',
  },
];

// 3. Initial Users (Households & Admin)
export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u-ananya-sen',
    email: 'ananya.sen@example.com',
    phone: '+91 99450 77112',
    fullName: 'Ananya Sen',
    role: 'HOUSEHOLD',
    locality: 'Indiranagar',
    pincode: '560038',
    createdAt: '2024-05-12T10:00:00Z',
  },
  {
    id: 'u-vikram-malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 98110 44332',
    fullName: 'Vikram Malhotra',
    role: 'HOUSEHOLD',
    locality: 'Koramangala',
    pincode: '560034',
    createdAt: '2024-06-01T15:00:00Z',
  },
  {
    id: 'u-admin-rajeshwari',
    email: 'rajeshwari.admin@sevamitra.coop',
    phone: '+91 94480 00111',
    fullName: 'Rajeshwari Rao',
    role: 'ADMIN',
    locality: 'Bangalore Central',
    pincode: '560001',
    createdAt: '2023-01-01T00:00:00Z',
  },
];

// 4. Initial Bookings with real status transitions
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    bookingCode: 'SM-26-8801',
    householdId: 'u-ananya-sen',
    householdName: 'Ananya Sen',
    householdPhone: '+91 99450 77112',
    householdAddress: 'Flat 402, Green Glen Palms, 12th Main, Indiranagar',
    workerId: 'w-arjun-patel',
    workerName: 'Arjun Patel',
    workerPhone: '+91 98450 12345',
    serviceCategory: 'Plumbing',
    serviceName: 'Plumbing Services',
    taskDescription: 'Kitchen sink pipe joint leaking continuously into the cabinet below. Needs new seal or PVC replacement.',
    locality: 'Indiranagar',
    pincode: '560038',
    scheduledDate: '2026-03-04',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    status: 'ACCEPTED',
    matchScore: 95,
    fairnessBonus: 20,
    quoteAmount: 450,
    platformFee: 22.5,
    cooperativeFund: 9.0,
    workerNetPayout: 418.5,
    paymentStatus: 'PENDING',
    createdAt: '2026-03-02T14:30:00Z',
    updatedAt: '2026-03-02T15:10:00Z',
    history: [
      {
        toStatus: 'REQUESTED',
        timestamp: '2026-03-02T14:30:00Z',
        changedBy: 'Ananya Sen',
        notes: 'Booking requested via Smart Matching Engine (Rank #1 match)',
      },
      {
        fromStatus: 'REQUESTED',
        toStatus: 'ACCEPTED',
        timestamp: '2026-03-02T15:10:00Z',
        changedBy: 'Arjun Patel',
        notes: 'Worker accepted request; notified household',
      },
    ],
  },
  {
    id: 'bkg-102',
    bookingCode: 'SM-26-7942',
    householdId: 'u-ananya-sen',
    householdName: 'Ananya Sen',
    householdPhone: '+91 99450 77112',
    householdAddress: 'Flat 402, Green Glen Palms, 12th Main, Indiranagar',
    workerId: 'w-sunita-verma',
    workerName: 'Sunita Verma',
    workerPhone: '+91 98860 99887',
    serviceCategory: 'Cleaning',
    serviceName: 'Home & Kitchen Deep Cleaning',
    taskDescription: 'Kitchen chimney degreasing and balcony floor pressure washing.',
    locality: 'Indiranagar',
    pincode: '560038',
    scheduledDate: '2026-02-28',
    scheduledTimeSlot: '02:00 PM - 05:00 PM',
    status: 'COMPLETED',
    matchScore: 98,
    fairnessBonus: 15,
    quoteAmount: 600,
    platformFee: 30.0,
    cooperativeFund: 12.0,
    workerNetPayout: 558.0,
    paymentStatus: 'CAPTURED',
    paymentId: 'pay_demo_clean_998',
    razorpayOrderId: 'order_test_998',
    ratingScore: 5,
    reviewComment: 'Outstanding professionalism! Sunita ji arrived on time, used herbal cleaners, and left the kitchen sparkling clean. Cooperative model is wonderful.',
    createdAt: '2026-02-27T08:00:00Z',
    updatedAt: '2026-02-28T17:30:00Z',
    history: [
      {
        toStatus: 'REQUESTED',
        timestamp: '2026-02-27T08:00:00Z',
        changedBy: 'Ananya Sen',
      },
      {
        fromStatus: 'REQUESTED',
        toStatus: 'ACCEPTED',
        timestamp: '2026-02-27T08:45:00Z',
        changedBy: 'Sunita Verma',
      },
      {
        fromStatus: 'ACCEPTED',
        toStatus: 'IN_PROGRESS',
        timestamp: '2026-02-28T14:05:00Z',
        changedBy: 'Sunita Verma',
        notes: 'Worker arrived at premises and commenced cleaning',
      },
      {
        fromStatus: 'IN_PROGRESS',
        toStatus: 'COMPLETED',
        timestamp: '2026-02-28T17:00:00Z',
        changedBy: 'Sunita Verma',
        notes: 'Task completed. Razorpay payment settled.',
      },
    ],
  },
  {
    id: 'bkg-103',
    bookingCode: 'SM-26-6410',
    householdId: 'u-vikram-malhotra',
    householdName: 'Vikram Malhotra',
    householdPhone: '+91 98110 44332',
    householdAddress: 'Villa 18, Palm Meadows, Koramangala 4th Block',
    workerId: 'w-ramesh-kumar',
    workerName: 'Ramesh Kumar',
    workerPhone: '+91 98230 54321',
    serviceCategory: 'Electrician',
    serviceName: 'Electrical Repairs & Wiring',
    taskDescription: 'Living room inverter backup battery not charging, tripping the sub-meter MCB.',
    locality: 'Koramangala',
    pincode: '560034',
    scheduledDate: '2026-03-03',
    scheduledTimeSlot: '11:30 AM - 01:30 PM',
    status: 'IN_PROGRESS',
    matchScore: 94,
    fairnessBonus: 10,
    quoteAmount: 500,
    platformFee: 25.0,
    cooperativeFund: 10.0,
    workerNetPayout: 465.0,
    paymentStatus: 'PENDING',
    createdAt: '2026-03-03T08:30:00Z',
    updatedAt: '2026-03-03T11:40:00Z',
    history: [
      {
        toStatus: 'REQUESTED',
        timestamp: '2026-03-03T08:30:00Z',
        changedBy: 'Vikram Malhotra',
      },
      {
        fromStatus: 'REQUESTED',
        toStatus: 'ACCEPTED',
        timestamp: '2026-03-03T09:00:00Z',
        changedBy: 'Ramesh Kumar',
      },
      {
        fromStatus: 'ACCEPTED',
        toStatus: 'IN_PROGRESS',
        timestamp: '2026-03-03T11:35:00Z',
        changedBy: 'Ramesh Kumar',
        notes: 'Diagnosing inverter circuit and transformer relay',
      },
    ],
  },
];

// 5. Initial Payment Transactions
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-001',
    transactionCode: 'TX-26089-01',
    bookingId: 'bkg-102',
    bookingCode: 'SM-26-7942',
    householdName: 'Ananya Sen',
    workerId: 'w-sunita-verma',
    workerName: 'Sunita Verma',
    serviceName: 'Home & Kitchen Deep Cleaning',
    grossAmount: 600,
    platformFee: 30, // 5%
    cooperativeFund: 12, // 2%
    workerEarnings: 558, // 93%
    workerNetPayout: 558,
    paymentMethod: 'RAZORPAY_UPI (TEST)',
    razorpayPaymentId: 'pay_test_sih26_001',
    status: 'CAPTURED',
    paymentStatus: 'CAPTURED',
    timestamp: '2026-02-28T17:15:00Z',
    createdAt: '2026-02-28T17:15:00Z',
  },
  {
    id: 'tx-002',
    transactionCode: 'TX-26089-02',
    bookingId: 'bkg-hist-88',
    bookingCode: 'SM-26-7104',
    householdName: 'Dr. Alok Verma',
    workerId: 'w-arjun-patel',
    workerName: 'Arjun Patel',
    serviceName: 'Plumbing Services',
    grossAmount: 500,
    platformFee: 25,
    cooperativeFund: 10,
    workerEarnings: 465,
    workerNetPayout: 465,
    paymentMethod: 'RAZORPAY_CARD (TEST)',
    razorpayPaymentId: 'pay_test_sih26_002',
    status: 'CAPTURED',
    paymentStatus: 'CAPTURED',
    timestamp: '2026-02-26T12:00:00Z',
    createdAt: '2026-02-26T12:00:00Z',
  },
  {
    id: 'tx-003',
    transactionCode: 'TX-26089-03',
    bookingId: 'bkg-hist-89',
    bookingCode: 'SM-26-6990',
    householdName: 'Pooja Iyer',
    workerId: 'w-ramesh-kumar',
    workerName: 'Ramesh Kumar',
    serviceName: 'Electrical Repairs & Wiring',
    grossAmount: 400,
    platformFee: 20,
    cooperativeFund: 8,
    workerEarnings: 372,
    workerNetPayout: 372,
    paymentMethod: 'RAZORPAY_NETBANKING (TEST)',
    razorpayPaymentId: 'pay_test_sih26_003',
    status: 'CAPTURED',
    paymentStatus: 'CAPTURED',
    timestamp: '2026-02-25T16:20:00Z',
    createdAt: '2026-02-25T16:20:00Z',
  },
];

// 6. Cooperative Governance Proposals
export const INITIAL_PROPOSALS: GovernanceProposal[] = [
  {
    id: 'prop-001',
    proposalCode: 'PROP-2601',
    title: 'Proposal #2601: Reduce Platform Service Fee from 5% to 4%',
    description:
      'Given the successful stabilization of platform operations and cooperative treasury surplus, it is proposed to reduce the operational platform fee from 5.0% to 4.0%, leaving an additional 1.0% directly in workers’ pockets while retaining the 2% cooperative welfare reserve intact.',
    category: 'PLATFORM_FEES',
    proposedBy: 'Worker Advisory Council',
    startDate: '2026-02-20T00:00:00Z',
    endDate: '2026-03-15T23:59:59Z',
    votingDeadline: '2026-03-15T23:59:59Z',
    status: 'ACTIVE',
    yesVotes: 34,
    noVotes: 6,
    votesFor: 34,
    votesAgainst: 6,
    votesAbstain: 2,
    totalEligibleVoters: 50,
    votedUserIds: ['w-ramesh-kumar', 'w-sunita-verma'],
    hasVotedUserIds: ['w-ramesh-kumar', 'w-sunita-verma'],
  },
  {
    id: 'prop-002',
    proposalCode: 'PROP-2602',
    title: 'Proposal #2602: Subsidized Electric Tool Kit & Rain Gear Scheme for 2026 Monsoon',
    description:
      'Allocate ₹75,000 from the Cooperative Welfare Fund to provide certified safety shoes, high-grade water-sealed tool bags, and waterproof jackets to all verified cooperative field workers before the June monsoon season.',
    category: 'WORKER_WELFARE',
    proposedBy: 'Cooperative Managing Committee',
    startDate: '2026-02-25T00:00:00Z',
    endDate: '2026-03-20T23:59:59Z',
    votingDeadline: '2026-03-20T23:59:59Z',
    status: 'ACTIVE',
    yesVotes: 41,
    noVotes: 2,
    votesFor: 41,
    votesAgainst: 2,
    votesAbstain: 1,
    totalEligibleVoters: 50,
    votedUserIds: ['w-sunita-verma'],
    hasVotedUserIds: ['w-sunita-verma'],
  },
  {
    id: 'prop-003',
    proposalCode: 'PROP-2599',
    title: 'Proposal #2599: Mandatory Conflict Resolution Window Before Rating Penalties',
    description:
      'Adopt a 48-hour conciliation period where a designated cooperative peer counselor reviews customer disputes with workers before any rating below 3 stars impacts match rotation priority.',
    category: 'COOP_POLICY',
    proposedBy: 'Ethics & Grievance Sub-Committee',
    startDate: '2026-01-10T00:00:00Z',
    endDate: '2026-01-31T23:59:59Z',
    votingDeadline: '2026-01-31T23:59:59Z',
    status: 'CLOSED',
    yesVotes: 46,
    noVotes: 3,
    votesFor: 46,
    votesAgainst: 3,
    votesAbstain: 0,
    totalEligibleVoters: 50,
    votedUserIds: ['w-arjun-patel', 'w-ramesh-kumar', 'w-sunita-verma'],
    hasVotedUserIds: ['w-arjun-patel', 'w-ramesh-kumar', 'w-sunita-verma'],
  },
];

// 7. Initial Grievances
export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv-001',
    ticketId: 'GRV-26089-01',
    ticketCode: 'GRV-26089-01',
    bookingId: 'bkg-hist-88',
    workerId: 'w-arjun-patel',
    workerName: 'Arjun Patel',
    subject: 'Additional material reimbursement delayed by customer',
    category: 'PAYMENT_DISPUTE',
    description:
      'On booking SM-26-7104, I purchased replacement brass valve for ₹180 with cash invoice. The customer promised to add it to digital payment but missed doing so.',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW',
    date: '2026-02-27T10:00:00Z',
    createdAt: '2026-02-27T10:00:00Z',
    adminResponse: 'Cooperative support contacted Dr. Verma. He confirmed the receipt and agreed to transfer ₹180 directly via UPI. Case being closed upon settlement confirmation.',
    resolutionNotes: 'Cooperative support contacted Dr. Verma. He confirmed the receipt and agreed to transfer ₹180 directly via UPI. Case being closed upon settlement confirmation.',
  },
  {
    id: 'grv-002',
    ticketId: 'GRV-26089-02',
    ticketCode: 'GRV-26089-02',
    workerId: 'w-imran-khan',
    workerName: 'Imran Khan',
    subject: 'Safety concern regarding ungrounded commercial chiller wiring',
    category: 'SAFETY',
    description:
      'Encountered high leakage current in a basement storage unit without proper earth pit. Advised household not to run unit until industrial electrician inspects.',
    priority: 'HIGH',
    status: 'RESOLVED',
    date: '2026-02-22T14:15:00Z',
    createdAt: '2026-02-22T14:15:00Z',
    adminResponse: 'Safety protocol logged. Customer was served advisory notice and agreed to mandatory re-wiring before booking service again. Imran awarded +5 points for diligence.',
    resolutionNotes: 'Safety protocol logged. Customer was served advisory notice and agreed to mandatory re-wiring before booking service again. Imran awarded +5 points for diligence.',
    resolvedAt: '2026-02-23T16:00:00Z',
  },
];

// 8. Initial Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'u-ananya-sen',
    title: 'Booking Confirmed!',
    message: 'Arjun Patel (Plumber) has accepted your service request for Mar 4, 10:00 AM.',
    type: 'BOOKING',
    linkTarget: '/household/bookings',
    isRead: false,
    createdAt: '2026-03-02T15:10:00Z',
  },
  {
    id: 'notif-2',
    userId: 'w-arjun-patel',
    title: 'New Service Request',
    message: 'New plumbing request from Indiranagar (Ananya Sen). Match Score: 95%.',
    type: 'BOOKING',
    linkTarget: '/worker/requests',
    isRead: true,
    createdAt: '2026-03-02T14:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'w-arjun-patel',
    title: 'Active Governance Vote',
    message: 'Cast your vote on Proposal #2601 regarding platform fee reduction from 5% to 4%.',
    type: 'GOVERNANCE',
    linkTarget: '/worker/governance',
    isRead: false,
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'notif-4',
    userId: 'u-admin-rajeshwari',
    title: 'New Worker Application',
    message: 'Deepak Mali submitted KYC documents for Gardening in Whitefield.',
    type: 'SYSTEM',
    linkTarget: '/admin/verification',
    isRead: false,
    createdAt: '2026-03-01T10:00:00Z',
  },
];

// 9. Initial Config
export const INITIAL_CONFIG: PlatformConfig = {
  platformFeePercent: 5.0,
  cooperativeFundPercent: 2.0,
  weightCategoryMatch: 0.4,
  weightLocalityMatch: 0.3,
  weightRating: 0.15,
  weightAvailability: 0.15,
  fairnessBonusMultiplier: 0.25,
  maxJobsPerWeekThreshold: 15,
};

// =============================================================================
// DATABASE STATE HOLDER
// =============================================================================

export interface DatabaseState {
  services: ServiceCategory[];
  workers: WorkerProfile[];
  users: UserProfile[];
  bookings: Booking[];
  transactions: PaymentTransaction[];
  proposals: GovernanceProposal[];
  grievances: GrievanceTicket[];
  notifications: NotificationItem[];
  config: PlatformConfig;
  currentUserId: string; // Active session user ID
}

function loadState(): DatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure required collections exist
      if (parsed.workers && parsed.bookings && parsed.services) {
        // App starts with fresh login page not with any demo account
        if (parsed.currentUserId === 'u-ananya-sen') {
          parsed.currentUserId = '';
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved state, using defaults', e);
  }

  return {
    services: INITIAL_SERVICES,
    workers: INITIAL_WORKERS,
    users: INITIAL_USERS,
    bookings: INITIAL_BOOKINGS,
    transactions: INITIAL_TRANSACTIONS,
    proposals: INITIAL_PROPOSALS,
    grievances: INITIAL_GRIEVANCES,
    notifications: INITIAL_NOTIFICATIONS,
    config: INITIAL_CONFIG,
    currentUserId: '', // Starts with login page not with any demo account
  };
}

// Global Singleton State & Reactive Event Bus
let state: DatabaseState = loadState();
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notify() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Storage sync error', e);
  }
  listeners.forEach((fn) => fn());
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getStoreState(): DatabaseState {
  return state;
}

// =============================================================================
// STORE ACTIONS & MUTATIONS
// =============================================================================

export const store = {
  getStoreState(): DatabaseState {
    return state;
  },

  // Session & Persona Management
  getCurrentUser(): UserProfile | WorkerProfile | undefined {
    const worker = state.workers.find((w) => w.id === state.currentUserId);
    if (worker) return worker;
    return state.users.find((u) => u.id === state.currentUserId);
  },

  setCurrentUser(userId: string) {
    state.currentUserId = userId;
    notify();
    const user = store.getCurrentUser();
    if (user) {
      recordUserLogin(user).catch(() => {});
    }
  },

  findUserByContact(identifier: string): (UserProfile | WorkerProfile) | undefined {
    const clean = identifier.trim().toLowerCase().replace(/[\s\-\(\)\+]/g, '');
    if (!clean) return undefined;

    // Check workers
    const worker = state.workers.find((w) => {
      const emailMatch = w.email && w.email.toLowerCase().trim() === identifier.toLowerCase().trim();
      const phoneClean = (w.phone || '').replace(/[\s\-\(\)\+]/g, '');
      const phoneMatch = phoneClean && (phoneClean.includes(clean) || clean.includes(phoneClean));
      return emailMatch || phoneMatch;
    });
    if (worker) return worker;

    // Check users
    return state.users.find((u) => {
      const emailMatch = u.email && u.email.toLowerCase().trim() === identifier.toLowerCase().trim();
      const phoneClean = (u.phone || '').replace(/[\s\-\(\)\+]/g, '');
      const phoneMatch = phoneClean && (phoneClean.includes(clean) || clean.includes(phoneClean));
      return emailMatch || phoneMatch;
    });
  },

  upsertUser(userData: UserProfile): UserProfile {
    const existingIndex = state.users.findIndex((u) => u.id === userData.id);
    if (existingIndex >= 0) {
      state.users[existingIndex] = { ...state.users[existingIndex], ...userData };
    } else {
      state.users.push(userData);
    }
    notify();
    return userData;
  },

  upsertWorker(workerData: WorkerProfile): WorkerProfile {
    const existingIndex = state.workers.findIndex((w) => w.id === workerData.id);
    if (existingIndex >= 0) {
      state.workers[existingIndex] = { ...state.workers[existingIndex], ...workerData };
    } else {
      state.workers.push(workerData);
    }
    notify();
    return workerData;
  },

  updateUserAvatar(userId: string, avatarUrl: string): UserProfile | WorkerProfile | undefined {
    let updatedUser: UserProfile | WorkerProfile | undefined;

    // 1. Check and update workers
    const workerIndex = state.workers.findIndex((w) => w.id === userId);
    if (workerIndex >= 0) {
      state.workers[workerIndex] = {
        ...state.workers[workerIndex],
        avatarUrl,
      };
      updatedUser = state.workers[workerIndex];

      // Reflect on assigned bookings
      state.bookings.forEach((b) => {
        if (b.workerId === userId) {
          b.workerAvatar = avatarUrl;
        }
      });
    }

    // 2. Check and update users
    const userIndex = state.users.findIndex((u) => u.id === userId);
    if (userIndex >= 0) {
      state.users[userIndex] = {
        ...state.users[userIndex],
        avatarUrl,
      };
      if (!updatedUser) updatedUser = state.users[userIndex];
    }

    notify();

    // 3. Persist to Supabase metadata and tables asynchronously
    if (updatedUser) {
      updateUserProfileMetadataInSupabase(userId, avatarUrl, updatedUser.role).catch((err) => {
        console.warn('Supabase avatar sync notice:', err);
      });
    }

    try {
      window.dispatchEvent(
        new CustomEvent('sevamitra-event', {
          detail: { message: 'Profile picture saved & synced with Supabase metadata' },
        })
      );
    } catch {
      // ignore
    }

    return updatedUser;
  },

  resetDemoData() {
    state = {
      services: INITIAL_SERVICES,
      workers: INITIAL_WORKERS,
      users: INITIAL_USERS,
      bookings: INITIAL_BOOKINGS,
      transactions: INITIAL_TRANSACTIONS,
      proposals: INITIAL_PROPOSALS,
      grievances: INITIAL_GRIEVANCES,
      notifications: INITIAL_NOTIFICATIONS,
      config: INITIAL_CONFIG,
      currentUserId: 'u-ananya-sen',
    };
    notify();
  },

  // Bookings
  getBookings(): Booking[] {
    return state.bookings;
  },

  getBookingById(id: string): Booking | undefined {
    return state.bookings.find((b) => b.id === id);
  },

  createBooking(params: {
    householdId: string;
    householdName: string;
    householdPhone: string;
    householdAddress: string;
    worker: WorkerProfile;
    serviceCategory: string;
    serviceName: string;
    taskDescription: string;
    locality: string;
    pincode: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
    quoteAmount: number;
    matchScore: number;
    fairnessBonus: number;
  }): Booking {
    const feeSplit = calculateTransparentFeeSplit(
      params.quoteAmount,
      state.config.platformFeePercent,
      state.config.cooperativeFundPercent
    );

    const bookingCode = `SM-26-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      bookingCode,
      householdId: params.householdId,
      householdName: params.householdName,
      householdPhone: params.householdPhone,
      householdAddress: params.householdAddress,
      workerId: params.worker.id,
      workerName: params.worker.fullName,
      workerPhone: params.worker.phone,
      serviceCategory: params.serviceCategory,
      serviceName: params.serviceName,
      taskDescription: params.taskDescription,
      locality: params.locality,
      pincode: params.pincode,
      scheduledDate: params.scheduledDate,
      scheduledTimeSlot: params.scheduledTimeSlot,
      status: 'REQUESTED',
      matchScore: params.matchScore,
      fairnessBonus: params.fairnessBonus,
      quoteAmount: feeSplit.grossAmount,
      platformFee: feeSplit.platformFee,
      cooperativeFund: feeSplit.cooperativeFund,
      workerNetPayout: feeSplit.workerNetPayout,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          toStatus: 'REQUESTED',
          timestamp: new Date().toISOString(),
          changedBy: params.householdName,
          notes: 'Service requested through SevaMitra Smart Match Engine',
        },
      ],
    };

    state.bookings = [newBooking, ...state.bookings];

    // Notification for worker
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: params.worker.id,
      title: 'New Service Request Received',
      message: `${params.householdName} has requested ${params.serviceName} at ${params.locality} (Score: ${params.matchScore}%)`,
      type: 'BOOKING',
      linkTarget: '/worker/requests',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    notify();
    syncBookingToSupabase(newBooking).catch(() => {});
    return newBooking;
  },

  updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    changedByName: string,
    notes?: string
  ): Booking | null {
    const booking = state.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const oldStatus = booking.status;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();
    booking.history.push({
      fromStatus: oldStatus,
      toStatus: newStatus,
      timestamp: new Date().toISOString(),
      changedBy: changedByName,
      notes,
    });

    // Notify counterpart
    if (newStatus === 'ACCEPTED') {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: booking.householdId,
        title: 'Request Accepted!',
        message: `${booking.workerName} has accepted your booking for ${booking.scheduledDate}.`,
        type: 'BOOKING',
        linkTarget: '/household/bookings',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } else if (newStatus === 'IN_PROGRESS') {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: booking.householdId,
        title: 'Service In Progress',
        message: `${booking.workerName} has commenced work on your service.`,
        type: 'BOOKING',
        linkTarget: '/household/bookings',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } else if (newStatus === 'COMPLETED') {
      // Update worker job counters
      const worker = state.workers.find((w) => w.id === booking.workerId);
      if (worker) {
        worker.totalCompletedJobs += 1;
        worker.jobsThisWeek += 1;
      }

      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: booking.householdId,
        title: 'Service Completed',
        message: `${booking.workerName} marked your service as complete. Please make the payment.`,
        type: 'BOOKING',
        linkTarget: '/household/bookings',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } else if (newStatus === 'REJECTED') {
      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: booking.householdId,
        title: 'Worker Unavailable',
        message: `${booking.workerName} was unable to accept this request. Please pick another matched worker.`,
        type: 'BOOKING',
        linkTarget: '/household/services',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    notify();
    syncBookingToSupabase(booking).catch(() => {});
    return booking;
  },

  // Payment Settlement (Razorpay Test Mode)
  recordPayment(params: {
    bookingId: string;
    paymentMethod: string;
    razorpayPaymentId: string;
  }): PaymentTransaction | null {
    const booking = state.bookings.find((b) => b.id === params.bookingId);
    if (!booking) return null;

    booking.paymentStatus = 'CAPTURED';
    booking.paymentId = params.razorpayPaymentId;
    booking.razorpayOrderId = `order_${params.razorpayPaymentId.substring(4)}`;

    const tx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      householdName: booking.householdName,
      workerName: booking.workerName,
      serviceName: booking.serviceName,
      grossAmount: booking.quoteAmount,
      platformFee: booking.platformFee,
      cooperativeFund: booking.cooperativeFund,
      workerEarnings: booking.workerNetPayout,
      paymentMethod: params.paymentMethod,
      razorpayPaymentId: params.razorpayPaymentId,
      status: 'CAPTURED',
      timestamp: new Date().toISOString(),
    };

    state.transactions.unshift(tx);

    // Notify worker of net credited earnings
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: booking.workerId,
      title: 'Payment Credited! ₹' + booking.workerNetPayout,
      message: `Net earnings of ₹${booking.workerNetPayout} credited for booking ${booking.bookingCode} (Platform fee: ₹${booking.platformFee}, Coop Fund: ₹${booking.cooperativeFund}).`,
      type: 'PAYMENT',
      linkTarget: '/worker/earnings',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    notify();
    syncBookingToSupabase(booking).catch(() => {});
    return tx;
  },

  submitRating(bookingId: string, ratingScore: number, reviewComment: string) {
    const booking = state.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.ratingScore = ratingScore;
    booking.reviewComment = reviewComment;

    const worker = state.workers.find((w) => w.id === booking.workerId);
    if (worker) {
      const prevTotal = worker.rating * worker.ratingCount;
      worker.ratingCount += 1;
      worker.rating = Math.round(((prevTotal + ratingScore) / worker.ratingCount) * 10) / 10;
    }

    notify();
    syncBookingToSupabase(booking).catch(() => {});
  },

  // Worker KYC Verification
  updateWorkerVerification(
    workerId: string,
    status: 'VERIFIED' | 'REJECTED',
    notes?: string
  ) {
    const worker = state.workers.find((w) => w.id === workerId);
    if (worker) {
      worker.verificationStatus = status;
      if (notes) worker.verificationNotes = notes;
      if (status === 'VERIFIED') {
        worker.isCooperativeMember = true;
        if (worker.cooperativeId.startsWith('APPLICANT')) {
          worker.cooperativeId = `COOP-KAR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        }
      }

      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: workerId,
        title: status === 'VERIFIED' ? 'Profile Verified!' : 'Verification Update',
        message:
          status === 'VERIFIED'
            ? 'Your cooperative worker profile and KYC have been verified by Admin. You are now live in customer matching.'
            : `Your verification status was marked as REJECTED. Notes: ${notes || 'Document mismatch'}`,
        type: 'SYSTEM',
        linkTarget: '/worker/profile',
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      notify();
    }
  },

  // Governance Voting (One Worker = One Vote)
  castVote(proposalId: string, workerId: string, vote: 'YES' | 'NO'): boolean {
    const proposal = state.proposals.find((p) => p.id === proposalId);
    if (!proposal || proposal.status !== 'ACTIVE') return false;

    if (!proposal.votedUserIds) proposal.votedUserIds = [];
    if (proposal.votedUserIds.includes(workerId)) {
      return false; // Already voted!
    }

    proposal.votedUserIds.push(workerId);
    if (vote === 'YES') {
      proposal.yesVotes += 1;
    } else {
      proposal.noVotes += 1;
    }

    notify();
    return true;
  },

  createProposal(params: {
    title: string;
    description: string;
    category: 'PLATFORM_FEES' | 'WORKER_WELFARE' | 'COOP_POLICY' | 'EXPANSION';
    proposedBy: string;
    durationDays: number;
  }): GovernanceProposal {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (params.durationDays || 14));

    const newProp: GovernanceProposal = {
      id: `prop-${Date.now()}`,
      title: params.title,
      description: params.description,
      category: params.category,
      proposedBy: params.proposedBy,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'ACTIVE',
      yesVotes: 0,
      noVotes: 0,
      totalEligibleVoters: state.workers.filter((w) => w.verificationStatus === 'VERIFIED').length || 50,
      votedUserIds: [],
    };

    state.proposals.unshift(newProp);

    // Notify all workers
    state.workers.forEach((w) => {
      state.notifications.unshift({
        id: `notif-${Date.now()}-${w.id}`,
        userId: w.id,
        title: 'New Cooperative Proposal',
        message: `New proposal published: "${params.title}". Exercise your democratic vote!`,
        type: 'GOVERNANCE',
        linkTarget: '/worker/governance',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    });

    notify();
    return newProp;
  },

  // Grievances
  createGrievance(params: {
    bookingId?: string;
    workerId: string;
    workerName: string;
    subject: string;
    category: any;
    description: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }): GrievanceTicket {
    const ticketId = `GRV-26-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: GrievanceTicket = {
      id: `grv-${Date.now()}`,
      ticketId,
      ticketCode: ticketId,
      bookingId: params.bookingId,
      workerId: params.workerId,
      workerName: params.workerName,
      subject: params.subject,
      category: params.category,
      description: params.description,
      priority: params.priority || 'MEDIUM',
      status: 'OPEN',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    state.grievances.unshift(newGrievance);

    // Notify Admin
    state.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'u-admin-rajeshwari',
      title: 'New Worker Grievance Filed',
      message: `[${params.priority}] Ticket ${ticketId} filed by ${params.workerName}: ${params.subject}`,
      type: 'GRIEVANCE',
      linkTarget: '/admin/grievances',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    notify();
    return newGrievance;
  },

  updateGrievance(
    id: string,
    status: 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED',
    adminResponse: string
  ) {
    const grv = state.grievances.find((g) => g.id === id);
    if (grv) {
      grv.status = status;
      grv.adminResponse = adminResponse;
      if (status === 'RESOLVED') {
        grv.resolvedAt = new Date().toISOString();
      }

      state.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: grv.workerId,
        title: `Grievance Ticket ${grv.ticketId} ${status}`,
        message: `Admin update: ${adminResponse}`,
        type: 'GRIEVANCE',
        linkTarget: '/worker/grievances',
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      notify();
    }
  },

  // Platform Config
  updateConfig(newConfig: Partial<PlatformConfig>) {
    state.config = { ...state.config, ...newConfig };
    notify();
  },

  // Worker Profile Updates
  updateWorkerAvailability(workerId: string, isAvailable: boolean) {
    const worker = state.workers.find((w) => w.id === workerId);
    if (worker) {
      worker.isAvailable = isAvailable;
      notify();
    }
  },

  toggleWorkerAvailability(workerId: string) {
    const worker = state.workers.find((w) => w.id === workerId);
    if (worker) {
      worker.isAvailable = !worker.isAvailable;
      notify();
    }
  },

  verifyWorker(workerId: string, status: 'VERIFIED' | 'REJECTED', notes?: string) {
    return this.updateWorkerVerification(workerId, status, notes);
  },

  castGovernanceVote(proposalId: string, workerId: string, choice: any): boolean {
    const prop = state.proposals.find((p) => p.id === proposalId);
    if (prop) {
      if (!prop.hasVotedUserIds) prop.hasVotedUserIds = [];
      if (!prop.hasVotedUserIds.includes(workerId)) prop.hasVotedUserIds.push(workerId);
      if (choice === 'FOR' || choice === 'YES') {
        prop.votesFor = (prop.votesFor || prop.yesVotes || 0) + 1;
      } else if (choice === 'AGAINST' || choice === 'NO') {
        prop.votesAgainst = (prop.votesAgainst || prop.noVotes || 0) + 1;
      } else {
        prop.votesAbstain = (prop.votesAbstain || 0) + 1;
      }
    }
    const vote = choice === 'FOR' || choice === 'YES' ? 'YES' : 'NO';
    return this.castVote(proposalId, workerId, vote);
  },

  createGovernanceProposal(params: {
    title: string;
    description: string;
    category: any;
    votingDeadline?: string;
  }) {
    const prop = this.createProposal({
      title: params.title,
      description: params.description,
      category: params.category,
      proposedBy: 'Cooperative Committee',
      durationDays: 14,
    });
    if (params.votingDeadline) {
      prop.votingDeadline = params.votingDeadline;
    }
    prop.proposalCode = `PROP-${Math.floor(1000 + Math.random() * 9000)}`;
    prop.votesFor = 0;
    prop.votesAgainst = 0;
    prop.votesAbstain = 0;
    prop.hasVotedUserIds = [];
    return prop;
  },

  resolveGrievance(id: string, notes: string) {
    return this.updateGrievance(id, 'RESOLVED', notes);
  },

  updateMatchingWeights(newConfig: any) {
    return this.updateConfig(newConfig);
  },

  updateWorkerServiceAreas(workerId: string, areas: string[]) {
    const worker = state.workers.find((w) => w.id === workerId);
    if (worker) {
      worker.serviceAreas = areas;
      notify();
    }
  },

  markNotificationAsRead(notifId: string) {
    const n = state.notifications.find((notif) => notif.id === notifId);
    if (n) {
      n.isRead = true;
      notify();
    }
  },

  markAllNotificationsAsRead(userId: string) {
    state.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    notify();
  },
};
