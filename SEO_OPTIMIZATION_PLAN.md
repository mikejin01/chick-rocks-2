# Chick Rocks SEO Optimization Plan

Source: `reference/Chick Rocks-SEO_Opportunities.pdf` (X.O. Continental, April 2026)
Site: chickrocksusa.com — Halal Fried Chicken, Astoria NY
Stack: React + Vite SPA (routes in `src/App.tsx`) with a parallel WordPress theme build (`wordpress-theme/`, `wp-templates/`)

---

## 1. Strategic Positioning

- **Traffic gap:** 121 vs Pelicana 29,752 (246x) vs Jollibee 681,002 (5,636x) monthly organic visits.
- **Blue-ocean niche:** neither competitor targets halal. Own "halal fried chicken" as the defensible moat.
- **Primary geo:** Astoria, Queens (plus Flushing expansion).
- **North-star keywords:**
  - Tier 1 (brand + halal): `halal fried chicken astoria`, `halal fried chicken nyc`, `halal fried chicken queens`, `chick rocks`
  - Tier 2 (category + geo): `fried chicken astoria`, `fried chicken near me`, `chicken sandwich astoria`, `halal chicken queens`
  - Tier 3 (long tail): `best halal fried chicken nyc`, `halal crispy chicken sandwich`, `halal wings astoria`, `halal catering queens`

---

## 2. Page Inventory & Per-Page Targets

Routes live in [src/App.tsx](src/App.tsx). Every route needs a unique `<title>`, meta description, canonical, OG/Twitter tags, H1, and JSON-LD where relevant. Install `react-helmet-async` (or equivalent) and apply across every page component.

| Route | File | Primary Keyword | Target Title (≤60 char) | Meta Description (≤155 char) |
|-------|------|-----------------|--------------------------|------------------------------|
| `/` | [src/pages/Index.tsx](src/pages/Index.tsx) | halal fried chicken astoria | `Chick Rocks — Halal Fried Chicken in Astoria, NY` | `Crispy halal fried chicken, sandwiches, wings & rice bowls in Astoria, Queens. Dine in, takeout & delivery. Order now.` |
| `/menu` | [src/pages/Menu.tsx](src/pages/Menu.tsx) | halal fried chicken menu | `Menu — Halal Fried Chicken, Sandwiches & Wings \| Chick Rocks` | `Our full halal menu: fried chicken, signature sandwiches, wings, rice bowls, sides & drinks. Prices and dietary info inside.` |
| `/catering` | [src/pages/Catering.tsx](src/pages/Catering.tsx) | halal catering queens | `Halal Catering in Queens & NYC \| Chick Rocks Catering` | `Halal catering for offices, parties and events across Queens and NYC. Trays, platters and custom packages. Get a quote today.` |
| `/about` | [src/pages/About.tsx](src/pages/About.tsx) | chick rocks story halal | `Our Story — Astoria's Halal Fried Chicken Spot \| Chick Rocks` | `How Chick Rocks became Astoria's go-to halal fried chicken spot. 100% halal, hand-breaded, fried fresh to order.` |
| `/blog` | [src/pages/Blog.tsx](src/pages/Blog.tsx) | halal food blog nyc | `Blog — Halal Food Guides & Chick Rocks News` | `Halal food guides, Astoria eats, recipes and news from Chick Rocks. New posts weekly.` |
| `/privacy` | [src/pages/PrivacyPolicy.tsx](src/pages/PrivacyPolicy.tsx) | — | `Privacy Policy \| Chick Rocks` | `How Chick Rocks collects and uses information.` (noindex optional) |
| `/terms` | [src/pages/TermsOfUse.tsx](src/pages/TermsOfUse.tsx) | — | `Terms of Use \| Chick Rocks` | `Terms governing use of chickrocksusa.com.` (noindex optional) |
| `*` (404) | [src/pages/NotFound.tsx](src/pages/NotFound.tsx) | — | `Page Not Found \| Chick Rocks` | `That page doesn't exist. Head back to the menu or homepage.` |

### New pages to add (derived from content-gap analysis)
- `/locations/astoria` — dedicated Astoria location page (hours, address, map embed, neighborhood copy).
- `/locations/flushing` — stub now, populate for expansion (report names Flushing explicitly).
- `/menu/[item-slug]` — item-level pages for signature items (`crispy-chicken-sandwich`, `halal-wings`, `rice-bowl`, etc.) per the Jollibee playbook.
- `/faq` — halal sourcing, allergens, delivery radius, catering minimums.
- `/blog/[slug]` — individual post template (SPA route + prerendered HTML or WP post type).

