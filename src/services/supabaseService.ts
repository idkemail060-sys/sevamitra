/**
 * SEVAMITRA - Supabase Realtime & Persistence Synchronization Service
 * Project ID: kzplzrzhzbdkcgpccmjo
 * 
 * Synchronizes booking records, user logins, and registrations directly with Supabase.
 */

import { supabase, isSupabaseConfigured, SUPABASE_PROJECT_ID, SUPABASE_URL } from './supabaseClient';
import { Booking, UserProfile, WorkerProfile, PaymentTransaction } from '../types';
import { getStoreState } from './store';

export interface SupabaseSyncStatus {
  isConfigured: boolean;
  isConnected: boolean;
  projectId: string;
  url: string;
  lastSyncedAt: string | null;
  lastError: string | null;
  tableCounts: {
    bookings: number;
    users: number;
    workers: number;
  };
}

let syncStatus: SupabaseSyncStatus = {
  isConfigured: isSupabaseConfigured,
  isConnected: false,
  projectId: SUPABASE_PROJECT_ID,
  url: SUPABASE_URL,
  lastSyncedAt: null,
  lastError: null,
  tableCounts: {
    bookings: 0,
    users: 0,
    workers: 0,
  },
};

type SyncListener = (status: SupabaseSyncStatus) => void;
const listeners = new Set<SyncListener>();

function notifySyncChange() {
  listeners.forEach((fn) => fn({ ...syncStatus }));
}

export function subscribeToSupabaseSync(listener: SyncListener): () => void {
  listeners.add(listener);
  listener({ ...syncStatus });
  return () => {
    listeners.delete(listener);
  };
}

export function getSupabaseSyncStatus(): SupabaseSyncStatus {
  return { ...syncStatus };
}

/**
 * Format a Booking object into the Supabase database row schema
 */
function bookingToDbRow(b: Booking) {
  return {
    id: b.id,
    booking_code: b.bookingCode,
    household_id: b.householdId,
    household_name: b.householdName,
    household_phone: b.householdPhone || null,
    household_address: b.householdAddress || null,
    worker_id: b.workerId,
    worker_name: b.workerName,
    worker_phone: b.workerPhone || null,
    worker_avatar: b.workerAvatar || null,
    service_category: b.serviceCategory,
    service_name: b.serviceName,
    task_description: b.taskDescription || null,
    locality: b.locality || null,
    pincode: b.pincode || null,
    scheduled_date: b.scheduledDate,
    scheduled_time_slot: b.scheduledTimeSlot,
    status: b.status,
    match_score: b.matchScore || 0,
    fairness_bonus: b.fairnessBonus || 0,
    quote_amount: b.quoteAmount,
    platform_fee: b.platformFee,
    cooperative_fund: b.cooperativeFund,
    worker_net_payout: b.workerNetPayout,
    payment_status: b.paymentStatus,
    payment_id: b.paymentId || null,
    razorpay_order_id: b.razorpayOrderId || null,
    rating_score: b.ratingScore || null,
    review_comment: b.reviewComment || null,
    history: b.history || [],
    created_at: b.createdAt || new Date().toISOString(),
    updated_at: b.updatedAt || new Date().toISOString(),
  };
}

/**
 * Convert a Supabase database row back to our Booking object
 */
