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
- Added a Pages Function middleware at functions/_middleware.js (orchestrator ruling). On Cloudflare Pages, static assets are served before _redirects is consulted, so the _redirects force-404 rules never fire for real files like /PROGRESS.md (confirmed serving 200 at launch). The middleware runs ahead of asset serving and returns a plain 404 for the blocklist (/DESIGN.md, /PROGRESS.md, /README.md, /REDESIGN.md, plus /functions/ defensively), matched case-insensitively on the pathname; everything else calls context.next(). The _redirects file is kept as a fallback. Matcher validated standalone with node: all blocked, case-variant, prefix and allow cases pass; live confirmation post-deploy.
