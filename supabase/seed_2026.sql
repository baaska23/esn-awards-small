-- =====================================================================
-- ESN Awards 2026 — sample nominees, tournaments and achievements
-- Run AFTER schema.sql, once, on empty tables (Supabase SQL editor).
--
-- Source: Liquipedia (Counter-Strike, PUBG Mobile, MLBB wikis), Nov 2026.
-- Achievements are credited to players who were on the team's roster on
-- the tournament's end date. Rows marked SAMPLE are placeholders — no
-- reliable public data — replace them before voting opens.
--
-- Conventions
--   sport_id: 1 = PC (CS2), 2 = mobile (PUBG Mobile, MLBB)
--   player ids: 1xx CS2, 2xx PUBG Mobile, 3xx MLBB
--   team ids:   1-3 CS2, 4-7 PUBG Mobile, 8-9 MLBB
--   Each category's vote id (pc_player_id, coach_id, ...) = the person's
--   player id or the team id, so results join back to esn.players.
-- =====================================================================

BEGIN;

-- To re-run from scratch, uncomment:
-- TRUNCATE esn.achievements, esn.tournaments, esn.players, esn.awards RESTART IDENTITY;


-- ---------------------------------------------------------------------
-- People (players + coaches)
-- ---------------------------------------------------------------------
INSERT INTO esn.players (id, username, fullname, image_url, sport_id) VALUES
    -- CS2 — The MongolZ
    (101, 'bLitz',     'Garidmagnai Byambasuren', 'blitz.png',       1),
    (102, 'Techno4K',  'Sodbayar Munkhbold',      'techno.png',      1),
    (103, '910',       'Usukhbayar Banzragch',    '910.png',         1),
    (104, 'cobrazera', 'Anarbileg Uuganbayar',    'placeholder.png', 1),
    (105, 'nin9',      'Yesuntumur Gantulga',     'placeholder.png', 1),
    (106, 'maaRaa',    'Erdenedalai Bayanbat',    'maaraa.png',      1),  -- coach
    -- CS2 — The Huns Esports
    (111, 'controlez', 'Unudelger Baasanjargal',  'controlez.png',   1),
    (112, 'carnage',   'Badral Purevkhuu',        'carnage.webp',    1),  -- coach
    -- CS2 — Chinggis Warriors
    (121, 'ROUX',      'Undrakhbayar Zolbayar',   'placeholder.png', 1),
    (122, 'Redka',     'Munkh-Ochir Myagmarsuren','placeholder.png', 1),  -- coach
    -- PUBG Mobile — The MongolZ
    (201, 'DeSSeRT',   'Temuulen Boldbayar',      'placeholder.png', 2),
    (202, 'JIRO',      'Urtnasan Dorjdagva',      'placeholder.png', 2),
    (205, 'NIRZED',    'Nurzed Bayarmunkh',       'placeholder.png', 2),  -- captain
    (206, 'Skryyy',    'Bilguutei Bayasgalan',    'placeholder.png', 2),  -- coach
    -- MLBB — The MongolZ
    (301, 'Zxaura',    'Bagabandi Tegshjargal',   'zxaura.png',      2),
    (302, 'Mayki',     'Lkhagvasuren Otgonbayar', 'mayki.png',       2),
    (303, 'Kei',       'Erdenebileg Erdensuren',  'kei.jpg',         2),
    (304, 'Riva',      NULL,                      'placeholder.png', 2);  -- coach


-- ---------------------------------------------------------------------
-- Nominees (esn.awards)
-- ---------------------------------------------------------------------

-- PC team of the year
INSERT INTO esn.awards (slug, sport_id, team_id, pc_team_id, team_name, team_image_url, sport_image_url) VALUES
    ('teams', 1, 1, 1, 'The MongolZ',       'mongolz.png', 'cs.png'),
    ('teams', 1, 2, 2, 'The Huns Esports',  'huns.png',    'cs.png'),
    ('teams', 1, 3, 3, 'Chinggis Warriors', 'cw.png',      'cs.png');

-- Mobile team of the year
INSERT INTO esn.awards (slug, sport_id, team_id, mobile_team_id, team_name, team_image_url, sport_image_url) VALUES
    ('teams', 2, 4, 4, 'The MongolZ PUBGM',  'mongolz.png',     'pubg_logo.png'),
    ('teams', 2, 5, 5, 'E-Sahin Esports',    'placeholder.png', 'pubg_logo.png'),
    ('teams', 2, 6, 6, 'Golden Ticket',      'placeholder.png', 'pubg_logo.png'),
    ('teams', 2, 7, 7, 'Champions Esports',  'champions.png',   'pubg_logo.png'),
    ('teams', 2, 8, 8, 'The MongolZ MLBB',   'mongolz.png',     'mlbb_logo.png'),
    ('teams', 2, 9, 9, 'The Akatsuki',       'placeholder.png', 'mlbb_logo.png');

-- PC player of the year
INSERT INTO esn.awards (slug, sport_id, team_id, team_name, team_image_url, player_id, pc_player_id,
                        username, fullname, player_image_url, sport_image_url)