---

## 3. Technical SEO — Quick Wins (Week 1)

All of these are called out as <30-minute quick wins in the report.

- [ ] Replace the static [index.html](index.html) head with proper defaults: unique title, description, author, canonical, theme-color, OG image (`/public/CHICK ROCKS.png` or a dedicated 1200x630), `og:site_name`, `og:locale=en_US`, Twitter large-image tags.
- [ ] Wire `react-helmet-async` into [src/App.tsx](src/App.tsx) via `HelmetProvider` and add `<Helmet>` blocks to each page component. For the WP theme, use `wp_head()` + plugin (Yoast / Rank Math).
- [ ] **Sitemap.** Generate `public/sitemap.xml` at build time (prefer `vite-plugin-sitemap` or a simple Node script in [optimize-images.js](optimize-images.js) style) listing every route + blog post. Include `<lastmod>`.
- [ ] **Robots.** Tighten [public/robots.txt](public/robots.txt) to add `Sitemap: https://chickrocksusa.com/sitemap.xml` and disallow `/wp-admin/`, `/*?*edit=*`, etc.
- [ ] **HTTPS.** Verify site-wide HTTPS + HSTS; ensure the WordPress theme export doesn't downgrade any asset URLs.
- [ ] **Canonicals.** Add `<link rel="canonical">` on every page. Avoid trailing-slash duplicates — pick one and 301 the other.
- [ ] **Image alts.** Audit `src/components/*Section.tsx` for `<img>` without `alt`. Descriptive, keyword-aware alt text (e.g., `alt="Halal crispy chicken sandwich at Chick Rocks Astoria"`).
- [ ] **Favicons + apple-touch-icon.** [public/apple-touch-icon.png](public/apple-touch-icon.png), `favicon-32.png`, `favicon-16.png` exist — register them in `<head>` and add a `site.webmanifest`.
- [ ] **Google Business Profile.** Category = "Halal restaurant" (primary) + "Fried chicken takeout"; complete every field; upload 20+ photos; enable ordering link; commit to 1 post/week.

---

## 4. Technical SEO — Structural (Weeks 2–4)

