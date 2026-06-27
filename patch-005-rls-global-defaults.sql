-- ============================================================
-- ATLAS patch-005-rls-global-defaults.sql
-- Fixes RLS policies to allow reading global default records
-- (incident types, KPIs, safety items seeded without agency_id)
-- ============================================================

-- Drop and recreate RLS policies to include global defaults

-- safety_checklist_items: allow reading global defaults (agency_id IS NULL)
drop policy if exists "users_read_safety_items" on safety_checklist_items;
drop policy if exists "agency_read_safety_items" on safety_checklist_items;
create policy "read_safety_items"
  on safety_checklist_items for select
  using (
    agency_id is null
    or agency_id = (select agency_id from profiles where id = auth.uid())
    or (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- kpi_definitions: allow reading global defaults
drop policy if exists "users_read_kpi_definitions" on kpi_definitions;
drop policy if exists "agency_read_kpis" on kpi_definitions;
create policy "read_kpi_definitions"
  on kpi_definitions for select
  using (
    is_global_default = true
    or agency_id is null
    or agency_id = (select agency_id from profiles where id = auth.uid())
    or (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- incident_types: allow reading global defaults
drop policy if exists "users_read_incident_types" on incident_types;
drop policy if exists "agency_read_incident_types" on incident_types;
create policy "read_incident_types"
  on incident_types for select
  using (
    is_global_default = true
    or agency_id is null
    or agency_id = (select agency_id from profiles where id = auth.uid())
    or (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Verify
select 'Incident types visible: ' || count(*) from incident_types;
select 'KPI definitions visible: ' || count(*) from kpi_definitions;
select 'Safety items visible: ' || count(*) from safety_checklist_items;