SELECT 'players', 1, t.team_id, t.team_name, t.team_image_url, p.id, p.id,
       p.username, p.fullname, p.image_url, 'cs.png'
FROM esn.players p
JOIN (VALUES (101, 1, 'The MongolZ', 'mongolz.png'), (102, 1, 'The MongolZ', 'mongolz.png'),
             (103, 1, 'The MongolZ', 'mongolz.png'), (104, 1, 'The MongolZ', 'mongolz.png'),
             (105, 1, 'The MongolZ', 'mongolz.png'),
             (111, 2, 'The Huns Esports', 'huns.png'),
             (121, 3, 'Chinggis Warriors', 'cw.png'))
     AS t(player_id, team_id, team_name, team_image_url) ON t.player_id = p.id;

-- Mobile player of the year
INSERT INTO esn.awards (slug, sport_id, team_id, team_name, team_image_url, player_id, mobile_player_id,
                        username, fullname, player_image_url, sport_image_url)
SELECT 'players', 2, t.team_id, t.team_name, 'mongolz.png', p.id, p.id,
       p.username, p.fullname, p.image_url, t.sport_image_url
FROM esn.players p
JOIN (VALUES (201, 4, 'The MongolZ PUBGM', 'pubg_logo.png'),
             (202, 4, 'The MongolZ PUBGM', 'pubg_logo.png'),
             (205, 4, 'The MongolZ PUBGM', 'pubg_logo.png'),
             (301, 8, 'The MongolZ MLBB',  'mlbb_logo.png'),
             (302, 8, 'The MongolZ MLBB',  'mlbb_logo.png'),
             (303, 8, 'The MongolZ MLBB',  'mlbb_logo.png'))
     AS t(player_id, team_id, team_name, sport_image_url) ON t.player_id = p.id;

-- Coach of the year
INSERT INTO esn.awards (slug, sport_id, team_id, team_name, team_image_url, player_id, coach_id,
                        username, fullname, player_image_url, sport_image_url)
SELECT 'coaches', p.sport_id, t.team_id, t.team_name, t.team_image_url, p.id, p.id,
       p.username, p.fullname, p.image_url, t.sport_image_url
FROM esn.players p
JOIN (VALUES (106, 1, 'The MongolZ',       'mongolz.png', 'cs.png'),
             (112, 2, 'The Huns Esports',  'huns.png',    'cs.png'),
             (122, 3, 'Chinggis Warriors', 'cw.png',      'cs.png'),
             (206, 4, 'The MongolZ PUBGM', 'mongolz.png', 'pubg_logo.png'),
             (304, 8, 'The MongolZ MLBB',  'mongolz.png', 'mlbb_logo.png'))
     AS t(player_id, team_id, team_name, team_image_url, sport_image_url) ON t.player_id = p.id;

-- IGL of the year (in-game leader / captain)
INSERT INTO esn.awards (slug, sport_id, team_id, team_name, team_image_url, player_id, igl_id,
                        username, fullname, player_image_url, sport_image_url)
SELECT 'igls', p.sport_id, t.team_id, t.team_name, 'mongolz.png', p.id, p.id,
       p.username, p.fullname, p.image_url, t.sport_image_url
FROM esn.players p
JOIN (VALUES (101, 1, 'The MongolZ',       'cs.png'),
             (205, 4, 'The MongolZ PUBGM', 'pubg_logo.png'))
     AS t(player_id, team_id, team_name, sport_image_url) ON t.player_id = p.id;

-- Fan favorite (grouped by team on the page)
INSERT INTO esn.awards (slug, sport_id, team_id, team_name, team_image_url, player_id, fav_player_id,
                        username, fullname, player_image_url)
SELECT 'favs', p.sport_id, t.team_id, t.team_name, 'mongolz.png', p.id, p.id,
       p.username, p.fullname, p.image_url
FROM esn.players p
JOIN (VALUES (101, 1, 'The MongolZ'), (102, 1, 'The MongolZ'), (103, 1, 'The MongolZ'),
             (202, 4, 'The MongolZ PUBGM'), (205, 4, 'The MongolZ PUBGM'),
             (301, 8, 'The MongolZ MLBB'), (302, 8, 'The MongolZ MLBB'), (303, 8, 'The MongolZ MLBB'))
     AS t(player_id, team_id, team_name) ON t.player_id = p.id;

-- SAMPLE: talent (casters / hosts) — replace with real nominees
INSERT INTO esn.awards (slug, talent_id, username, player_image_url) VALUES
    ('talents', 901, 'SAMPLE Talent 1', 'placeholder.png'),
    ('talents', 902, 'SAMPLE Talent 2', 'placeholder.png'),
    ('talents', 903, 'SAMPLE Talent 3', 'placeholder.png');

-- SAMPLE: streamer — replace with real nominees
INSERT INTO esn.awards (slug, streamer_id, username, player_image_url) VALUES
    ('streamers', 951, 'SAMPLE Streamer 1', 'placeholder.png'),
    ('streamers', 952, 'SAMPLE Streamer 2', 'placeholder.png'),
    ('streamers', 953, 'SAMPLE Streamer 3', 'placeholder.png');

