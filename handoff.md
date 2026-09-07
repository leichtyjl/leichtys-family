# Handoff - leichtyscom simplification (2027 Reunion focus)

## Verified current state
- Repo: /Users/jeremyleichty/leichtyscom (branch: main, HEAD 0c89936)
- `node scripts/build.mjs` -> "Built 16 pages."
- `node scripts/check.mjs` -> "Checked 16 pages, 7 required assets, four children, and three branches."
- `node --check functions/api/contact.js` -> OK. Forwards to 4 recipients via CONTACT_TO_1..4 env bindings (line 8).
- Primary pages: /, /family/, /reunion2027/, /rsvp/. Nav = Our Family / Reunion 2027 / RSVP only.
- No primary-page links to archived pages (history, photos, videos, branches, family-tree, children). Those pages still build and remain reachable by direct URL only (preserved in repo per goal).
- RSVP copy applied in scripts/build.mjs and present in built rsvp/index.html:
  eyebrow "RSVP", h1 "Leichty Family Reunion 2027", lead "Online RSVPs are not open yet. We'll begin collecting RSVPs here at a later date. Please check back when registration opens.", support "Please RSVP by May 12, 2027. Your RSVP will help us plan seating, lunch, and reunion activities.", link "Back to Reunion 2027".
- Agenda PDF removed: _redirects rule gone, file rounding_up_the_leichty_family_agenda.pdf deleted (git status D).
- build.mjs no longer imports/uses existsSync or agendaPdf.
- Iona presented factually (1917-1920), no memorial language.

## Git working tree (not yet committed)
- Modified: 404.html, _redirects, content/site.json, all rebuilt *.html, functions/api/contact.js, scripts/build.mjs, scripts/check.mjs
- Deleted: rounding_up_the_leichty_family_agenda.pdf
- Untracked (do NOT commit blindly): .clinerules (verification guidelines; likely fine to commit), Jacob Leichty.jpg, carl_leichty.png, iona_leichty.png, simon.jpeg (purpose unknown - confirm before adding)

## SECURITY - DO FIRST
The Cloudflare API token was echoed into an earlier session log and is exposed. Rotate/delete it in the Cloudflare dashboard BEFORE deploying. Then write the new token into .cloudflare and .cloudflare-token (both gitignored, account 5cb07974603ca02adda7ef4604fa172f). Never commit credentials.

## Gotchas learned
- Piping unicode/ZWSP through editor/run_commands can corrupt chars into CJK punctuation, causing "SyntaxError: invalid character". Fix: write small ASCII-only python scripts to /tmp, validate with `python3 -c 'import ast; ast.parse(open(f).read())'`, use HTML entities (&#8217;, &mdash;) in .mjs instead of raw unicode.
- After any edit, run the triple: node --check scripts/build.mjs && node scripts/build.mjs && node scripts/check.mjs
- Build error "Cannot read properties of undefined (reading 'slice')" at page.path.slice means a stray empty page object `{ }` with no path in the pages array - remove it.

## Remaining steps
1. Rotate CF token (user action), update .cloudflare / .cloudflare-token.
2. Commit tracked changes + deletion (leave untracked photos unless confirmed). Suggested message: "Simplify site to reunion-2027 focus: slim nav, RSVP not-open copy, 4-recipient contact, drop agenda PDF"
3. git push origin main
4. Deploy to Cloudflare Pages via API using fresh token (POST to /accounts/<id>/pages/projects/leichtys-family/deployments).
5. Verify live with chrome-devtools: DOM snapshot + console + network on /, /family/, /reunion2027/, /rsvp/. Avoid screenshots unless visual verification is required (per .clinerules).

## Key files
- content/site.json (nav/site meta), scripts/build.mjs (page bodies; RSVP copy ~line 206-223), scripts/check.mjs (assertions), functions/api/contact.js (4-recipient handler), _redirects, _headers.
