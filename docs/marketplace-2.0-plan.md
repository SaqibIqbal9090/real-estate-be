# Marketplace 2.0 Build Plan

A ground-up redesign of the marketplace frontend, three-role platform with a verified-listing lead pipeline, and RemodelHomes absorbed as a native remodeling module — one backend, one frontend, one product. A community feed and vendor directory follow after MVP (§8).

- **Prepared:** Sep 7, 2026
- **Status:** For client sign-off
- **Timeline:** ≈ 7–8 weeks
- **Shareable version:** https://claude.ai/code/artifact/51aa90a6-c14e-4504-a007-4ba013d11d23

## 1. What changes, what stays

- **New Next.js frontend, built from scratch.** Complete visual redesign; the current template-based app is retired. Fresh repository with clean history.
- **Existing NestJS backend stays** and is extended — auth, properties, buy/sell/rent requests, insurance, and contact modules carry over unchanged.
- **RemodelHomes.ai is retired as a separate product.** Its Django backend is ported into the NestJS backend as a `remodel` module; its user-facing flows move to `/remodel` in the new frontend. remodelhomes.ai will 301-redirect there.
- **Three roles** — User, Agent, Super Admin — each with their own dashboard, plus an admin-verified listing workflow that ends in agent leads.

```
new Next.js app ────────► NestJS API (real-estate-be) ────────► PostgreSQL
  public site + 3 dashboards   existing modules + remodel,        S3 (images)
  /remodel module              agents, blogs, leads, RBAC         Redis (job queue)
                                        │
                                        └──► Stability AI (image generation)
```

## 2. Feature scope

| Feature | What ships | Status |
|---|---|---|
| 1.5% listing | Commission messaging across landing page and sell flow | New |
| Free remodeling |For listing customers free remodeling quouta will be 3 requests for bedroom and living room. Non customers will buy subscriptions. | New |
| Free video & promotion | 1 time 1 video for listed property. 1 time promotion on all social media. After that user can buy promotional plan | New |
| Blogs (SEO) | Admin-authored posts; public `/blog` pages pre-rendered with full meta + sitemap | New |
| Apartment | New property type across filters, listings, and sell/rent forms | New |
| Real Estate News | Profile links, share buttons, and Open Graph tags on property pages | New |
| Insurance | Quote flow already live in the backend; UI rebuilt in the redesign | **Built** |
| Agent registration | Name, brokerage, phone, email, service zipcodes → stored + admin approval | New |
| Remodeling module | Interior, exterior, fill-room & decor staging (empty-room follows, see §5) | New |
|Adds On real estate news| 
| Real Estate News | Profile links, share buttons, and Open Graph tags on property pages | New |
| Comercial property | New property type across filters, listings, and sell/rent forms (Future scope) | New |
## 3. Roles & the listing-to-lead workflow

Role-based access is added to the existing JWT auth: **User**, **Agent** (activated on admin approval), and **Super Admin**. Every sell or rent-out submission enters a verification pipeline handled manually by the admin team:

1. **User** submits sell / rent-out request → property enters **Pending verification**; editing and publishing are locked.
2. **Super Admin** verifies ownership — or rejects → status set to **Verified** (or **Rejected**); the user is notified by email either way.
3. **User** updates the listing and publishes → editing unlocks on verification; publishing makes the property live on the site.
4. **Super Admin** sends the published property as a lead → assigns to agents — manually, with zipcode-based suggestions from agents' service areas.
5. **Agent**  Works On verication on id verification of property owner.Take pictures , paper work signature for listing and lockbox (On behave )

| Dashboard | Contents |
|---|---|
| User | My properties (verification state), sell/rent/buy requests, remodel generations, profile |
| Agent | Assigned leads with property details and status updates; service areas and profile |
| Super Admin | Verification queue (approve/reject), agent approvals, lead assignment, users, blog editor, and all submissions (insurance, rent quotes, contact) |

## 4. New frontend — page inventory

