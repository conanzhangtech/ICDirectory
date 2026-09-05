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

## Adding a certificate

Cards on a volunteer's profile are generated from the cert pages themselves —
there is no HTML to copy. To add one:

1. Drop the source image in `assets/images/awardsandachievements/<volunteer>/`.
   Any reasonable size is fine; Hugo emits the WebP thumbnails and the full-size
   original is never published.
2. Create `content/volunteers/<volunteer>/<cert-slug>.md` with a `cert:` block:

```yaml
---
title: "Certified in Cybersecurity by ISC2"
layout: "faq"
draft: false
weight: 30                    # position within the group; tens leave room to insert

cert:
  name: "Certified in Cybersecurity (CC)"   # card title
  issuer: "ISC2"                            # card subtitle
  image: "certificate_CCISC2.png"           # filename only; "" → award icon
  group: certifications                     # id from params.certGroups in hugo.toml
---
```

That's the whole change — the card appears, in the right group, linked to the
page. Because the card's link is the page's own permalink it cannot point at
the wrong cert, and a cert page can't be left off the profile by accident.

If the cert has a Credly badge, add it with the badge UUID from its Credly
share page — one id drives both the embed and the fallback link:

```
{{< credly id="7e9ce762-1eca-4787-9cff-6639c91cd3c6" >}}
```

Group ids and their headings live under `[[params.certGroups]]` in `hugo.toml`;
thumbnail sizes under `[params.certThumb]`. A misspelled `image:` warns during
the build and falls back to the icon instead of shipping a broken image.

## Development

```bash
hugo server                # against the published Publisher release
../dev.sh ICDirectory 1317 # against the local Publisher checkout
```

Deploys via Cloudflare Workers Builds (`build.sh` + `wrangler.jsonc`).
Theme updates propagate automatically via `.github/workflows/publisher-bump.yml`.