-- SAMPLE: highlight of the year — replace URLs/images with real clips
INSERT INTO esn.awards (slug, highlight_id, username, player_image_url, highlight_url, highlight_image_url) VALUES
    ('highlights', 1, 'SAMPLE Highlight 1', 'placeholder.png', '<iframe src="https://www.youtube.com/embed/"></iframe>', 'highlight.png'),
    ('highlights', 2, 'SAMPLE Highlight 2', 'placeholder.png', '<iframe src="https://www.youtube.com/embed/"></iframe>', 'highlight.png'),
    ('highlights', 3, 'SAMPLE Highlight 3', 'placeholder.png', '<iframe src="https://www.youtube.com/embed/"></iframe>', 'highlight.png');


-- ---------------------------------------------------------------------
-- Tournaments (event_month = first day of the month the event ended)
-- ---------------------------------------------------------------------
INSERT INTO esn.tournaments (name, sport_id, event_month) VALUES
    -- CS2
    ('PGL Cluj-Napoca 2026',                    1, '2026-02-01'),
    ('MESA League Season 5',                    1, '2026-03-01'),
    ('PGL Bucharest 2026',                      1, '2026-04-01'),
    ('ESN Fall Showdown 2026',                  1, '2026-10-01'),
    ('1win Private Club #2',                    1, '2026-10-01'),
    ('MESA Pro Series Halloween Edition 2026',  1, '2026-10-01'),
    ('Moscow Cyber Games 2026',                 1, '2026-11-01'),
    ('IEM Beijing 2026',                        1, '2026-11-01'),
    -- PUBG Mobile
    ('PUBG Mobile National Championship Mongolia 2026 Spring', 2, '2026-04-01'),
    ('PUBG Mobile National Championship Mongolia 2026 Fall',   2, '2026-08-01'),
    ('PUBG Mobile Global Open 2026 Season 2 - EECA Finals',    2, '2026-09-01'),
    ('PUBG Mobile Global Open 2026 Season 2',                  2, '2026-10-01'),
    -- MLBB
    ('ESN National Championship 2026 Season 1 - Men', 2, '2026-05-01'),
    ('MCT EA x ACL 2026',                             2, '2026-05-01'),
    ('ESN National Championship League Season 1',     2, '2026-09-01'),
    ('MCT EA 2026 Ulaanbaatar',                       2, '2026-10-01');


-- ---------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------

-- Tournament placements (every listed player gets the team's placement)
INSERT INTO esn.achievements (player_id, tournament_id, achievement_type, placement)
SELECT unnest(r.players), t.id, 'tournament_place', r.placement
FROM (VALUES
    -- CS2 — The MongolZ
    ('PGL Cluj-Napoca 2026',  4, ARRAY[101,102,103,104]),
    ('PGL Bucharest 2026',    3, ARRAY[101,102,103,104]),
    ('1win Private Club #2',  1, ARRAY[101,102,103,104,105]),
    ('IEM Beijing 2026',      2, ARRAY[101,102,103,104,105]),
    -- CS2 — The Huns Esports
    ('ESN Fall Showdown 2026',  2, ARRAY[111]),
    ('Moscow Cyber Games 2026', 3, ARRAY[111]),
    -- CS2 — Chinggis Warriors
    ('MESA League Season 5',                   1, ARRAY[121]),
    ('ESN Fall Showdown 2026',                 1, ARRAY[121]),
    ('MESA Pro Series Halloween Edition 2026', 1, ARRAY[121]),
    -- PUBG Mobile — The MongolZ
    ('PUBG Mobile National Championship Mongolia 2026 Spring', 3, ARRAY[201,202,205]),
    ('PUBG Mobile National Championship Mongolia 2026 Fall',   1, ARRAY[201,202,205]),
    ('PUBG Mobile Global Open 2026 Season 2 - EECA Finals',    1, ARRAY[201,202,205]),
    ('PUBG Mobile Global Open 2026 Season 2',                  6, ARRAY[201,202,205]),
    -- MLBB — The MongolZ
    ('ESN National Championship 2026 Season 1 - Men', 1, ARRAY[301,302]),
    ('MCT EA x ACL 2026',                             2, ARRAY[301,302]),
    ('ESN National Championship League Season 1',     1, ARRAY[301,302]),
    ('MCT EA 2026 Ulaanbaatar',                       1, ARRAY[301,302,303])
) AS r(tournament, placement, players)
JOIN esn.tournaments t ON t.name = r.tournament;

-- MVP awards (placement stays NULL)
INSERT INTO esn.achievements (player_id, tournament_id, achievement_type)
SELECT r.player_id, t.id, 'mvp'
FROM (VALUES
    (202, 'PUBG Mobile Global Open 2026 Season 2 - EECA Finals'),  -- JIRO, Finals MVP
    (301, 'MCT EA 2026 Ulaanbaatar')                               -- Zxaura, Finals MVP
) AS r(player_id, tournament)
JOIN esn.tournaments t ON t.name = r.tournament;

COMMIT;
