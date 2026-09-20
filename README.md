# Crack Aptitude — IT Placement Preparation Platform

A frontend prototype of the Crack Aptitude platform: a single self-contained
`index.html` file (HTML + Tailwind CDN + vanilla JS + Chart.js) implementing
a client-side single-page app.

## How to run
Just open `index.html` in any modern browser — no build step, no server
required. All data is in-memory sample data (see the `DB` object near the
top of the `<script>` block).

## Pages included
- Landing / Home
- Login / Register (demo auth — any valid-looking email + 6+ char password logs you in)
- Student Dashboard (charts, insights, achievements)
- Companies (list) + Company Detail (readiness ring, topic mastery)
- Practice engine (interactive MCQ practice with explanations, bookmarks, mark-for-review)
- Mock Tests (list) + Live Mock Test (real countdown timer, question palette, auto-submit)
- Results (score breakdown, section charts)
- Performance Analytics (accuracy/time/speed charts, topic heatmap)
- Leaderboard
- Profile (achievements + bookmarks tabs)
- Settings (light/dark theme toggle, notification preferences)

## Not included (needs a real backend/server)
This is a static frontend file, so it intentionally does not include:
- A real PHP/MySQL backend or database
- Real user authentication, password hashing, sessions
- The Admin Dashboard / Admin CRUD panels (question management, user
  management, etc.) with live data
- Security infrastructure (CSRF, rate limiting, audit logs, etc.)

To turn this into the full production system described in the original
brief, the frontend would call a real API (PHP/Node/etc. + MySQL) instead
of reading from the in-memory `DB` object, and the admin pages would be
built against that API.

## Customizing
- Colors, fonts and tokens are CSS variables at the top of the `<style>`
  block (`--primary`, `--bg`, `--surface`, etc.)
- Sample data (companies, questions, mock tests, leaderboard, achievements)
  lives in the `DB` object in the `<script>` block — edit it directly to
  add real questions/companies.