| Area | Pages |
|---|---|
| Public | Home, properties list + filters, property detail, about, contact, privacy, terms |
| Flows | Buy, sell, and rent-out wizards; insurance quote flow |
| Remodel | Landing, upload → style & room pickers → generation progress → results, my generations |
| Content | `/blog` index and post pages (ISR, SEO meta, sitemap) |
| Agents | Registration form |
| Auth | Login, register, verify email, forgot / reset password |
| Dashboards | User, Agent, and Super Admin (role-gated under `/admin`) |

Stack: Next.js 15 (App Router) · TypeScript · Tailwind · typed client for the existing REST API. Property and blog pages pre-rendered for SEO.

## 5. Remodel migration — Django → NestJS

The audit showed the Django backend is an *orchestrator*: four of five features are Stability AI API calls plus a prompt library, so they port cleanly. With no active users, nothing needs migrating — Django's auth and Stripe layers are simply dropped in favor of marketplace accounts and the free-quota model.

| Django piece | NestJS replacement |
|---|---|
| Interior / exterior / fill-room / staging | Stability API services; prompts ported 1:1 |
| Celery + Redis jobs | BullMQ + Redis; job-status polling endpoint |
| S3 image storage (boto3) | AWS SDK for JavaScript |
| Results history | Sequelize model + migration |
| Django auth + Stripe subscriptions | Removed — marketplace JWT + monthly free-generation quota |
| Empty room (local YOLOv8 masking) | Phase 2: ship Stability-only object removal first; port YOLO via ONNX later if quality requires |

> **Cost note:** each generation spends Stability AI credits from the client's account. With remodeling free to users, the per-user quota is the mechanism that keeps this bill predictable — the quota number is the client's to set.

## 6. Timeline

| Weeks | Phase | Scope |
|---|---|---|
| Wk 1 | Foundation | New repo, design system, layout shell, auth wired to the existing backend. Backend: role field + RBAC guards. |
| Wk 2–3 | Core marketplace | Properties list/detail, home, buy/sell/rent wizards, user dashboard. Backend: request statuses + admin verification endpoints. **Milestone: browsable marketplace with working listing flows** |
| Wk 4–5 | Workflow & dashboards | Admin verification queue, publish gating, leads module, agent approval, agent + admin dashboards, notification emails. **Milestone: full listing-to-lead pipeline operating end to end** |
| Wk 5–6 | Remodel module | NestJS remodel module (4 features, jobs, quota) + frontend remodel flow and gallery. |
| Wk 7 | Growth features | Blog (admin editor + public pages), agent registration, insurance UI, marketing content pass, social/OG. |
| Wk 8 | Launch | SEO redirects (old routes + remodelhomes.ai), QA across roles, deploy, retire the old frontend and the RemodelHomes servers. **Milestone: Marketplace 2.0 live; one backend, one frontend** |

## 7. Decisions needed from the client

1. **Design direction** — existing Figma designs, a reference site to match, or design concepts produced for approval first? Keep the orange #ff5a3c brand or full rebrand?
2. **Lead exclusivity** — does a lead go to one agent exclusively, or can several agents receive the same property?
3. **Lead contact reveal** — do agents see the seller's contact details immediately on assignment, or only after accepting the lead?
4. **Free remodeling quota** — how many free generations per user per month? (Directly controls Stability AI spend.)
5. **Blog authoring** — simple admin form with rich text, or a fuller editorial experience? Who writes the posts?
6. **Notifications** — email is included throughout. Is SMS/WhatsApp expected anywhere (e.g. agent lead alerts)? That is added scope.

## 8. After the MVP — planned, not in this scope

Two features are on the roadmap for the release after MVP launch. They are recorded here so the MVP's architecture leaves room for them, but they are not part of the 8-week scope or estimate.

| Feature | What it is |
|---|---|
| Community feed | Users share news and informative real-estate posts. Property listings are **not allowed as posts** — every post passes an AI moderation check that blocks sale/buy/rent solicitations (listings belong in the marketplace, where they go through verification). Likely shape: posts with images, likes/comments, report flow, admin moderation queue behind the AI filter. |
| Vendor directory | Service professionals — electricians, plumbers, and similar trades — create vendor profiles with services offered and coverage areas. Users search for nearby technicians (zipcode/radius) and contact them through the platform, keeping the conversation on-site. Adds a fourth *Vendor* role and an in-platform contact/messaging mechanism. |