function dbRowToBooking(row: any): Booking {
  return {
    id: row.id,
    bookingCode: row.booking_code,
    householdId: row.household_id,
    householdName: row.household_name,
    householdPhone: row.household_phone || '',
    householdAddress: row.household_address || '',
    workerId: row.worker_id,
    workerName: row.worker_name,
    workerPhone: row.worker_phone || '',
    workerAvatar: row.worker_avatar || undefined,
    serviceCategory: row.service_category,
    serviceName: row.service_name,
    taskDescription: row.task_description || '',
    locality: row.locality || '',
    pincode: row.pincode || '',
    scheduledDate: row.scheduled_date,
    scheduledTimeSlot: row.scheduled_time_slot,
    status: row.status,
    matchScore: Number(row.match_score || 0),
    fairnessBonus: Number(row.fairness_bonus || 0),
    quoteAmount: Number(row.quote_amount || 0),
    platformFee: Number(row.platform_fee || 0),
    cooperativeFund: Number(row.cooperative_fund || 0),
    workerNetPayout: Number(row.worker_net_payout || 0),
    paymentStatus: row.payment_status || 'PENDING',
    paymentId: row.payment_id || undefined,
    razorpayOrderId: row.razorpay_order_id || undefined,
    ratingScore: row.rating_score ? Number(row.rating_score) : undefined,
    reviewComment: row.review_comment || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    history: Array.isArray(row.history) ? row.history : [],
  };
}

/**
 * Convert a UserProfile to a Supabase users row
 */
function userToDbRow(u: UserProfile, isLogin = false) {
  return {
    id: u.id,
    email: u.email,
    phone: u.phone,
    full_name: u.fullName,
    role: u.role,
    locality: u.locality || null,
    pincode: u.pincode || null,
    address: u.address || null,
    avatar_url: u.avatarUrl || null,
    last_login_at: isLogin ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
    created_at: u.createdAt || new Date().toISOString(),
  };
}

/**
 * Convert a WorkerProfile to a Supabase workers row
 */
function workerToDbRow(w: WorkerProfile, isLogin = false) {
  return {
    id: w.id,
    email: w.email,
    phone: w.phone,
    full_name: w.fullName,
    role: 'WORKER',
    service_category: w.serviceCategory,
    skills: w.skills || [],
    experience_years: w.experienceYears || 0,
    service_areas: w.serviceAreas || [],
    primary_pincode: w.primaryPincode || w.pincode,
    locality: w.locality || null,
    pincode: w.pincode || null,
    verification_status: w.verificationStatus,
    verification_notes: w.verificationNotes || null,
    rating: w.rating || 5.0,
    rating_count: w.ratingCount || 0,
    total_completed_jobs: w.totalCompletedJobs || 0,
    jobs_this_week: w.jobsThisWeek || 0,
    is_available: w.isAvailable ?? true,
    is_cooperative_member: w.isCooperativeMember ?? true,
    cooperative_id: w.cooperativeId || null,
    cooperative_branch: w.cooperativeBranch || null,
    kyc_document_type: w.kycDocumentType || null,
    kyc_document_url: w.kycDocumentUrl || null,
    bio: w.bio || null,
    avatar_url: w.avatarUrl || null,
    last_login_at: isLogin ? new Date().toISOString() : undefined,
    updated_at: new Date().toISOString(),
    created_at: w.createdAt || new Date().toISOString(),
  };
}

/**
 * Check connection to Supabase database
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!supabase) {
    syncStatus.isConnected = false;
    syncStatus.lastError = 'Supabase client not initialized';
    notifySyncChange();
    return { ok: false, message: syncStatus.lastError };
  }

  try {
    const { data, error } = await supabase.from('bookings').select('id').limit(1);
    if (error) {
      // Could be because table hasn't been created yet
      if (error.message && (error.message.includes('relation "public.bookings" does not exist') || error.code === '42P01')) {
        syncStatus.isConnected = true; // Connection is valid, table just needs creation in Supabase SQL Editor
        syncStatus.lastError = 'Connected, but "bookings" table not created yet. Please execute the provided SQL script in Supabase SQL editor.';
        notifySyncChange();
        return { ok: true, message: syncStatus.lastError };
      }
      syncStatus.isConnected = false;
      syncStatus.lastError = error.message;
      notifySyncChange();
      return { ok: false, message: error.message };
    }

    syncStatus.isConnected = true;
    syncStatus.lastError = null;
    syncStatus.lastSyncedAt = new Date().toISOString();
    notifySyncChange();
    return { ok: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    syncStatus.isConnected = false;
    syncStatus.lastError = err?.message || 'Connection failed';
    notifySyncChange();
    return { ok: false, message: syncStatus.lastError };
  }
}

/**
 * Save or update a booking in Supabase
 */
