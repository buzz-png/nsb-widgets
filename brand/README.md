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

1. Ask Buzz: "Have you done the brand board?" The client's Brand Board in the NSB CRM (Marketing → Brand Boards) is the starting point.
2. Read it in Chrome: heading font, body font, colours, logos.
3. If the client has a proper logos folder in Drive, copy a tidy set of the Digital PNGs (transparent) into `assets/<client>/`. Otherwise use the brand board logos.
4. Copy `brands/BvXZfZS8sKPUOtmyHiRj.json` to `brands/<their location id>.json` and fill it in.
5. Only add a link or section if the thing exists (no logos folder = no logos button).
6. Commit and push. Live in ~1–10 minutes.

Fields:
- `links[].open`: `tab` opens a new tab, `crm` opens inside the CRM. Brand board goes last (right) and opens in a new tab.
- `fonts[]`: Google Fonts names + role (Headings / Body).
- `colours[]`: 6-digit hex, no alpha.
- `logos[]`: `url` (relative to brand/) + `bg` tile colour. White logos go on the brand's dark colour.
- `dev[]`: developer code (site script lines). Shown in a closed "Developer code" section at the bottom.

The page shows an "Open in new tab" button when it's inside the CRM, so it can sit beside a build.

## Brands

| Client | Location ID | Added |
|---|---|---|
| BIRG | BvXZfZS8sKPUOtmyHiRj | 2026-11-21 |
