// ============================================================
// ATLAS Performance Management System
// supabase-client.js — Supabase JS v2 client
// Uses Proxy for lazy initialization to avoid timing issues
// with config.js loading order.
// Load order: config.js → supabase-client.js → all other modules
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

let _client = null;

function initClient() {
  if (_client) return _client;

  const cfg = window.ATLAS_CONFIG;
  if (!cfg || !cfg.supabaseUrl || !cfg.supabaseKey) {
    throw new Error(
      '[ATLAS] window.ATLAS_CONFIG is not defined or incomplete. ' +
      'Ensure config.js is loaded before supabase-client.js.'
    );
  }

  _client = createClient(cfg.supabaseUrl, cfg.supabaseKey, {
    auth: {
      autoRefreshToken:  true,
      persistSession:    true,
      detectSessionInUrl: true
    }
  });

  return _client;
}

// Proxy so callers can do `supabase.from(...)` without worrying
// about whether initClient() has been called yet.
export const supabase = new Proxy({}, {
  get(_target, prop) {
    return initClient()[prop];
  }
});