export async function syncBookingToSupabase(booking: Booking): Promise<boolean> {
  if (!supabase) return false;

  try {
    const row = bookingToDbRow(booking);
    const { error } = await supabase.from('bookings').upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase booking upsert notice:', error.message);
      syncStatus.lastError = error.message;
      notifySyncChange();
      return false;
    }

    syncStatus.isConnected = true;
    syncStatus.lastSyncedAt = new Date().toISOString();
    syncStatus.lastError = null;
    notifySyncChange();
    return true;
  } catch (e: any) {
    console.warn('Supabase booking sync error:', e);
    return false;
  }
}

/**
 * Save user profile and log their login event in Supabase
 */
export async function recordUserLogin(user: UserProfile | WorkerProfile): Promise<boolean> {
  if (!supabase) return false;

  try {
    if (user.role === 'WORKER') {
      const row = workerToDbRow(user as WorkerProfile, true);
      const { error } = await supabase.from('workers').upsert(row, { onConflict: 'id' });
      if (error) console.warn('Supabase worker login sync notice:', error.message);
    } else {
      const row = userToDbRow(user, true);
      const { error } = await supabase.from('users').upsert(row, { onConflict: 'id' });
      if (error) console.warn('Supabase user login sync notice:', error.message);
    }

    syncStatus.isConnected = true;
    syncStatus.lastSyncedAt = new Date().toISOString();
    notifySyncChange();
    return true;
  } catch (e) {
    console.warn('Supabase login sync error:', e);
    return false;
  }
}

/**
 * Save new user registration to Supabase
 */
export async function saveUserRegistration(user: UserProfile | WorkerProfile): Promise<boolean> {
  return recordUserLogin(user);
}

/**
 * Save the user's avatar image URL to the user profile metadata and tables in Supabase.
 * - Updates Supabase Auth user_metadata if active session exists
 * - Updates public.users or public.workers database table with avatar_url
 * - Updates related booking records for real-time visibility across clients
 */
export async function updateUserProfileMetadataInSupabase(
  userId: string,
  avatarUrl: string,
  role?: string
): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return { success: false, message: 'Supabase client not initialized' };
  }

  try {
    // 1. If Supabase auth session exists, update user metadata
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        await supabase.auth.updateUser({
          data: {
            avatar_url: avatarUrl,
            profile_picture: avatarUrl,
            updated_at: new Date().toISOString(),
          },
        });
      }
    } catch (authErr) {
      console.warn('Notice updating auth user_metadata:', authErr);
    }

    // 2. Update the public database tables
    const isWorker = role === 'WORKER' || userId.startsWith('w-');
    if (isWorker) {
      const { error: workerErr } = await supabase
        .from('workers')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (workerErr) {
        console.warn('Supabase workers avatar update notice:', workerErr.message);
      }

      // Also update worker_avatar in bookings
      await supabase
        .from('bookings')
        .update({ worker_avatar: avatarUrl })
        .eq('worker_id', userId);
    } else {
      const { error: userErr } = await supabase
        .from('users')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (userErr) {
        console.warn('Supabase users avatar update notice:', userErr.message);
      }
    }

    syncStatus.isConnected = true;
    syncStatus.lastSyncedAt = new Date().toISOString();
    notifySyncChange();

    return {
      success: true,
      message: 'Profile picture saved to Supabase metadata and synced successfully!',
    };
  } catch (err: any) {
    console.warn('Error saving profile picture to Supabase:', err);
    return { success: false, message: err?.message || 'Failed to update metadata in Supabase' };
  }
}

/**
 * Pull all bookings from Supabase and merge into local application state
 */
