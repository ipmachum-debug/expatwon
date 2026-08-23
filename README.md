# expatwon.com

English-language site about managing money in Korea as a foreigner: banking,
loans, cars, business registration, insurance, and cost of living. Static
Astro site, search-traffic only, monetized with AdSense + affiliate links.

## Stack

- [Astro](https://astro.build) (static output) + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React islands (`client:visible`) for the calculators only
- `@astrojs/sitemap` for `sitemap-index.xml`

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Deploying — GitHub → Cloudflare Pages

The domain `expatwon.com` is already on Cloudflare (DNS Active, SSL Full).
Repo: `ipmachum-debug/expatwon`, default branch **`main`** (a `master`
default breaks Cloudflare's first build with
`ENOENT ... /opt/buildhome/repo/package.json` — seen on michael-archive).

1. Cloudflare dashboard → **Workers & Pages → Create → Pages →
   Connect to Git** and select the `expatwon` repository.
2. Build settings:

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Production branch      | `main`          |
   | Framework preset       | Astro           |
   | Build command          | `npm run build` |
   | Build output directory | `dist`          |
   | Root directory         | (empty)         |
   | Environment variables  | none            |

   Node is pinned by the `.node-version` file (`22.12.0`) plus
   `"engines"` in `package.json`.
3. Deploy once, then project → **Custom domains → Set up a custom domain →
   `expatwon.com`**. The zone is on the same account, so DNS is configured
   automatically.
4. `www` → root redirect is NOT done in Pages — do it on the domain side:
   **Rules → Redirect Rules** →
   When: hostname equals `www.expatwon.com` →
   Then: Dynamic redirect `concat("https://expatwon.com", http.request.uri.path)`, 301.
5. After that, every push to `main` deploys automatically (1–2 min). No
   GitHub Actions, wrangler, or API tokens are needed — this repo
   intentionally has no CI config or secrets.

### Web Analytics

Cloudflare Pages injects its analytics beacon automatically at deploy time —
do **not** add the script to the code. View stats under
**Observe → Analytics → Web analytics** in the left menu (there is no toggle
in the Pages project Settings tab).

### After launch — Search Console

1. Google Search Console → add a **Domain** property → DNS verification is
   one-click OAuth when the zone is on Cloudflare.
2. Submit the sitemap as a full URL: `https://expatwon.com/sitemap-index.xml`
   (`@astrojs/sitemap` generates `sitemap-index.xml`, not `sitemap.xml`).
3. `site: 'https://expatwon.com'` is already set in `astro.config.mjs` —
   required for the sitemap and canonical URLs to be generated.

### Security

- Never commit API tokens or keys. If a secret is ever needed, put it in
  Cloudflare Pages → Settings → Variables and Secrets (Secret type) only.
- `.gitignore` covers `.env` and `.env.*`.

## Content model

Posts live in `src/content/posts/*.md`. Frontmatter (validated by
`src/content.config.ts` — the build fails on violations, this is the SEO
lint):

| field         | rule                                                    |
| ------------- | ------------------------------------------------------- |
| `title`       | ≤ 60 chars                                              |
| `description` | 50–155 chars                                            |
| `category`    | one of `banking, loans, cars, business, insurance, cost-of-living` |
| `publishDate` / `updatedDate` | dates; `updatedDate` renders as "Last verified" |
| `tags`        | ≥ 1                                                     |
| `sources`     | ≥ 1 `{label, url}` — official sources only              |
| `affiliate`   | boolean; `true` adds the disclosure line                |
| `faq`         | optional Q/A list → on-page FAQ + FAQPage JSON-LD       |
| `draft`       | `true` excludes the post from the build                 |

URL scheme: `/{category}/{slug}/`. Every post automatically gets: "Last
verified" line, sources list, disclaimer, related guides (same category,
max 5), Article JSON-LD, and ad slots.

### Site principles

- Every figure links to an official source (FSS, NTS, Hi Korea, NHIS, bank
  English pages). No unsourced numbers.
- Tone: "how it works / what it costs" — not "we recommend".
- Max 3 ad slots per page; the mid-article slot renders only when the post
  is ≥ 800 words.
- KRW amounts get a rough USD equivalent via the `<Money amount={...} />`
  component; the rate is the `KRW_PER_USD` constant in `src/lib/site.ts`,
  updated manually.

## Calculators

React islands in `src/components/calculators/`, hydrated with
`client:visible`, no server calls:

- `/tools/car-lease-calculator/` — down payment / deposit / monthly / term /
  residual → totals with and without buyout, effective monthly cost
- `/tools/loan-calculator/` — equal-installment payment, total interest,
  and the cost of a 1%p higher rate
- `/tools/cost-of-living-calculator/` — city preset + line items → monthly
  total in KRW and USD

Each calculator page links related guides from its category.

## AdSense

`src/components/AdSlot.astro` renders empty placeholders
(`position="top|mid|bottom"`). After AdSense approval, replace the
placeholder markup there with the real ad unit code — one file, all pages.

## Current status / TODO

- [x] Site skeleton, layouts, category hubs, tools, required pages
      (about / contact / privacy / disclaimer)
- [ ] The 5 launch posts are **outlines** — write full articles and verify
      every figure against the linked official sources before applying to
      AdSense
- [ ] Set up `contact@expatwon.com` (Cloudflare Email Routing)
- [ ] Connect Cloudflare Pages (steps above)
- [ ] `www` → root Redirect Rule on the domain
- [ ] Google Search Console: Domain property + submit
      `https://expatwon.com/sitemap-index.xml` after launch
