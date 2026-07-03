// ============================================================
// ATLAS Performance Management System
// nav.js — Sidebar Navigation Renderer
// ============================================================

import { signOut, ROLE_LABELS } from './auth.js';

// ── SVG icon library ─────────────────────────────────────────
const ICONS = {
  dashboard:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
  reviews:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 12h6M9 8h6M9 16h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>`,
  newReview:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 5v14M5 12h14"/></svg>`,
  autoSelect:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>`,
  officer:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  deltaT:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  ia:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  pip:         `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
  search:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  reports:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 3v18h18"/><path d="M18 9L13 14l-4-4-4 4"/></svg>`,
  admin:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="4"/><path d="M2 20c0-4 4.5-7 10-7s10 3 10 7"/><path d="M19 3l1 1-5 5-2-2 5-5 1 1"/></svg>`,
  agencies:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  settings:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  roster:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  access:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  tickets:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>`,
  content:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  signout:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>`,
  bell:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>`
};

// ── Nav structure by role ─────────────────────────────────────
function getNavItems(role) {
  const base = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard.html', key: 'dashboard' }
  ];

  const reviewItems = [
    { label: 'Reviews', icon: 'reviews', href: '/reviews.html', key: 'reviews' },
    { label: 'New Review', icon: 'newReview', href: '/review-new.html', key: 'review-new' }
  ];

  const operationalItems = [
    { label: 'Auto Select', icon: 'autoSelect', href: '/auto-select.html', key: 'auto-select', roles: ['super_admin','supervisor'] },
    { label: 'Delta T', icon: 'deltaT', href: '/delta-t.html', key: 'delta-t' },
    { label: 'Search', icon: 'search', href: '/search.html', key: 'search' },
    { label: 'Reports', icon: 'reports', href: '/reports.html', key: 'reports' }
  ];

  const restrictedItems = [
    { label: 'IA Cases', icon: 'ia', href: '/ia-cases.html', key: 'ia-cases', roles: ['super_admin','chief','internal_affairs','training_bureau'] },
    { label: 'PIPs', icon: 'pip', href: '/pips.html', key: 'pips', roles: ['super_admin','chief','internal_affairs','training_bureau','supervisor'] }
  ];

  const adminItems = [
    { label: 'Admin Panel', icon: 'admin', href: '/admin.html', key: 'admin', roles: ['super_admin','agency_admin'] },
    { label: 'Agencies', icon: 'agencies', href: '/admin.html', key: 'agencies', roles: ['super_admin'] },
    { label: 'Roster', icon: 'roster', href: '/roster.html', key: 'roster', roles: ['super_admin','agency_admin','supervisor'] },
    { label: 'Access Requests', icon: 'access', href: '/access-requests.html', key: 'access-requests', roles: ['super_admin','agency_admin'] },
    { label: 'Agency Settings', icon: 'settings', href: '/agency-settings.html', key: 'agency-settings', roles: ['super_admin','agency_admin'] },
    { label: 'Trouble Tickets', icon: 'tickets', href: '/tickets.html', key: 'tickets', roles: ['super_admin','agency_admin'] }
  ];

  const contentItems = [
    { label: 'Incident Types & KPIs', icon: 'content', href: '/content-kpi.html', key: 'content-kpi', roles: ['super_admin','agency_admin'] },
    { label: 'Safety Checklist', icon: 'content', href: '/content-safety.html', key: 'content-safety', roles: ['super_admin','agency_admin'] },
    { label: 'Dispositions', icon: 'content', href: '/content-dispositions.html', key: 'content-dispositions', roles: ['super_admin','agency_admin'] },
    { label: 'Rank Structure', icon: 'content', href: '/content-ranks.html', key: 'content-ranks', roles: ['super_admin','agency_admin'] }
  ];

  const sections = [];

  // MAIN
  sections.push({
    label: null,
    items: base
  });

  // REVIEWS — not for agency_admin
  if (role !== 'agency_admin') {
    const reviewSection = {
      label: 'Reviews',
      items: []
    };
    // All reviewing roles see review list
    if (['super_admin','chief','internal_affairs','training_bureau','supervisor'].includes(role)) {
      reviewSection.items.push(reviewItems[0]);
    }
    // Only roles that conduct reviews see New Review
    if (['internal_affairs','training_bureau','supervisor'].includes(role)) {
      reviewSection.items.push(reviewItems[1]);
    }
    if (reviewSection.items.length) sections.push(reviewSection);
  }

  // OPERATIONS
  if (role !== 'agency_admin') {
    const opsSection = {
      label: 'Operations',
      items: operationalItems.filter(item =>
        !item.roles || item.roles.includes(role)
      )
    };
    if (opsSection.items.length) sections.push(opsSection);
  }

  // RESTRICTED CASES
  const caseSection = {
    label: 'Cases',
    items: restrictedItems.filter(item =>
      !item.roles || item.roles.includes(role)
    )
  };
  if (caseSection.items.length) sections.push(caseSection);

  // ADMINISTRATION
  const adminSection = {
    label: 'Administration',
    items: adminItems.filter(item =>
      !item.roles || item.roles.includes(role)
    )
  };
  if (adminSection.items.length) sections.push(adminSection);

  // CONTENT MANAGEMENT
  if (['super_admin','agency_admin'].includes(role)) {
    sections.push({
      label: 'Content',
      items: contentItems
    });
  }

  return sections;
}

