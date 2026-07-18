# ICDirectory

The digital identity and discovery platform for Isolated Command contributors.

**directory.isolatedcommand.com** — meet the volunteers, builders, and
contributors creating digital solutions and community impact.

## What it is

Version 1: the official directory of Isolated Command volunteers — searchable
by name, role, skill and project, with a contributor profile page per person
(portfolio, not employee record).

Future: a youth contributor directory connecting multiple organisations. The
data model is organisation-scoped from day one, so partner organisations can
be added without a rebuild.

## Architecture

- [Publisher](https://github.com/isolatedcommand/Publisher) theme (Hugo module) — shared keycap design system; violet leads as the product accent.
- `data/volunteers.json` — single source of truth. One record per contributor with `organisation`, `role`, `skills`, `projects`, `achievements`, `journey`. Swap for a CMS, D1 database, or the Volunteer Management System later without touching templates.
- `content/volunteers/_content.gotmpl` — Hugo content adapter; generates one profile page per JSON record at build time.
- `layouts/partials/volunteer-card.html` — the contributor card (drives search/filter via `data-*` attributes).
- `assets/js/directory.js` — dependency-free client-side search + role/skill/organisation filters.

## Adding a contributor

Append a record to `data/volunteers.json`:

```json
{
  "slug": "john-tan",
  "name": "John Tan",
  "organisation": "Isolated Command",
  "role": "Cybersecurity Volunteer",
  "accent": "cyan",
  "tagline": "One line about them.",
  "contribution": "What they contributed.",
  "skills": ["Security", "Cloud"],
  "projects": ["ICGo"],
  "achievements": [],
  "journey": [
    { "date": "2026", "title": "Joined Isolated Command", "detail": "…" }
  ]
}
```

Commit — the profile page, directory card, filters and homepage stats all
update automatically.

## Development

```bash
hugo server                # against the published Publisher release
../dev.sh ICDirectory 1317 # against the local Publisher checkout
```

Deploys via Cloudflare Workers Builds (`build.sh` + `wrangler.jsonc`).
Theme updates propagate automatically via `.github/workflows/publisher-bump.yml`.
