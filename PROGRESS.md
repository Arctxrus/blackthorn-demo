# Progress

## 2026-08-07 · Domain migration to Cloudflare Pages

- New URL: https://blackthorn.pagefront.co.uk (served at domain root, no project subpath).
- Hosting moved to Cloudflare Pages, auto-deploy on push to main.
- Updated canonical, og:url and the JSON-LD @id/url to the new subdomain.
- Updated robots.txt Sitemap line and sitemap.xml loc to the new subdomain.
- No absolute /blackthorn-demo/ asset paths or base href tags existed, so no path fixes were needed; all asset references were already relative.
- og:image and twitter:image point at the external Unsplash CDN, not the site, so they were left unchanged.
- No CNAME file present.
- Bumped the existing cache-busting scheme from ?v=39 to ?v=40 on styles.css and script.js.
- Added a `_redirects` file at the repo root forcing 404 on the non-site docs that Cloudflare Pages would otherwise serve by path: /DESIGN.md, /PROGRESS.md, /README.md, /REDESIGN.md. Site files (index.html, robots.txt, sitemap.xml, css, js) stay reachable.
