# Agent readiness audit: next-md-negotiate.vercel.app

- **State:** Awaiting deployment
- **Audited at:** 2026-08-26T12:23:07Z
- **Live URL:** https://next-md-negotiate.vercel.app
- **Repository:** /Users/kacpersinilo/Desktop/projects/next-md-negotiate (https://github.com/kasin-it/next-md-negotiate)
- **Source revision:** f4304d14d7b47e0c74f9fbc3c9d1a15e728fb835 (main)
- **Deployment provenance:** Live HTML and negotiated Markdown identify “next-md-negotiate,” describe the same library, and link the GitHub repository and npm package defined at landing/app/layout.tsx:16-29, landing/app/layout.tsx:41-70, and landing/md.config.ts:382-420. The landing app is configured for Vercel at landing/vercel.json:1-5. The exact deployed commit is not exposed publicly.
- **Public-report notice:** Before scanning, the user was told that Is Agentic may retain a stable public report for the supplied public URL. The explicit URL invocation authorized the scan.

## Target mapping

The target is one public HTTPS URL without embedded credentials. An unauthenticated request returned HTTP 200 and the product title, repository link, npm link, and distinctive negotiated Markdown found in this checkout, establishing a concrete repository-to-deployment match.

Other public surfaces discovered but not included in this invocation:

- https://github.com/kasin-it/next-md-negotiate
- https://www.npmjs.com/package/next-md-negotiate
- https://next-md-negotiate-git-main-kcpis-projects.vercel.app

The previous report covered the branch-preview hostname, not this canonical target, so no score comparison is valid.

## Executive summary

- **Is Agentic score:** 57
- **Score label:** Important blockers remain
- **Scanner report:** https://is-agentic.com/scan/next-md-negotiate.vercel.app
- **Scanner timestamp:** 2026-08-26T12:21:09.121Z
- **Highest priority:** High

The public site is accessible and unusually useful to agents because core pages successfully negotiate concise Markdown. Two real defects undermine that journey: negotiated responses omit <code>Accept</code> from <code>Vary</code>, and an unknown negotiated documentation path returns HTTP 200 with a “Not Found” body while its HTML representation returns 404. Several API, organization, and MCP checks do not fit this npm library/documentation site; those provider results are preserved below and marked non-applicable or contradicted rather than discarded.

## Is Agentic results

The current [methodology](https://is-agentic.com/methodology) and [developer documentation](https://is-agentic.com/docs) were read before the one baseline CLI attempt.

### Verbatim report metadata

- **target:** https://next-md-negotiate.vercel.app
- **display_target:** next-md-negotiate.vercel.app
- **report_url:** https://is-agentic.com/scan/next-md-negotiate.vercel.app
- **score:** 57
- **score_label:** Important blockers remain
- **scanned_at:** 2026-08-26T12:21:09.121Z
- **eligible_checks:** 25

### score_breakdown

| Bucket | Provider fields |
| --- | --- |
| essential | earned: 48.9; available: 80; passing: 5; total: 9 |
| recommended | earned: 6.7; available: 20; passing: 4; total: 16 |
| bonus | points: 1.8; positive_signals: 8 |

The CLI returned 16 issue records. Every record appears exactly once below with its original id, name, tier, result, details, and recommendation.

## Prioritized backlog

| Priority | Finding | Provider status | Surface | Confidence | Verification |
| --- | --- | --- | --- | --- | --- |
| High | Negotiated documentation soft-404s | partial | Source | High | Unknown HTML and Markdown documentation URLs both return 404/410 with recovery links |
| High | Negotiated responses omit Accept from Vary | failed | Source | High | Both representations include <code>Accept</code> in <code>Vary</code> |
| Medium | Developer-resource search used the wrong entity | failed | Source | Medium | Exact-brand search resolves the canonical site and docs |
| Medium | Canonical domain is absent from exact-brand results | failed | DNS/Edge | Medium | Exact-brand search returns the canonical deployment/domain |
| Medium | Software identity lacks JSON-LD | failed | Source | High | Homepage exposes truthful software JSON-LD |
| Medium | No site-level when-to-use instruction file | failed | Source | High | <code>/llms.txt</code> returns use cases, negotiation instructions, and docs links |
| Medium | No sitemap for documentation routes | failed | Source | High | <code>/sitemap.xml</code> lists all indexable routes |
| Medium | Canonical URL and Open Graph image are missing | partial | Source | High | All four provider metadata signals are present |
| Emerging | OpenAPI requested for a non-HTTP library | failed | Source | High | Check becomes N/A, or a real HTTP API ships with a spec |
| Emerging | JSON API errors requested without a supported API | failed | Source | High | Check becomes N/A, or a real API returns structured JSON errors |
| Emerging | Public API does not match the product capability | failed | Source | High | Check becomes N/A unless an operational API is introduced |
| Emerging | API schema analysis does not apply | failed | Source | High | Check becomes N/A unless an API is introduced |
| Emerging | Function-calling compatibility does not apply | failed | Source | High | Check becomes N/A unless callable operations are introduced |
| Emerging | Organization schema does not match the identity | failed | Source | High | Check becomes N/A; software identity remains truthful |
| Emerging | Business-style trust pages are weakly applicable | failed | Source | Medium | Ownership, support, license, and privacy posture are discoverable |
| Emerging | Vercel MCP package was attributed to this product | partial | External service | High | Scanner stops attributing <code>@vercel/mcp-adapter</code> to the project |

## Findings

### High: Negotiated documentation soft-404s

- **Is Agentic check:** agent-friendly-404 — Agent-friendly 404s
- **Provider tier/status:** essential / partial
- **Applicability:** Applies; agents must distinguish missing documentation from existing content.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** Nonexistent paths return a real HTTP 404. For full credit, include a short markdown body (site map links, where to look next) so agents can recover.
- **Live evidence:** A generic missing path returned HTTP 404 with the default HTML Next.js error. Contradiction: <code>/docs/agent-readiness-definitely-missing-8d7f4c</code> returned HTML 404, but with <code>Accept: text/markdown</code> it returned HTTP 200, <code>text/markdown</code>, and “# Not Found.”
- **Source evidence:** landing/md.config.ts:445-449 catches every <code>/docs/[...slug]</code> value and returns a “Not Found” string; src/createMdHandler.ts:28-36 returns every matched string with status 200. No custom not-found page exists.
- **Impact:** Agents are told a nonexistent resource exists, breaking representation consistency and link/index validation.
- **Provider recommendation:** Return a real HTTP 404 (or 410) status for nonexistent paths - never a 200 with your app shell, which makes agents believe every path exists. For full credit, give the 404 response a short markdown body pointing agents at your sitemap, llms.txt, or docs index. Verify with `curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/some-path-that-does-not-exist` - it must print 404.
- **Auditor response:** Replace the broad docs catch-all with explicit routes, or extend the Markdown handler contract to support status codes. Add concise recovery links.
- **Verification:** Unknown generic and <code>/docs/*</code> URLs return 404/410 for both representations with docs, sitemap, or llms.txt recovery links.

### High: Negotiated responses omit Accept from Vary

- **Is Agentic check:** markdown-negotiation-vary — Markdown content negotiation (acceptmarkdown.com)
- **Provider tier/status:** essential / failed
- **Applicability:** Directly applies; negotiation is the product’s core capability.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** Two-representation negotiation works but Vary header missing Accept (got "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch") - CDNs may cache wrong variant
- **Live evidence:** Direct HTML and Markdown homepage responses both omitted <code>Accept</code> from <code>Vary</code>.
- **Source evidence:** src/createMdHandler.ts:34-36 sets only <code>Content-Type</code>; no implementation sets <code>Vary</code>.
- **Impact:** Shared caches may serve the wrong representation, defeating the core journey.
- **Provider recommendation:** On the responses that serve text/markdown via Accept negotiation, add Accept to the Vary header (Vary: Accept, Accept-Encoding). Without it, CDNs can serve the cached HTML variant to an agent asking for markdown (or vice versa), depending on which variant landed in cache first.
- **Auditor response:** Merge <code>Accept</code> into <code>Vary</code> on every negotiable response without removing Next.js fields.
- **Verification:** Warm-cache requests consistently return the requested type and both representations vary on <code>Accept</code>.

### Medium: Developer-resource search used the wrong entity

- **Is Agentic check:** agentic-search-specific — Developer resource discoverability
- **Provider tier/status:** recommended / failed
- **Applicability:** Partly applies, but the provider searched for the host rather than the product.
- **Remediation surface:** Source
- **Confidence:** Medium
- **Provider evidence:** Agent searched for "vercel" developer resources but found nothing relevant
- **Live evidence:** Contradiction: the title is “next-md-negotiate”; the homepage links <code>/docs</code>, GitHub, npm, and quickstart; <code>/docs</code> returns 200. Exact-brand search found package and maintainer resources.
- **Source evidence:** landing/app/layout.tsx:16-29 and 41-75 identify these resources; landing/md.config.ts:414-419 exposes them in Markdown.
- **Impact:** The failed query does not measure this product, though the canonical site remains poorly indexed.
- **Provider recommendation:** Make your developer resources (API docs, OpenAPI spec, auth docs, developer portal, MCP server) discoverable by name. Publish them at predictable URLs, list them in llms.txt, and include your product name in page titles and headings so search engines surface them for name-based queries.
- **Auditor response:** Publish a canonical URL, sitemap, and llms.txt pointing to docs, GitHub, and npm. Do not invent auth, OpenAPI, or MCP docs.
- **Verification:** Exact-brand search resolves the canonical site and the scanner uses the product name.

### Medium: Canonical domain is absent from exact-brand results

- **Is Agentic check:** brand-search-accuracy — Brand name discoverability
- **Provider tier/status:** recommended / failed
- **Applicability:** Applies to the unique package name, but the provider’s query was generic.
- **Remediation surface:** DNS/Edge
- **Confidence:** Medium
- **Provider evidence:** "next" search returned 9 results but domain did not appear - brand may be too generic or not indexed
- **Live evidence:** Contradiction: “next” is not the brand. Exact search for “next-md-negotiate” found [Socket](https://socket.dev/npm/package/next-md-negotiate/overview/1.1.3), the [maintainer’s site](https://kasin-it.dev/), social mentions, and Hacker News, but not this canonical Vercel deployment.
- **Source evidence:** package.json:2-4 and landing/app/layout.tsx:16-28 consistently use the full name.
- **Impact:** Agents find ecosystem pages but may miss the canonical documentation.
- **Provider recommendation:** Make sure a clean search for your brand name returns your own domain in the top results. If it does not, your brand may be too generic, conflict with a more established term, or not yet indexed. Strengthen brand-name search by claiming consistent NAP across listings, earning press mentions that link to the canonical domain, and avoiding redirect chains that mask the apex domain in search results.
- **Auditor response:** Establish a stable canonical URL, link it from GitHub/npm/maintainer surfaces, and submit a sitemap. NAP tactics do not fit this package.
- **Verification:** Exact-brand search returns the canonical docs domain near the top.

### Medium: Software identity lacks JSON-LD

- **Is Agentic check:** json-ld — JSON-LD structured data
- **Provider tier/status:** recommended / failed
- **Applicability:** Applies; a package has a truthful software identity.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No JSON-LD structured data found on homepage
- **Live evidence:** No <code>application/ld+json</code> script was returned.
- **Source evidence:** Not found. landing/app/layout.tsx:16-29 defines regular metadata only.
- **Impact:** Agents must infer identity, repository, author, license, and relationships from prose.
- **Provider recommendation:** Add JSON-LD structured data to your homepage using the identity type that matches your site - SoftwareApplication for products, Organization or LocalBusiness for companies, Person for personal sites, Article for blogs - with name, description, url, and type-appropriate fields (offers, sameAs, author) so AI can parse your identity programmatically.
- **Auditor response:** Add truthful SoftwareApplication or SoftwareSourceCode JSON-LD with package name, canonical URL, repository/npm links, author, MIT license, and version. Do not fabricate offers.
- **Verification:** Live JSON-LD validates and matches package.json.

### Medium: No site-level when-to-use instruction file

- **Is Agentic check:** agent-instruction — Agent instruction / when-to-use
- **Provider tier/status:** recommended / failed
- **Applicability:** Applies narrowly; a site file helps discovery, but the provider missed strong inline guidance.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No agent instruction file with when-to-use guidance found
- **Live evidence:** <code>/llms.txt</code> returned 404. Contradiction: the homepage embeds <code>&lt;script type="text/llms.txt"&gt;</code> telling agents to re-request the exact URL with <code>Accept: text/markdown</code>, and it works.
- **Source evidence:** src/LlmHint.ts:3-17 defines the instruction; landing/app/page.tsx:118-122 renders it. No standalone file exists.
- **Impact:** Agents recognizing the inline proposal succeed; file-oriented agents lack a route inventory and use-case guide.
- **Provider recommendation:** Tell agents when to reach for you: add a 'when to use this' section to your llms.txt (or a dedicated agent-instructions file) that names your best-fit use cases and how an agent should call you. Be specific about the jobs you are right for - generic marketing copy does not read as guidance.
- **Auditor response:** Add <code>/llms.txt</code> with use cases, negotiation instructions, and links to docs, quickstart, API reference, GitHub, and npm. Keep the inline hint.
- **Verification:** The file returns product-specific guidance and the inline instruction remains.

### Medium: No sitemap for documentation routes

- **Is Agentic check:** sitemap — Sitemap exists
- **Provider tier/status:** recommended / failed
- **Applicability:** Applies to the finite public docs route set.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No sitemap found
- **Live evidence:** <code>/sitemap.xml</code> returned HTTP 404 HTML.
- **Source evidence:** Not found. landing/app/docs/nav.ts:1-37 enumerates seven docs routes suitable for generation, plus the homepage.
- **Impact:** Agents lack a canonical inventory.
- **Provider recommendation:** Add a valid XML sitemap at /sitemap.xml listing all indexable URLs. Include lastmod dates and keep it under 50MB.
- **Auditor response:** Generate it from the production URL and real docs navigation; use truthful <code>lastmod</code> values or omit them.
- **Verification:** Valid XML lists every indexable route and no nonexistent URL.

### Medium: Canonical URL and Open Graph image are missing

- **Is Agentic check:** metadata-completeness — Metadata completeness
- **Provider tier/status:** recommended / partial
- **Applicability:** Applies to identity and attribution.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** 2/4 metadata signals present - missing: canonical URL, og:image
- **Live evidence:** Homepage has <code>lang=en</code> and <code>og:type=website</code>, but no canonical link or <code>og:image</code>.
- **Source evidence:** landing/app/layout.tsx:16-29 defines type but no metadata base, canonical, or image; line 37 defines language.
- **Impact:** Canonical identity and link attribution are weaker.
- **Provider recommendation:** Add all four signals to your homepage: <link rel="canonical">, <html lang="...">, <meta property="og:image">, and <meta property="og:type">. Agents use these for entity resolution and attribution.
- **Auditor response:** Configure production metadata/canonical URL and a product-owned Open Graph image.
- **Verification:** All four signals use absolute production URLs.

### Emerging: OpenAPI requested for a non-HTTP library

- **Is Agentic check:** openapi-spec — OpenAPI spec published
- **Provider tier/status:** essential / failed
- **Applicability:** Does not apply; this is an npm library and docs site, not a supported REST API.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No OpenAPI/Swagger specification found
- **Live evidence:** <code>/openapi.json</code> and <code>/api/openapi.yaml</code> returned 404 HTML.
- **Source evidence:** Not found. package.json:6-25 describes library exports/CLI; landing/app/md-api/[[...path]]/route.ts:1-4 is an internal representation handler.
- **Impact:** None for genuine journeys; a fabricated schema would misrepresent the product.
- **Provider recommendation:** Publish an OpenAPI (Swagger) specification at /openapi.json or /api/openapi.yaml. This is how agents understand your API surface automatically.
- **Auditor response:** Do not add OpenAPI unless a supported HTTP API is introduced.
- **Verification:** The check is N/A, or a future API ships with an accurate spec.

### Emerging: JSON API errors requested without a supported API

- **Is Agentic check:** json-error-responses — JSON error responses
- **Provider tier/status:** essential / failed
- **Applicability:** Does not apply because there is no supported JSON API.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** API does not return JSON error responses (or no API detected)
- **Live evidence:** A nonexistent <code>/api/*</code> route returned 404 HTML, not evidence of an API contract.
- **Source evidence:** Not found for a supported API. src/createMdHandler.ts:37-44 emits plain text for internal representation-handler failures.
- **Impact:** None unless a public JSON API is introduced.
- **Provider recommendation:** Return structured JSON error responses with error codes, messages, and resolution hints. Agents can't parse HTML error pages.
- **Auditor response:** Do not create JSON errors for nonexistent API operations; define them if a real API ships.
- **Verification:** Check is N/A, or real JSON API errors follow a documented structured format.

### Emerging: Public API does not match the product capability

- **Is Agentic check:** public-api — Public API with reachable endpoints
- **Provider tier/status:** recommended / failed
- **Applicability:** Does not apply; users install the npm library and the site documents it.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No publicly reachable API surface detected (REST and GraphQL both absent or auth-gated)
- **Live evidence:** No supported REST/GraphQL integration was found; docs and negotiated Markdown are public.
- **Source evidence:** package.json:6-25 exposes package imports and a CLI; landing/app/docs/api/page.tsx documents TypeScript, not HTTP.
- **Impact:** None. A hosted API would be a materially different product.
- **Provider recommendation:** Expose a public REST or GraphQL API. AI agents need programmatic access  - not just a web UI  - to integrate with your product.
- **Auditor response:** Do not build an unrelated hosted API for scanner credit; npm, CLI, and TypeScript are the genuine interfaces.
- **Verification:** The scanner excludes this check unless a hosted API is genuinely offered.

### Emerging: API schema analysis does not apply

- **Is Agentic check:** api-schema-analysis — API schema complexity analysis
- **Provider tier/status:** recommended / failed
- **Applicability:** Does not apply without REST or GraphQL.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No API schema detected
- **Live evidence:** No schema was found; OpenAPI candidate URLs returned 404.
- **Source evidence:** Not found for HTTP/GraphQL; the TypeScript interface is documented at landing/app/docs/api/page.tsx.
- **Impact:** None until an operational API exists.
- **Provider recommendation:** Make your API spec self-describing: a unique operationId and a description on every operation, typed parameters, and response schemas. For GraphQL, a fully typed schema with a documented cost or rate limit reads best.
- **Auditor response:** No remediation now; make any future real API self-describing.
- **Verification:** Check is N/A, or a future schema meets those conditions.

### Emerging: Function-calling compatibility does not apply

- **Is Agentic check:** function-calling-compat — Function calling compatibility
- **Provider tier/status:** recommended / failed
- **Applicability:** Does not apply; the package exposes no hosted callable operations.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No API spec found - function calling requires discoverable endpoints
- **Live evidence:** No OpenAPI or operational API was found.
- **Source evidence:** Not found. package.json:6-25 exposes code and CLI, not remote functions.
- **Impact:** None for current capabilities.
- **Provider recommendation:** Ensure API endpoints have unique operation IDs, typed schemas, and descriptions compatible with LLM function-calling formats.
- **Auditor response:** Do not invent remote functions; revisit if hosted operations are added.
- **Verification:** Check is N/A, or real operations have ids, types, and descriptions.

### Emerging: Organization schema does not match the identity

- **Is Agentic check:** org-schema-completeness — Organization schema completeness
- **Provider tier/status:** recommended / failed
- **Applicability:** Does not apply as written; the entity is an open-source package, not a represented organization/local business.
- **Remediation surface:** Source
- **Confidence:** High
- **Provider evidence:** No JSON-LD found - Organization schema missing
- **Live evidence:** No JSON-LD was present.
- **Source evidence:** package.json:41-46 identifies an individual author and GitHub repository; no organization/address/phone claim exists.
- **Impact:** Fabricated organization data would reduce trust; software JSON-LD remains useful.
- **Provider recommendation:** Add Organization JSON-LD that includes both contactPoint (with email/phone and contactType) and address (PostalAddress). This lets AI verify your business legitimacy and answer contact queries.
- **Auditor response:** Add software identity only; do not invent organization or contact facts.
- **Verification:** Software identity is accepted without inappropriate organization fields.

### Emerging: Business-style trust pages are weakly applicable

- **Is Agentic check:** trust-anchors — Trust anchor pages
- **Provider tier/status:** recommended / failed
- **Applicability:** Partly applies, but three 500-character business pages are disproportionate for this open-source package.
- **Remediation surface:** Source
- **Confidence:** Medium
- **Provider evidence:** No trust anchor pages found with sufficient content (About, Contact, Privacy)
- **Live evidence:** <code>/about</code>, <code>/contact</code>, and <code>/privacy</code> returned 404; homepage links GitHub/npm.
- **Source evidence:** landing/app/layout.tsx:55-70 exposes GitHub/npm; package.json:41-46 gives author, license, and repository.
- **Impact:** Code provenance is clear, but maintainership, support, and privacy posture lack canonical statements.
- **Provider recommendation:** Publish real /about, /contact, and /privacy pages with at least 500 characters of content each. These are the pages AI agents check to verify your business is legitimate before recommending you.
- **Auditor response:** Add concise truthful ownership, support, license, and privacy information; do not pad pages or imply a company.
- **Verification:** Those facts are directly discoverable on the canonical site.

### Emerging: Vercel MCP package was attributed to this product

- **Is Agentic check:** mcp-server — MCP server / manifest
- **Provider tier/status:** recommended / partial
- **Applicability:** Does not apply; this is a Next.js library, not an MCP service.
- **Remediation surface:** External service
- **Confidence:** High
- **Provider evidence:** First-party MCP server published by product org (npm, @vercel/mcp-adapter, 42694 score). Add live handshake at /.well-known/mcp for full credit.
- **Live evidence:** <code>/.well-known/mcp</code> returned 404. The site is hosted by Vercel but identifies next-md-negotiate.
- **Source evidence:** Not found. No MCP manifest, transport, tools, or dependency exists; landing/vercel.json:1-5 only configures hosting.
- **Impact:** The provider attributed its host’s package to this project; building MCP would add an unrelated capability.
- **Provider recommendation:** Build an MCP (Model Context Protocol) server exposing your API as tools. Use Streamable HTTP transport for full score. This lets Claude, ChatGPT, and other AI agents call your product natively.
- **Auditor response:** Do not add MCP for score; correct entity attribution and revisit only if genuine remote tools are planned.
- **Verification:** Scanner no longer attributes <code>@vercel/mcp-adapter</code> to this project.

## Remediation status

The user authorized all High and Medium findings on 2026-08-26. Source remediation is implemented in the working tree; DNS, deployment, package publication, search indexing, and a post-deployment scanner run have not been performed.

| Check | Local status | Source change | Deployment verification condition |
| --- | --- | --- | --- |
| agent-friendly-404 | Implemented | landing/proxy.ts returns negotiated Markdown 404s; landing/app/not-found.tsx gives browser recovery links | Unknown generic and docs URLs return 404/410 in both representations with recovery links |
| markdown-negotiation-vary | Implemented | Both library handlers set <code>Vary: Accept</code>; landing route merges it; landing/vercel.json preserves a complete edge vary value | Live HTML and Markdown responses both include <code>Accept</code> in <code>Vary</code> and never cross-serve bodies |
| agentic-search-specific | Implemented, indexing pending | Canonical metadata, llms.txt, sitemap, JSON-LD, and package homepage identify the exact product and developer resources | Exact-brand search resolves the canonical docs and scanner searches for the product rather than Vercel |
| brand-search-accuracy | Source signals implemented; DNS/Edge unchanged | Canonical URL, package homepage, sitemap, and consistent identity signals point to the audited Vercel URL | Exact-brand results include the canonical site after deployment and indexing |
| json-ld | Implemented | landing/app/layout.tsx emits truthful SoftwareSourceCode JSON-LD | Live homepage contains valid JSON-LD matching package metadata |
| agent-instruction | Implemented | landing/public/llms.txt adds specific when-to-use and negotiation guidance while preserving inline LlmHint | Live /llms.txt returns the new guidance |
| sitemap | Implemented | landing/app/sitemap.ts derives eight public URLs from the docs navigation | Live /sitemap.xml returns valid XML with all eight URLs |
| metadata-completeness | Implemented | Canonical metadata and a generated product-owned Open Graph image complete all four signals | Live homepage exposes canonical URL, language, og:image, and og:type |

### Validation evidence

- <code>npm test -- src/__tests__/createMdHandler.test.ts src/__tests__/createMdApiHandler.test.ts</code> — passed, 22/22 tests.
- <code>npm run build</code> at repository root — passed; ESM, CJS, CLI, and declarations built.
- <code>npm run lint</code> in landing — passed.
- <code>npm run build</code> in landing — passed; TypeScript and static generation completed, including sitemap, Open Graph image, not-found page, Markdown handler, and Proxy.
- Local production HTTP probes — passed: root HTML 200; root/docs Markdown 200 with <code>Accept</code> in combined <code>Vary</code>; unknown docs HTML and Markdown 404; llms.txt 200; sitemap 200 with eight URLs; Open Graph image 200; canonical, og:image, og:type, language, and JSON-LD present. Vercel-specific HTML edge headers remain unverified until deployment because <code>next start</code> does not apply vercel.json.
- <code>jq</code> validation of landing/vercel.json — passed.
- Full <code>npm test</code> — 126 tests passed and 12 were skipped; one existing demo-integration suite could not run because its child-process harness reported <code>spawnSync /bin/sh ENOENT</code> in this environment.
- Root <code>npm run typecheck</code> — inconclusive for these changes: it fails in untouched CLI/test files because Node type declarations are absent and also reports existing nullable CLI state. No reported error names a modified handler file.
- <code>git diff --check</code> — passed.

## Deployment verification

- **Baseline source/deployment:** Source revision f4304d14d7b47e0c74f9fbc3c9d1a15e728fb835 on main. Live content matches this repository; exact Vercel revision is unknown.
- **Remediated source/deployment:** Uncommitted working tree based on f4304d14d7b47e0c74f9fbc3c9d1a15e728fb835. Awaiting deployment of the landing app; the library handler fix has a patch changeset and separately awaits a package release.
- **Live verification:** Not run for remediations. Local production verification passed as recorded above. Deploy the landing app to https://next-md-negotiate.vercel.app, then return with the deployment commit or identifier. Publishing the package patch is required to deliver the handler-level <code>Vary</code> fix to npm consumers, but is not required for the audited landing URL because it includes a deployment wrapper.
- **Scanner verification:** Not run after remediation. The baseline remains score 57 at 2026-08-26T12:21:09.121Z. Per the remediation workflow, run the CLI exactly once only after the updated deployment is confirmed.

## Limitations

- This is a point-in-time review of public behavior and matching source evidence.
- Authenticated and private workflows were not exercised; none were discovered publicly.
- Search corroboration is provider- and time-dependent.
- The exact deployed commit could not be proven from public Vercel responses.
- The score and check definitions remain controlled by Is Agentic and may change.
- This report is not a security, accessibility, privacy, compliance, or universal compatibility certification.
