ATLAS 4.3 — Agency Admin page fixes
====================================

NO SQL this round. GitHub upload only (all 5 replace existing files):
   dashboard.html      (agency admin dashboard: metrics + filters + Delta T + New Review)
   admin.html          (data separation: no agency management for agency admins)
   auth.js             (agency admin may author reviews)
   nav.js              (agency admin sees the New Review link)
   review-new.html     (agency admin allowed on the page)

WHAT CHANGED (by your 4 items)

1) Admin page / data separation
   - The "Agencies" tab (list all agencies + Add Agency + Activate/Deactivate)
     is now SUPER ADMIN ONLY. Agency admins land directly on Portal Users and
     never see or load other agencies.
   - Add-User: the agency field is locked to the admin's own agency.
   - Portal Users was already scoped to the agency (unchanged).

2) Agency admin can create a review
   - Added to review-new in all four gates: nav link, page permission,
     page allow-list, and a "+ New Review" button on the dashboard.

3) Dashboard metrics
   - Stat cards: Total Reviews, Active Delta T, Overdue Delta T, Officers.
   - "Review Records" table with filters: date From/To, Officer, Incident
     Type, and Follow-up (No Action, Commendation, Coaching, Training,
     IA Notification, PIP). Filtering is instant; "Showing N of M" counter;
     each row opens the review.

4) Delta T on the dashboard
   - Agency-wide Active and Overdue Delta T counts as stat cards, plus a
     Delta T quick link.

TEST (Chrome, Incognito) as an AGENCY ADMIN for "Anytown":
   - Admin Panel: no Agencies tab; only Portal Users (Anytown users only).
   - Dashboard: stat cards populate; the Review Records filters work.
   - Click "+ New Review": the page loads and the officer picker shows the
     Anytown roster; create and SAVE a review.

IMPORTANT TEST NOTE
   Saving a review as agency_admin writes to bwc_reviews with
   agency_id = the admin's agency. If SAVE fails with a permissions error,
   the bwc_reviews INSERT policy (RLS) needs agency_admin added for their
   own agency — tell me and I'll write that patch. Everything else here is
   front-end only.
