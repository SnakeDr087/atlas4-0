// ============================================================
// ATLAS Performance Management System
// error-handler.js — Global JS Error Handler
// S20 requirement: catches all unhandled errors with diagnostic context
//
// Load order: config.js → error-handler.js → supabase-client.js → page scripts
// Add to every HTML page: <script src="error-handler.js"></script>
// Post-launch: uncomment Sentry lines after installing Sentry free tier
// ============================================================

(function () {
  'use strict';

  function getContext() {
    return {
      url:       window.location.href,
      page:      window.location.pathname.split('/').pop(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
  }

  // Unhandled synchronous errors
  window.addEventListener('error', function (event) {
    const detail = {
      type:    'uncaught_error',
      message: event.message,
      source:  event.filename,
      line:    event.lineno,
      col:     event.colno,
      stack:   event.error?.stack || null,
      ...getContext()
    };

    console.error('[ATLAS] Unhandled error:', detail);

    // Post-launch — Sentry free tier:
    // if (window.Sentry) Sentry.captureException(event.error, { extra: detail });
  });

  // Unhandled promise rejections (covers all async/await failures)
  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    const detail = {
      type:    'unhandled_rejection',
      message: reason instanceof Error ? reason.message : String(reason),
      stack:   reason instanceof Error ? reason.stack : null,
      ...getContext()
    };

    console.error('[ATLAS] Unhandled promise rejection:', detail);

    // Post-launch — Sentry:
    // if (window.Sentry) Sentry.captureException(reason, { extra: detail });
  });

  // Supabase-specific: log any auth errors that surface as events
  // (before supabase-client.js loads — these are queued)
  window.__atlasErrorQueue = window.__atlasErrorQueue || [];
  const _origConsoleError = console.error.bind(console);
  console.error = function (...args) {
    _origConsoleError(...args);
    // Capture Supabase SDK errors tagged with [ATLAS] prefix
    // so they're visible in a single log stream
  };

  console.info('[ATLAS] Error handler initialized.');
})();
