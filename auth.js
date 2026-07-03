// ============================================================
// ATLAS Performance Management System
// auth.js — Authentication + Role Routing Module
// ============================================================

import { supabase } from './supabase-client.js';

// ── Role definitions ─────────────────────────────────────────
export const ROLES = {
  SUPER_ADMIN:      'super_admin',
  CHIEF:            'chief',
  INTERNAL_AFFAIRS: 'internal_affairs',
  TRAINING_BUREAU:  'training_bureau',
  AGENCY_ADMIN:     'agency_admin',
  SUPERVISOR:       'supervisor'
};

// Human-readable role labels
export const ROLE_LABELS = {
  super_admin:      'Super Admin',
  chief:            'Chief / Executive',
  internal_affairs: 'Internal Affairs',
  training_bureau:  'Training Bureau',
  agency_admin:     'Agency Admin',
  supervisor:       'Supervisor'
};

// Pages accessible by role (any role not listed = denied)
const ROLE_PERMISSIONS = {
  // Auth pages — accessible to all (unauthenticated)
  'login.html':            ['*'],
  'forgot-password.html':  ['*'],
  'reset-password.html':   ['*'],

  // Core — all authenticated roles
  'dashboard.html':        ['super_admin','chief','internal_affairs','training_bureau','agency_admin','supervisor'],
  'reviews.html':          ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'review-new.html':       ['agency_admin','internal_affairs','training_bureau','supervisor'],
  'review-detail.html':    ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'auto-select.html':      ['super_admin','supervisor'],
  'officer-profile.html':  ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'delta-t.html':          ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'search.html':           ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'reports.html':          ['super_admin','chief','internal_affairs','training_bureau','supervisor'],

  // Restricted
  'ia-cases.html':         ['super_admin','chief','internal_affairs','training_bureau'],
  'ia-case-detail.html':   ['super_admin','chief','internal_affairs','training_bureau'],
  'pips.html':             ['super_admin','chief','internal_affairs','training_bureau','supervisor'],
  'pip-detail.html':       ['super_admin','chief','internal_affairs','training_bureau','supervisor'],

  // Administration
  'admin.html':            ['super_admin','agency_admin'],
  'agency-settings.html':  ['super_admin','agency_admin'],
  'roster.html':           ['super_admin','agency_admin','supervisor'],
  'access-requests.html':  ['super_admin','agency_admin'],
  'tickets.html':          ['super_admin','agency_admin'],

  // Content management
  'content-kpi.html':      ['super_admin','agency_admin'],
  'content-safety.html':   ['super_admin','agency_admin'],
  'content-dispositions.html': ['super_admin','agency_admin'],
  'content-ranks.html':    ['super_admin','agency_admin']
};

// ── In-memory session cache ──────────────────────────────────
let _currentUser    = null;
let _currentProfile = null;

// ── Public API ───────────────────────────────────────────────

/**
 * Initialize auth on every page load.
 * Call this at the top of each page script.
 *
 * @param {object} options
 * @param {boolean} options.requireAuth   - Redirect to login if no session (default true)
 * @param {string[]} options.allowRoles   - Array of allowed roles. Empty = any authenticated role.
 * @returns {Promise<{user, profile}>}
 */
export async function initAuth({ requireAuth = true, allowRoles = [] } = {}) {
  // Clear overflowed localStorage — quota exceeded breaks getSession silently
  try {
    const testKey = '__atlas_storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
  } catch(storageErr) {
    console.warn('[ATLAS Auth] localStorage quota exceeded — clearing all cached data');
    try {
      // Clear everything except critical auth tokens
      const keep = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sb-') || k.includes('supabase.auth'))) keep.push([k, localStorage.getItem(k)]);
      }
      localStorage.clear();
      keep.forEach(([k, v]) => { try { localStorage.setItem(k, v); } catch(e) {} });
    } catch(e2) {
      try { localStorage.clear(); } catch(e3) {}
    }
  }

  // Race getSession against an 8-second timeout — prevents infinite spinner
  let session, error;
  try {
    const result = await Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session check timed out after 8s')), 8000)
      )
    ]);
    session = result.data?.session;
    error   = result.error;
  } catch(timeoutErr) {
    console.error('[ATLAS Auth] getSession timeout:', timeoutErr.message);
    if (requireAuth) redirectToLogin();
    return { user: null, profile: null };
  }

  if (error) {
    console.error('[ATLAS Auth] getSession error:', error.message);
  }

  if (!session) {
    if (requireAuth) {
      redirectToLogin();
    }
    return { user: null, profile: null };
  }

  _currentUser = session.user;

  // Fetch profile (cached after first load) — agency decoupled from the
  // profile read so agencies-table RLS can never block the core read.
  if (!_currentProfile) {
    const profile = await loadProfile(_currentUser.id);
    if (!profile) {
      console.error('[ATLAS Auth] Profile fetch failed for user', _currentUser.id);
      await signOut();
      return { user: null, profile: null };
    }
    _currentProfile = profile;
  }

  // Role check
  if (allowRoles.length > 0 && !allowRoles.includes(_currentProfile.role)) {
    redirectToDenied();
    return { user: null, profile: null };
  }

  // Check page-level permissions
  const page = getCurrentPage();
  if (!isPageAllowed(page, _currentProfile.role)) {
    redirectToDenied();
    return { user: null, profile: null };
  }

  return { user: _currentUser, profile: _currentProfile };
}