// ── Render sidebar ────────────────────────────────────────────
export function renderNav(profile, activePage = '') {
  const container = document.getElementById('sidebar');
  if (!container) return;

  const agencyName = profile?.agencies?.name || '';
  const initials   = getInitials(profile?.full_name || '?');
  const sections   = getNavItems(profile?.role);
  const currentKey = activePage || getCurrentPageKey();

  container.innerHTML = `
    <div class="sidebar-header">
      <img src="logo.png" alt="ATLAS" class="sidebar-logo-img">
      <div class="sidebar-logo-text">ATL<span>A</span>S</div>
    </div>
    ${agencyName ? `<div class="sidebar-agency">${escHtml(agencyName)}</div>` : ''}

    <nav class="sidebar-nav">
      ${sections.map(section => `
        <div class="nav-section">
          ${section.label ? `<div class="nav-section-label">${section.label}</div>` : ''}
          ${section.items.map(item => `
            <a href="${item.href}"
               class="nav-item ${currentKey === item.key ? 'active' : ''}"
               data-key="${item.key}">
              ${ICONS[item.icon] || ''}
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
            </a>
          `).join('')}
        </div>
      `).join('')}
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-avatar">${escHtml(initials)}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${escHtml(profile?.full_name || 'Unknown')}</div>
          <div class="sidebar-user-role">${ROLE_LABELS[profile?.role] || profile?.role || ''}</div>
        </div>
        <button class="sidebar-signout-btn" id="signout-btn">
          ${ICONS.signout}
          Sign Out
        </button>
      </div>
    </div>
  `;

  document.getElementById('signout-btn')?.addEventListener('click', async () => {
    await signOut();
  });
}

// ── Render topbar ─────────────────────────────────────────────
export function renderTopbar(title = '', unreadCount = 0) {
  const container = document.getElementById('topbar');
  if (!container) return;

  container.innerHTML = `
    <div class="topbar-title">${escHtml(title)}</div>
    <div class="topbar-actions">
      <button class="notif-btn" id="notif-btn" title="Notifications">
        ${ICONS.bell}
        ${unreadCount > 0 ? '<span class="notif-dot"></span>' : ''}
      </button>
    </div>
  `;
}

// ── Helpers ───────────────────────────────────────────────────

function getCurrentPageKey() {
  const page = window.location.pathname.split('/').pop().replace('.html', '');
  return page || 'dashboard';
}

function getInitials(name) {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