export async function pullBookingsFromSupabase(): Promise<Booking[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      if (error) console.warn('Supabase pull bookings notice:', error.message);
      return [];
    }

    const bookings: Booking[] = data.map(dbRowToBooking);
    syncStatus.tableCounts.bookings = bookings.length;
    syncStatus.isConnected = true;
    syncStatus.lastSyncedAt = new Date().toISOString();
    notifySyncChange();

    return bookings;
  } catch (e) {
    console.warn('Supabase pull bookings error:', e);
    return [];
  }
}

/**
 * Push all local store bookings and users to Supabase to initialize cloud database
 */
export async function seedLocalDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) return { success: false, message: 'Supabase client not configured' };

  try {
    const state = getStoreState();

    // 1. Sync Users
    const userRows = state.users.map((u) => userToDbRow(u));
    const { error: usersError } = await supabase.from('users').upsert(userRows, { onConflict: 'id' });
    if (usersError && !usersError.message.includes('does not exist')) {
      console.warn('Notice seeding users:', usersError.message);
    }

    // 2. Sync Workers
    const workerRows = state.workers.map((w) => workerToDbRow(w));
    const { error: workersError } = await supabase.from('workers').upsert(workerRows, { onConflict: 'id' });
    if (workersError && !workersError.message.includes('does not exist')) {
      console.warn('Notice seeding workers:', workersError.message);
    }

    // 3. Sync Bookings
    const bookingRows = state.bookings.map((b) => bookingToDbRow(b));
    const { error: bookingsError } = await supabase.from('bookings').upsert(bookingRows, { onConflict: 'id' });
    if (bookingsError) {
      if (bookingsError.message.includes('does not exist')) {
        return {
          success: false,
          message: 'Tables do not exist yet in Supabase. Run the SQL setup script first in Supabase SQL editor.',
        };
      }
      return { success: false, message: bookingsError.message };
    }

    syncStatus.isConnected = true;
    syncStatus.lastSyncedAt = new Date().toISOString();
    syncStatus.lastError = null;
    notifySyncChange();

    return {
      success: true,
      message: `Successfully synced ${state.bookings.length} bookings, ${state.users.length} users, and ${state.workers.length} workers to Supabase!`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Sync failed' };
  }
}

/**
 * Initialize bidirectional synchronization and realtime listeners
 */
export function initSupabaseRealtime(onRemoteBookingChange?: (booking: Booking) => void) {
  if (!supabase) return () => {};

  // 1. Test initial health
  testSupabaseConnection().then(async (res) => {
    if (res.ok) {
      // Pull latest bookings
      const remoteBookings = await pullBookingsFromSupabase();
      if (remoteBookings.length > 0) {
        const state = getStoreState();
        // Merge remote bookings into state
        const existingIds = new Set(state.bookings.map((b) => b.id));
        const newFromRemote = remoteBookings.filter((b) => !existingIds.has(b.id));
        
        // Also update existing with remote latest status
        const updatedLocal = state.bookings.map((localB) => {
          const remoteMatch = remoteBookings.find((rb) => rb.id === localB.id);
          return remoteMatch || localB;
        });

        state.bookings = [...newFromRemote, ...updatedLocal];
      }
    }
  });

  // 2. Setup Realtime subscription on bookings table
  const channel = supabase
    .channel('realtime:bookings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      (payload) => {
        if (payload.new && (payload.new as any).id) {
          const updatedBooking = dbRowToBooking(payload.new);
          const state = getStoreState();
          const idx = state.bookings.findIndex((b) => b.id === updatedBooking.id);
          if (idx >= 0) {
            state.bookings[idx] = updatedBooking;
          } else {
            state.bookings.unshift(updatedBooking);
          }
          if (onRemoteBookingChange) {
            onRemoteBookingChange(updatedBooking);
          }
          syncStatus.lastSyncedAt = new Date().toISOString();
          notifySyncChange();
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}
