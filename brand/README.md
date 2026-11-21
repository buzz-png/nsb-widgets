# NSB Brand Hub

One page that shows a client's brand inside the NSB CRM: quick links, fonts, tap-to-copy colours and logos.

## How it works

- `index.html` is the one template for every client.
- `brands/<location id>.json` holds one client's details.
- One custom menu link in the NSB CRM opens:
  `https://buzz-png.github.io/nsb-widgets/brand/?id={{location.id}}`
  HighLevel fills in the sub-account's ID, so each client sees their own brand.
- No file for that ID → the page says "No brand set up for this account yet."

## Add a brand

1. Fill in the client's Brand Board in the NSB CRM (Marketing → Brand Boards).
2. Copy `brands/BvXZfZS8sKPUOtmyHiRj.json` to `brands/<their location id>.json`.
3. Fill in: client, name, links, fonts (Google Fonts names), colours (6-digit hex, no alpha), logos.
4. Commit and push. Live in ~1–10 minutes.

Link `open` values: `crm` opens in the CRM itself (e.g. the brand board), `tab` opens a new tab.

## Brands

| Client | Location ID | Added |
|---|---|---|
| BIRG | BvXZfZS8sKPUOtmyHiRj | 2026-11-21 |
