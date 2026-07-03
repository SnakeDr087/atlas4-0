ATLAS 4.3 — Dispositions (managed, with shared baseline + suppressions)
=======================================================================

WHAT THIS DOES
  The 11 hardcoded disposition checkboxes are now real, managed data,
  using the SAME model as incident types / KPIs / safety items:
  Super Admin owns the baseline; each agency can Remove baseline items,
  Restore them, and Add its own.

  Existing reviews are unaffected: the disposition table is keyed on the
  same short CODES already stored on reviews (e.g. 'arrest_made'), so
  every past review still reads correctly.

ORDER OF OPERATIONS  (run SQL FIRST, then upload files)

1) SUPABASE — run once in the SQL Editor:
   patch-011-disposition-types.sql
   (Creates disposition_types + seeds the 11 baseline values.
    Requires patch-009 and patch-010 to have been run already.)

2) GITHUB — upload these files (replace existing; one is new):
   content-dispositions.html   (NEW management page)
   nav.js                      (adds the Dispositions menu link)
   auth.js                     (allows super_admin + agency_admin on the page)
   review-new.html             (loads disposition checkboxes from the table)
   review-report.html          (labels dispositions from the table)
   review-detail.html          (labels dispositions from the table; also
                                fixes an old bug where multiple dispositions
                                were not split correctly)

HOW TO TEST (Chrome, Incognito)
  - As Super Admin: open Dispositions. You should see the 11 baseline rows
    and be able to Add / Rename / Deactivate / Delete them.
  - As Agency Admin: open Dispositions. Baseline rows show "Remove";
    removing one greys it ("Removed"), with a "Restore" button. You can
    also Add your own agency dispositions.
  - Start a New Review for that agency: the disposition checkboxes should
    reflect the baseline minus anything you removed, plus your own.
  - Open a saved review's Report and Detail views: dispositions should be
    labeled correctly (including any agency-custom ones).

NOTES
  - nav.js and auth.js here also include the earlier fixes you already
    deployed (they are cumulative — safe to overwrite).
  - This completes create/view/edit/delete for all FOUR content types:
    incident types, KPIs, safety items, and dispositions.
