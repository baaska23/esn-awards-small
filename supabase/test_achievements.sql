-- =====================================================================
-- TEST achievements — for checking the achievements pop-up UI.
-- Run AFTER seed_2026.sql. Everything here uses tournaments named
-- "[TEST] ..." so it can be removed with the cleanup block at the bottom.
--
-- What to look at after running:
--   maaRaa  (coach, CS2)   — 1st / 2nd / 3rd / 7th + MVP  -> all medal colours
--   carnage (coach, CS2)   — single 2nd place            -> short list
--   Redka   (coach, CS2)   — single 3rd place
--   Skryyy  (coach, PUBGM) — 1st + 5th
--   Riva    (coach, MLBB)  — nothing                     -> empty state
--   nin9    (CS2)          — 2nd + MVP at the same event -> MVP row next to place
--   Kei     (MLBB)         — 12 more results + 2 MVPs    -> long list / scrolling,
--                                                           long tournament name
-- =====================================================================

BEGIN;

-- Test tournaments
INSERT INTO esn.tournaments (name, sport_id, event_month) VALUES
    ('[TEST] Ulaanbaatar CS2 Invitational',  1, '2026-01-01'),
    ('[TEST] Steppe Masters',                1, '2026-03-01'),
    ('[TEST] Golden Eagle Cup',              1, '2026-06-01'),
    ('[TEST] Asia Pacific Open',             1, '2026-09-01'),
    ('[TEST] PUBG Mobile Winter Clash',      2, '2026-02-01'),
    ('[TEST] PUBG Mobile Summer Showdown',   2, '2026-07-01'),
    ('[TEST] Mobile Legends Southeast Asia Super Championship Grand Finals Extended Edition', 2, '2026-11-01');

-- Twelve monthly MLBB test cups for the long-list case
INSERT INTO esn.tournaments (name, sport_id, event_month)
SELECT format('[TEST] MLBB Monthly Cup #%s', n), 2, make_date(2025, 12, 1) + (n - 1) * interval '1 month'
FROM generate_series(1, 12) AS n;

-- Placements
INSERT INTO esn.achievements (player_id, tournament_id, achievement_type, placement)
SELECT r.player_id, t.id, 'tournament_place', r.placement
FROM (VALUES
    -- maaRaa: every medal colour
    (106, '[TEST] Ulaanbaatar CS2 Invitational', 1),
    (106, '[TEST] Steppe Masters',               2),
    (106, '[TEST] Golden Eagle Cup',             3),
    (106, '[TEST] Asia Pacific Open',            7),
    -- carnage / Redka: one row each
    (112, '[TEST] Steppe Masters',               2),
    (122, '[TEST] Golden Eagle Cup',             3),
    -- Skryyy
    (206, '[TEST] PUBG Mobile Winter Clash',     1),
    (206, '[TEST] PUBG Mobile Summer Showdown',  5),
    -- nin9: place + MVP at the same event
    (105, '[TEST] Asia Pacific Open',            2),
    -- Kei: long tournament name
    (303, '[TEST] Mobile Legends Southeast Asia Super Championship Grand Finals Extended Edition', 1)
) AS r(player_id, tournament, placement)
JOIN esn.tournaments t ON t.name = r.tournament;

-- Kei: 12 monthly cups with placements cycling 1..6
INSERT INTO esn.achievements (player_id, tournament_id, achievement_type, placement)
SELECT 303, t.id, 'tournament_place', ((row_number() OVER (ORDER BY t.event_month) - 1) % 6 + 1)::int2
FROM esn.tournaments t
WHERE t.name LIKE '[TEST] MLBB Monthly Cup #%';

-- MVPs (one per tournament)
INSERT INTO esn.achievements (player_id, tournament_id, achievement_type)
SELECT r.player_id, t.id, 'mvp'
FROM (VALUES
    (106, '[TEST] Ulaanbaatar CS2 Invitational'),
    (105, '[TEST] Asia Pacific Open'),
    (303, '[TEST] Mobile Legends Southeast Asia Super Championship Grand Finals Extended Edition'),
    (303, '[TEST] MLBB Monthly Cup #3')
) AS r(player_id, tournament)
JOIN esn.tournaments t ON t.name = r.tournament;

COMMIT;


-- ---------------------------------------------------------------------
-- CLEANUP — run this to remove all test data (real seed data is untouched):
--
-- BEGIN;
-- DELETE FROM esn.achievements
--  WHERE tournament_id IN (SELECT id FROM esn.tournaments WHERE name LIKE '[TEST]%');
-- DELETE FROM esn.tournaments WHERE name LIKE '[TEST]%';
-- COMMIT;
-- ---------------------------------------------------------------------