/**
 * Sign in with email and password.
 * Returns the profile on success.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { profile: null, error: error.message };
  }

  _currentUser = data.user;

  const profile = await loadProfile(_currentUser.id);

  if (!profile) {
    return { profile: null, error: 'Account exists but profile not found. Contact your administrator.' };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return { profile: null, error: 'Your account has been deactivated. Contact your administrator.' };
  }

  _currentProfile = profile;

  // Log the sign-in
  await logActivity('user_signed_in', 'profile', _currentUser.id);

  return { profile, error: null };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  _currentUser    = null;
  _currentProfile = null;
  await supabase.auth.signOut();
  window.location.href = '/login.html';
}

/**
 * Send password reset email.
 */
export async function sendPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`
  });
  return { error: error?.message || null };
}

/**
 * Update password (used on reset-password page after OTP redirect).
 */
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message || null };
}

/**
 * Get the cached current profile. Must call initAuth() first.
 */
export function getCurrentProfile() {
  return _currentProfile;
}

/**
 * Get the cached current user. Must call initAuth() first.
 */
export function getCurrentUser() {
  return _currentUser;
}

/**
 * Check if current user has one of the given roles.
 */
export function hasRole(...roles) {
  return _currentProfile ? roles.includes(_currentProfile.role) : false;
}

/**
 * Check if current user is Super Admin.
 */
export function isSuperAdmin() {
  return hasRole(ROLES.SUPER_ADMIN);
}

// ── Role-based UI gating ─────────────────────────────────────

/**
 * Show/hide DOM elements based on role.
 * Elements with [data-role-only="super_admin,chief"] are hidden unless
 * the current user has one of the listed roles.
 */
export function applyRoleVisibility() {
  if (!_currentProfile) return;

  const role = _currentProfile.role;

  // Show elements that match current role
  document.querySelectorAll('[data-role-only]').forEach(el => {
    const allowed = el.dataset.roleOnly.split(',').map(r => r.trim());
    if (allowed.includes(role)) {
      el.style.display = '';
    }
  });

  // Hide elements that exclude current role
  document.querySelectorAll('[data-role-hide]').forEach(el => {
    const excluded = el.dataset.roleHide.split(',').map(r => r.trim());
    if (excluded.includes(role)) {
      el.style.display = 'none';
    }
  });
}

// ── Navigation helpers ───────────────────────────────────────

export function redirectToLogin() {
  const current = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/login.html?redirect=${current}`;
}

export function redirectToDenied() {
  window.location.href = '/dashboard.html?error=access_denied';
}

export function redirectToDashboard() {
  window.location.href = '/dashboard.html';
}

// ── Internal helpers ─────────────────────────────────────────

/**
 * Load a profile by user id, decoupled from the agencies join.
 *
 * Reading the profile by itself means agencies-table RLS or a missing
 * agency row can never block the core profile read — the most common
 * cause of spurious "profile not found" errors. The agency is fetched
 * separately and attached as profile.agencies (an object or null), so
 * existing `profile.agencies?.name` usage keeps working unchanged.
 *
 * @returns {Promise<object|null>} the profile, or null if not readable
 */
async function loadProfile(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[ATLAS Auth] profiles read error:', error.message);
    return null;
  }
  if (!profile) {
    console.error('[ATLAS Auth] No profile row visible for user', userId,
      '— verify the profiles SELECT RLS policy allows self-read (id = auth.uid()).');
    return null;
  }

  // Attach agency separately — never blocks the profile read.
  profile.agencies = null;
  if (profile.agency_id) {
    const { data: agency } = await supabase
      .from('agencies')
      .select('name, state')
      .eq('id', profile.agency_id)
      .maybeSingle();
    profile.agencies = agency || null;
  }

  return profile;
}

function getCurrentPage() {
  const path = window.location.pathname;
  return path.split('/').pop() || 'dashboard.html';
}

function isPageAllowed(page, role) {
  const allowed = ROLE_PERMISSIONS[page];
  if (!allowed) return true; // unlisted pages are open
  if (allowed.includes('*')) return true;
  return allowed.includes(role);
}

async function logActivity(action, targetType = null, targetId = null, metadata = null) {
  try {
    await supabase.from('activity_log').insert({
      agency_id:   _currentProfile?.agency_id || null,
      actor_id:    _currentUser?.id || null,
      action,
      target_type: targetType,
      target_id:   targetId,
      metadata
    });
  } catch (e) {
    // Non-fatal — log silently
    console.warn('[ATLAS] Activity log failed:', e.message);
  }
}

// ── Session listener ─────────────────────────────────────────
// Redirect to login if session expires while user is on the app
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    const page = getCurrentPage();
    const authPages = ['login.html', 'forgot-password.html', 'reset-password.html'];
    if (!authPages.includes(page)) {
      redirectToLogin();
    }
  }
});