MVP groundwork that makes these cheap later: the role system extends to a Vendor role without rework; agents' zipcode-based service areas establish the location-matching pattern the vendor search reuses; and the AI-moderation pattern can also harden marketplace content over time.

## 9. Infrastructure — decided Sep 17, 2026

Deferred to the Marketplace 2.0 build rather than done twice. Today's backend runs on a t3.micro with pm2 and manual deploys, which caused most of the operational incidents so far (a `.env` that pm2 never loaded left the app reading a stale local Postgres for 12 days; unrotated logs filled the disk with 21 GB).

| Decision | Detail |
|---|---|
| **Platform** | **Coolify**, not Elastic Beanstalk. Already proven on the frontend, one paradigm for both apps, env vars managed in UI, container log rotation, git-push deploys, and Redis added as a managed service in a few clicks. Beanstalk adds an ALB (~$16/mo), slower deploys, and `.ebextensions` config for autoscaling we don't need. |
| **Instance size** | **t3.large / t4g.large** (~$61 / ~$49 per month). t3.medium is borderline once remodel lives in the same backend: Coolify ~1.5 GB + API ~0.4 + Redis ~0.3 + remodel worker ~0.4 + the HAR cron spike ~0.5 ≈ 3.1 GB steady, and a deploy build adds ~1.5 GB — over 4 GB. `t4g` (ARM) is ~20% cheaper; verify ARM builds first if ONNX/YOLO ever runs locally. |
| **Worker separation** | Remodel BullMQ workers run as a **separate Coolify service** (same repo, different start command), so a stuck image job can't degrade API latency and workers can move to their own instance later without re-architecting. |
| **Build server** | Coolify's "Use a Build Server?" option removes the ~1.5 GB build peak from the app host — the lever to pull if memory gets tight instead of resizing. |
| **HAR bulk import** | Stays on a **throwaway instance** (t3.small, 50 GB volume), never the app host. The 2-hourly incremental sync is fine on the main box once filtered by `ModificationTimestamp`. |
| **Elastic IP** | **Required.** HRIS authenticates the MLS feed by IP, so an instance restart currently breaks data ingestion. Also prevents the sslip.io/domain breakage seen previously. |

Also worth doing regardless of platform: **uptime monitoring** on the properties endpoint (the 12-day outage went unnoticed because nothing watched it), alerting when a HAR import run fails, and compiling the cron importer to JS instead of running it through `ts-node` (cuts its memory spike from ~500 MB to ~150 MB).

## 10. Risks & notes

- **Security reset built in.** The new frontend starts from a fresh repository, which also leaves behind the malware found in the old repo's git history; secrets are rotated at cutover and the retired RemodelHomes server is terminated.
- **SEO continuity.** Old marketplace URLs and remodelhomes.ai both need 301 maps at launch; blog and property pages are pre-rendered from day one.
- **Infrastructure additions.** One Redis container (job queue) and the `STABILITY_API_KEY` move into the marketplace deployment. Sizing and platform are settled in §9.
- **MLS display compliance.** The HRIS/HAR licence limits public display to Active and the three Pending statuses; Sold/Expired/Terminated (the VOW tier) may only appear behind a login. Every page showing MLS data must carry the attribution line `Data provided by HAR.com © Copyright <year> "All information provided should be independently verified."`, a DMCA agent must be designated, and MLS data must never be sent to third-party AI — which constrains the remodel module to user-uploaded photos only.
- **Empty-room quality.** The Stability-only approach ships first; if results underperform the current YOLO-masked pipeline, the ONNX port is a contained ~3-day follow-up.
- **Admin dashboard scope.** The back-office is the largest new surface; the estimate assumes functional, clean UI — not a bespoke design showcase.