- [ ] **Prerender / SSG.** Vite SPAs ship an empty `<div id="root">` (confirmed at [index.html:19](index.html#L19)); crawlers see nothing. Fix via `vite-plugin-ssr`, `react-snap`, or prerendering each route at build (`npm run build && vite-ssg`). This alone typically unlocks the 60–70% visibility the report cites.
- [ ] **Schema markup (JSON-LD).** Emit via Helmet per page:
  - Site-wide: `Restaurant` + `Organization` (name, url, logo, sameAs for Instagram/Yelp/DoorDash).
  - `/`: `Restaurant` with `servesCuisine: ["Halal","Fried Chicken","American"]`, `address`, `geo`, `openingHoursSpecification`, `priceRange`, `hasMenu`, `acceptsReservations: false`.
  - `/menu`: `Menu` → `MenuSection` → `MenuItem` with price, description, `suitableForDiet: "https://schema.org/HalalDiet"`.
  - `/catering`: `Service` schema.
  - `/blog/*`: `BlogPosting` with author, datePublished, image.
  - `/faq`: `FAQPage`.
  - Reviews: `AggregateRating` pulled from GBP/Yelp.
  - `BreadcrumbList` on every non-home page.
- [ ] **Internal linking.** Hero/menu/catering sections in [src/components/](src/components/) should cross-link with keyword-rich anchor text ("see our halal catering packages", not "click here"). Footer [src/components/Footer.tsx](src/components/Footer.tsx) gets a sitemap block.
- [ ] **URL hygiene.** Lowercase, hyphenated, no query strings in canonicals. Rename any image-based nav to semantic text.
- [ ] **Core Web Vitals.** Run Lighthouse on built output. Targets: LCP <2.5s, CLS <0.1, INP <200ms. Preload the hero webp in `<head>`; `fetchpriority="high"` on the hero `<img>`.
- [ ] **Menu as HTML, not images.** Explicitly flagged in the report. Confirm [src/pages/Menu.tsx](src/pages/Menu.tsx) renders every item as HTML text with `<h2>`/`<h3>`/`<p>` + price + halal/allergen/dietary labels. Source from [src/lib/data/uber-eats-astoria/20260421-menu.json](src/lib/data/uber-eats-astoria/20260421-menu.json) to keep parity with the real menu.

---

## 5. Content Gap — Short Term (Months 1–2)

Mirrors the report's Short-Term block.

- [ ] **Full HTML menu page.** Item-level descriptions, prices, calorie/allergen flags, halal certification callout, photos with alt text.
- [ ] **Location page: `/locations/astoria`.** H1: "Halal Fried Chicken in Astoria, NY". Include address, hours, phone (tel: link), embedded Google Map, parking/subway directions, neighborhood copy ("near Astoria Park, 30th Ave, Ditmars"), LocalBusiness schema, 3–5 interior/food photos. This is the page that captures "halal fried chicken astoria".
- [ ] **Location page: `/locations/flushing`.** Stub for expansion signaling (report flags Flushing).
- [ ] **FAQ page.** "Is everything halal?", "Where does your chicken come from?", "Do you deliver?", "What's the catering minimum?", "Are you gluten-free friendly?", etc. — each as `<h2>` + answer; wire FAQPage schema.
- [ ] **About page upgrade.** Brand story, founders, halal sourcing, Astoria community ties. Long-form (600–900 words) with photos.
- [ ] **Catering page upgrade.** Package tiers, minimums, delivery radius, sample menus, lead-time, contact form with schema `Service`.
- [ ] **Review generation.** Install a post-purchase email/SMS flow asking for Google + Yelp reviews. Target 50+ new reviews in 6 months (report's benchmark).

---

## 6. Content Gap — Long Term (Months 3–12)

- [ ] **Blog program: 12–16 articles.** One cluster per theme, internally linked to `/menu` and `/locations/astoria`:
  - Halal authority: "What makes fried chicken truly halal?", "How we source our halal chicken", "Halal certification explained".
  - Local: "Best halal food in Astoria", "Astoria food scene guide", "Halal late-night eats in Queens".
  - Product: "Our crispy chicken sandwich, explained", "How we brine and bread", "Spice level guide".
  - Comparison: "Halal vs non-halal fried chicken", "Chick Rocks vs [generic category]".
  - Catering: "Halal office catering in NYC: what to order", "Planning a halal birthday party in Queens".
- [ ] **Item-level pages.** `/menu/crispy-chicken-sandwich`, `/menu/halal-wings`, `/menu/rice-bowl`, `/menu/tenders`, `/menu/chicken-combo`. Each 300–500 words + hero photo + ingredients + nutrition + "order now" CTA + MenuItem schema.
- [ ] **Video.** 30–60s clips: menu tour, kitchen behind-the-scenes, customer testimonials. Host on YouTube (titles + descriptions with target keywords), embed on relevant pages, add `VideoObject` schema.
- [ ] **User-generated content.** Pull tagged Instagram photos (with permission) into a homepage grid; surface Google reviews on `/` and `/locations/astoria` with `Review` schema.
- [ ] **Schema expansion.** `HowTo` on recipe posts, `Event` if any pop-ups/openings, `SpecialAnnouncement` for Ramadan hours.

---

## 7. Backlinks (Months 1–6)

Target: **+50–75 referring domains** (currently 47). Track in a spreadsheet with status, contact, date.

- [ ] **Directories.** Yelp, TripAdvisor, DoorDash, Uber Eats, Grubhub, Seamless, Google Business Profile, Apple Maps, Bing Places, Yellow Pages, Foursquare.
- [ ] **Halal-specific directories.** Zabihah, HalalTrip, Crescentrating, Muslim Pro listings, IslamicFinder, HalalAdvisor, local mosque community boards. **The report flags this as the biggest under-tapped bucket.**
- [ ] **Local press & blogs.** Queens Daily Eagle, Astoria Post, We Heart Astoria, Queens Eats, Eater NY (tips line), Secret NYC, Thrillist, Time Out NY. Pitch angle: "Astoria's first dedicated halal fried chicken concept".
- [ ] **Community partnerships.** NYC public schools halal lunch programs, Astoria mosques, Masjid catering contacts, local nonprofits (Astoria Food Pantry), QCC/LaGuardia student orgs.
- [ ] **HARO / Qwoted.** Respond to "halal food", "NYC restaurants", "fried chicken" queries weekly.
- [ ] **Podcasts & creators.** Halal food TikTokers, Queens food vloggers — host tastings, get natural dofollow mentions.

---

## 8. Analytics, Tracking & Measurement

- [ ] **GA4** on every page (or Plausible/Umami if privacy-first). Fire events: `order_click`, `menu_view`, `catering_lead`, `phone_click`, `direction_click`.
- [ ] **Google Search Console** verified; submit sitemap; monitor Coverage + Enhancements weekly.
- [ ] **Bing Webmaster Tools** — same.
- [ ] **UTM discipline** on every external post, email, ads campaign (report calls this out on Jollibee deep dive).
- [ ] **Rank tracking.** Free tier: Google Search Console + SERPRobot. Paid: Ahrefs / SE Ranking for the target keyword set above.
- [ ] **Monthly SEO report.** Organic sessions, impressions, top queries, top landing pages, new backlinks, review count, GBP insights (calls, directions, website clicks).

---

## 9. KPIs & Milestones

| Horizon | Metric | Baseline | Target |
|---------|--------|----------|--------|
| Month 1 | Indexed pages | ~8 | 20+ |
| Month 1 | GBP posts live | 0 | 4 |
| Month 3 | Monthly organic visits | 121 | 500 |
| Month 3 | Ranking keywords | 21 | 150 |
| Month 3 | Referring domains | 47 | 70 |
| Month 6 | Monthly organic visits | 121 | 2,000 |
| Month 6 | Google reviews | current | +50 |
| Month 6 | Referring domains | 47 | 100+ |
| Month 12 | Monthly organic visits | 121 | 8,000–12,000 |
| Month 12 | #1 for "halal fried chicken astoria" + 10 halal long-tails | — | achieved |

---

## 10. Implementation Checklist (Condensed)

**This week**
1. Install `react-helmet-async`, add `HelmetProvider` in [src/App.tsx](src/App.tsx).
2. Add per-page `<Helmet>` with title/desc/canonical/OG for all 8 routes.
3. Expand [index.html](index.html) `<head>` defaults + OG image.
4. Generate `public/sitemap.xml`; update [public/robots.txt](public/robots.txt) with Sitemap line.
5. Audit every `<img>` for alt text; fix missing ones.
6. Complete Google Business Profile to 100% + schedule 4 weekly posts.

**Weeks 2–4**
7. Add prerendering to the Vite build so crawlers see real HTML.
8. Ship `Restaurant` + `LocalBusiness` + `Menu` + `FAQPage` + `BreadcrumbList` JSON-LD.
9. Rebuild [src/pages/Menu.tsx](src/pages/Menu.tsx) as HTML items sourced from [src/lib/data/uber-eats-astoria/20260421-menu.json](src/lib/data/uber-eats-astoria/20260421-menu.json).
10. Create `/locations/astoria`, `/faq`; stub `/locations/flushing`.
11. Launch review-request email/SMS flow.

**Months 2–3**
12. Publish first 4 blog posts + 3 item-level menu pages.
13. Submit to halal directories (Zabihah, HalalTrip, etc.); pitch 10 local blogs.
14. Ship videos for homepage + menu page.

**Months 3–12**
15. Hit 12–16 blog posts, 50+ reviews, 50–75 new backlinks.
16. Re-evaluate WordPress migration if Vite/prerendering ceiling is hit (the report flags Wix specifically, but the same logic applies to any SPA-only setup).

---

## 11. Notes on Dual Build (SPA + WordPress Theme)

This repo ships both the Vite SPA and a WordPress theme (`wordpress-theme/`, [build-wp-theme.js](build-wp-theme.js), [wp-templates/](wp-templates/)). Every SEO change must land in both paths or one will drift:

- **SPA path:** Helmet in React components + prerender at build.
- **WP path:** `wp_head()` + Yoast/Rank Math for titles/meta/schema; ensure [wp-templates/](wp-templates/) renders the same H1/H2/copy as the React components.
- Single source of truth for menu data = [src/lib/data/uber-eats-astoria/20260421-menu.json](src/lib/data/uber-eats-astoria/20260421-menu.json). Both builds should read from it rather than hand-coded duplicates.
