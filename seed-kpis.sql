-- ============================================================
-- ATLAS seed-kpis.sql
-- Seeds all 17 incident types and their KPIs as global defaults
-- Safe to re-run (uses ON CONFLICT DO NOTHING)
-- ============================================================

BEGIN;

-- ── 3 Universal KPIs (appear on every review, no incident type) ──
INSERT INTO kpi_definitions (kpi_text, display_order, is_global_default)
VALUES
  ('Actions Were in Accordance with Agency Policy, Training, and Best Practices', 1, true),
  ('Actions Exceeded Agency Expectations', 2, true),
  ('Other Training Issue Not Listed — See Supervisor Notes', 3, true)
ON CONFLICT DO NOTHING;

-- ── Incident Types ────────────────────────────────────────────
INSERT INTO incident_types (name, display_order, is_global_default) VALUES
  ('Arrest',                      1,  true),
  ('BWC Mic Check',               2,  true),
  ('Crash Investigation',         3,  true),
  ('Citizen Contact (Non-Criminal)', 4, true),
  ('Criminal Incident Investigation', 5, true),
  ('Demeanor',                    6,  true),
  ('Domestic Violence',           7,  true),
  ('DWI',                         8,  true),
  ('Fire Scene Assist',           9,  true),
  ('Medical Call',               10,  true),
  ('Mental Health Assist',       11,  true),
  ('Prisoner Detail: Hospital',  12,  true),
  ('Prisoner Transport',         13,  true),
  ('Suspicious Event',           14,  true),
  ('Traffic Stop',               15,  true),
  ('Vehicular Pursuit',          16,  true)
ON CONFLICT DO NOTHING;

-- ── KPIs per incident type ────────────────────────────────────
-- Using CTEs to get incident type IDs cleanly

WITH t AS (SELECT id FROM incident_types WHERE name = 'Arrest' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Advise the Subject of the Reason for the Arrest', 1),
  ('Conduct a Search Incident to the Arrest', 2),
  ('Double Lock Handcuffs', 3),
  ('Secure Subject in Seat Belt', 4),
  ('Establish Probable Cause', 5),
  ('Label / Tag BWC Video Properly', 6),
  ('Question Subject About Dependents Requiring Care Due to the Arrest', 7)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'BWC Mic Check' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Checked for Damage to Device', 1),
  ('Check Device Battery Status', 2),
  ('Check Indicator Light', 3),
  ('State Name, Identification Number, and Assignment', 4),
  ('Label / Tag BWC Video Properly', 5)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Crash Investigation' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Check for Injured Persons', 1),
  ('Remove Debris from the Roadway', 2),
  ('Institute Traffic Safety Control Measures', 3),
  ('Label / Tag BWC Video Properly', 4)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Citizen Contact (Non-Criminal)' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Advise Subject of Reason for the Stop', 1),
  ('Notify Dispatch of Location', 2),
  ('Communicate in a Courteous Manner', 3),
  ('Wait for Backup When It Was Available', 4),
  ('Notify Dispatch of the Subject''s Description', 5),
  ('Label / Tag BWC Video Properly', 6)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Criminal Incident Investigation' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Coordinate Response with Additional Units', 1),
  ('Activate Emergency Lights When Exceeding Speed Limit', 2),
  ('Reduce Speed When Traveling Through Intersections', 3),
  ('Park Police Vehicle Out of the Line of Sight of the Target Location', 4),
  ('Wait for Backup When Available', 5),
  ('Label / Tag BWC Video Properly', 6)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Demeanor' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Clear Communication — Provides explanations for actions; uses clear language', 1),
  ('Respectful Interaction — Uses polite language; maintains a calm tone of voice', 2),
  ('Active Listening — Makes eye contact; paraphrases or repeats back information', 3),
  ('Consistent Command Delivery — Gives clear, understandable, non-contradictory commands', 4),
  ('Appropriate Use of Force — Uses necessary amount of force; follows use of force protocol', 5),
  ('De-escalation Techniques — Uses calm language and verbal/non-verbal de-escalation', 6),
  ('Compliance with Procedures — Follows SOPs; conducts searches and detentions legally', 7),
  ('Empathy in Interaction — Acknowledges feelings; provides supportive comments', 8),
  ('Complaint Handling — Listens to and documents complaints; follows up timely', 9),
  ('Proper Evidence Handling — Documents and stores evidence correctly; handles property with care', 10)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Domestic Violence' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Determine if Mandatory Arrest Exists', 1),
  ('Gather Information for DV Packet', 2),
  ('Secure the Scene', 3),
  ('Check for Injuries', 4),
  ('Provide Assistance to Victim', 5),
  ('Separate Parties During Investigative Interview', 6),
  ('Label / Tag BWC Video Properly', 7)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'DWI' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Establish Operation of the Vehicle', 1),
  ('Establish Impairment by Conducting a Field Sobriety Test', 2),
  ('Wait for Backup When It Was Available', 3),
  ('Impound Vehicle According to Policy', 4),
  ('Properly Secure Arrestee in Seatbelt', 5),
  ('Establish a Lawful Reason to Stop the Vehicle', 6),
  ('Search Subject Incident to the Arrest', 7),
  ('Label / Tag BWC Video Properly', 8)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Fire Scene Assist' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Ensure Safety Upon Entering or Approaching Fire Scene', 1),
  ('Effectively Block Roadway from Vehicular Traffic to Secure the Scene', 2),
  ('Coordinate with Fire Department to Allow Fire Apparatus Close Access', 3),
  ('Provide or Coordinate Immediate Medical Attention for Victims', 4),
  ('Maintain Clear and Effective Communication with Dispatch and Fire Personnel', 5),
  ('Assist in Evacuation Efforts When Necessary', 6),
  ('Label / Tag BWC Video Properly', 7)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Medical Call' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Check Call History with Dispatch', 1),
  ('Provide Appropriate Medical Care', 2),
  ('Collect Information for Report', 3),
  ('Label / Tag BWC Video Properly', 4)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Mental Health Assist' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Approach Consumer in a Safe Location', 1),
  ('Identify Family / Caregivers to Assist or Explain Behavior', 2),
  ('Request a CIT Officer to Respond to the Scene', 3),
  ('Provide Family with Mental Health Resource Information', 4),
  ('Advise Caregivers of Involuntary Commitment Process', 5),
  ('Communicate with Consumer in a Slow, Calm Voice', 6),
  ('Stage Ambulance When Needed', 7),
  ('Label / Tag BWC Video Properly', 8)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Prisoner Detail: Hospital' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Conduct Communications Check via Radio Every 30 Minutes', 1),
  ('Shackle Subject While Being Transported', 2),
  ('Properly Handcuffed Subject to Bed', 3),
  ('Waited for Backup When It Was Available', 4),
  ('Notify Hospital Security of the Detail', 5),
  ('Notify Agency with Jurisdiction of Security Detail', 6),
  ('Label / Tag BWC Video Properly', 7)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Prisoner Transport' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Search Subject Prior to Transport', 1),
  ('Secure Prisoner in a Seat Belt', 2),
  ('Search Police Vehicle Prior to Transport', 3),
  ('Advise Dispatch of Starting and Ending Mileage', 4),
  ('Activate Internal Microphone or Camera During Transport', 5),
  ('Label / Tag BWC Video Properly', 6)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Suspicious Event' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Advised Dispatch of Findings / Updated CAD', 1),
  ('Waited for Backup if Available', 2),
  ('Provide Periodic Updates via Radio', 3),
  ('Broadcast Description of Subject(s)', 4),
  ('Conduct Area Search for Additional Evidence or Subjects', 5),
  ('Utilize De-escalation Techniques When Appropriate', 6),
  ('Identify and Document Witness Statements', 7),
  ('Assess the Scene for Public Safety Risks', 8),
  ('Initiate Coordination with Other Relevant Agencies if Necessary', 9),
  ('Label / Tag BWC Video Properly', 10)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Traffic Stop' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Introduce Yourself to the Operator of the Vehicle', 1),
  ('Establish RAS or PC to Lengthen the Time of the Investigative Detention', 2),
  ('Advise the Driver of the Reason for the Stop', 3),
  ('Notify Dispatch of the Make, Model, Registration, and Number of Occupants', 4),
  ('Conduct the Stop in a Safe Location', 5),
  ('Advise Dispatch of the Disposition of the Stop', 6),
  ('Label / Tag BWC Video Properly', 7)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

