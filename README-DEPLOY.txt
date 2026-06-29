ATLAS 4.3 — combined fix bundle
================================

TWO destinations. Do not mix them up.

--------------------------------------------------------------------
1) UPLOAD THESE 8 FILES TO GITHUB (they deploy via Netlify)
--------------------------------------------------------------------
   auth.js
   nav.js
   review-new.html
   dashboard.html
   reports.html
   in-person-reviews.html
   content-kpi.html
   content-safety.html

   How: github.com/SnakeDr087/atlas4-0  ->  Add file  ->  Upload files
   Drag all 8 in at once. They have the same names as the existing
   files, so GitHub replaces them. Commit changes. Done.

--------------------------------------------------------------------
2) RUN THIS 1 FILE IN SUPABASE (it is a database change, NOT a repo file)
--------------------------------------------------------------------
   patch-009-profiles-self-read.sql

   How: Supabase -> project pwlejykozarvtmopwgsr -> SQL Editor ->
   paste the file's contents -> Run.  One time.
   This is what fixes the supervisor "profile not found" login.
   DO NOT upload this .sql file to GitHub.

--------------------------------------------------------------------
TEST AFTER DEPLOY
--------------------------------------------------------------------
   - Use Google Chrome (Edge blocks Supabase JS).
   - Use an Incognito window (so old cached files don't hide the fix).
   - Log in as the test supervisor; confirm login works, dashboard
     shows officers, and New Review loads the officer picker.
