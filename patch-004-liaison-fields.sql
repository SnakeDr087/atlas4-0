-- ============================================================
-- ATLAS patch-004-liaison-fields.sql
-- Adds liaison contact fields to agencies table
-- Run after patch-003
-- ============================================================

alter table agencies
  add column if not exists liaison_name  text,
  add column if not exists liaison_email text,
  add column if not exists liaison_phone text;

-- Update the sample agency
update agencies
set
  agency_head_title = 'Chief of Police',
  agency_head_name  = 'Chief John Smith',
  agency_head_email = 'chief@anytown-pd.gov',
  liaison_name      = 'Captain Jane Doe',
  liaison_email     = 'liaison@anytown-pd.gov'
where name = 'Anytown Police Department';