WITH t AS (SELECT id FROM incident_types WHERE name = 'Vehicular Pursuit' AND is_global_default = true LIMIT 1)
INSERT INTO kpi_definitions (incident_type_id, kpi_text, display_order, is_global_default)
SELECT t.id, kpi, ord, true FROM t, (VALUES
  ('Activate Overhead Lights and Audible Device', 1),
  ('Broadcast Traffic Conditions', 2),
  ('Activate Emergency Lights When Exceeding Speed Limit', 3),
  ('Used Verbal Commands to Remove Subject from Vehicle', 4),
  ('Reduce Speed When Traveling Through Intersections', 5),
  ('Broadcast Weather Conditions', 6),
  ('Broadcast Speed', 7),
  ('Secure Weapon Prior to Applying Physical Force to Control Subject', 8),
  ('Turn Off Audible Sirens Once Suspect Vehicle Stopped', 9),
  ('Utilize Proper High Risk Felony Stop Procedures', 10),
  ('Use Appropriate Contact / Cover Principles', 11),
  ('Notify Dispatch of the Reason for the Pursuit', 12),
  ('Label / Tag BWC Video Properly', 13)
) AS v(kpi, ord) ON CONFLICT DO NOTHING;

-- ── Default Officer Safety Checklist Items ────────────────────
INSERT INTO safety_checklist_items (item_text, display_order, is_active) VALUES
  ('Officer activated BWC at the appropriate time', 1, true),
  ('BWC recorded the entirety of the incident', 2, true),
  ('Officer wore and displayed badge / identification', 3, true),
  ('Backup was requested when situation required it', 4, true),
  ('Officer maintained situational awareness throughout the encounter', 5, true),
  ('Weapon was properly secured when not needed', 6, true),
  ('Officer did not place themselves in unnecessary danger', 7, true)
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify
SELECT 'Incident types: ' || count(*) FROM incident_types WHERE is_global_default = true;
SELECT 'Total KPIs: ' || count(*) FROM kpi_definitions WHERE is_global_default = true;
SELECT 'Universal KPIs: ' || count(*) FROM kpi_definitions WHERE is_global_default = true AND incident_type_id IS NULL;
SELECT 'Safety items: ' || count(*) FROM safety_checklist_items;
