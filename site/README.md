# Inklo website

Two routes: a landing page at `/`, and the whole documentation on one page at `/docs`.
Live at [inklo.akshitbansal.dev](https://inklo.akshitbansal.dev), deployed to Vercel
(project `inklo`) from the repository root.

The stack: Next.js as a static export, Tailwind 4, shadcn and Magic UI components,
Biome, ESLint and tsc, with exact dependency versions.

## Running it

```bash
cd site
npm ci
npm run dev        # http://localhost:3000
```

Node 24 or later.

## The quality gate

```bash
npm run check      # Biome (format + import order + lint) -> ESLint -> tsc
npm run check:ci   # the same, non-mutating: fails on unformatted code
npm run build      # static export to out/
```

`.github/workflows/site.yml` runs `check:ci` and `build` on every push and pull request
that touches the site or a file it reads.

| Tool | Owns |
| --- | --- |
| **Biome** | Formatting, import order, general JS/TS lint (`noExplicitAny` and `noConsole` are errors) |
| **ESLint** | React hooks, JSX, accessibility, Next.js rules |
| **tsc** | Type checking |

**Versions are pinned exactly.** Two are deliberately behind `latest`: `eslint` stays on
9.x because the `eslint-plugin-react` that `eslint-config-next` bundles breaks on ESLint
10, and `typescript` stays on 5.9.3. Dependabot holds both back from major updates.

## It must be built from inside the repository

`lib/repo.ts` reads one file at build time: `../package.json`, for the version shown on
both pages. A copy typed into a page would be one more place to forget when the version
changes. If the file cannot be parsed, the build fails rather than shipping a page with
no version. That is why the deploy runs from the repository root: the root `vercel.json`
installs and builds inside `site/` and serves `site/out`, and `.vercelignore` keeps the
app's own source out of the upload.

## Content sources

Everything on both pages traces to the repository's own documents:

| Section | Source |
| --- | --- |
| Install, check the download, where things live, upgrading, uninstall, upgrading from Keyslate, what it does, shortcuts, limits | `README.md` |
| Your files stay yours | `README.md`, `CHANGELOG.md` |
| Security | `SECURITY.md` |
| Develop | `CONTRIBUTING.md`, `README.md` |
| Releases | `README.md` |

There is no screenshot, so the site shows none. Nothing is invented to fill a section:
no usage figures, no users, no testimonials.

## Hosting

The site is a static export (`output: "export"`), so it ships as plain files with no
Next.js runtime. `cleanUrls` in `vercel.json` makes `/docs` serve `docs.html`.

Response headers come from `vercel.json` too: a Content-Security-Policy, `nosniff`, a
referrer policy and a Permissions-Policy that switches off device APIs the site never
uses. `script-src` and `style-src` allow `'unsafe-inline'` because the export carries
inline scripts (next-themes' no-flash script and the React Server Components payload)
and React writes `style` attributes. A new external resource has to be added to the
policy or the browser will block it.
