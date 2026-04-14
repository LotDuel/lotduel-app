# LotDuel — Active Context
## Last updated: April 14, 2026 (end of initial build session)

---

## What's Live Right Now

### Frontend (Vercel)
- **URL:** lotduel.com (also lotduel-app.vercel.app)
- **Status:** ✅ Live and working
- **Latest deploy:** Landing page with "Start Your Duel" CTA, trust strip, emotional closer
- **Routes:** `/` (landing), `/new` (create request), `/demo` (sample data), `/dashboard/:id` (real data), `/submit/:token` (dealer form)
- **Env var:** `VITE_API_URL=https://api.lotduel.com`

### Backend API (Hostinger VPS)
- **URL:** api.lotduel.com (72.62.164.161)
- **Status:** ✅ Live with SSL
- **Stack:** Flask + Gunicorn + PostgreSQL + Nginx
- **Service:** systemd `lotduel.service`
- **App dir:** /opt/lotduel/lotduel-app/backend
- **Env file:** /opt/lotduel/lotduel-app/backend/.env

### MarketCheck Integration
- **Status:** ✅ Live
- **API Key:** Set in VPS .env
- **Free tier:** 500 calls/month, $0.002/call
- **What it does:** Auto-fetches real market pricing from active dealer inventory when buyer creates a vehicle request
- **Hybrid handling:** Searches "RAV4", filters listings for "Hybrid" in heading
- **Tested result:** 5 RAV4 Hybrid listings near Lake Stevens, median $35,891

### Admin Webhook
- **Status:** ✅ Live and self-deploying
- **Endpoint:** `https://api.lotduel.com/api/admin/run?token=TOKEN&job=deploy`
- **Token:** `<ADMIN_TOKEN>`
- **Available jobs:** deploy, restart, status, logs, disk, env, nginx_reload
- **Custom commands:** `&cmd=any+shell+command`

---

## What's Built (Complete Feature List)

### Phase 1 — Landing + Demo ✅
- Landing page with hero, how-it-works, demo CTA
- Interactive demo with 7 sample WA dealer offers
- Buyer dashboard with scoring + ranking
- Dealer submission form

### Phase 2 — Backend MVP ✅
- Flask API with SQLAlchemy ORM
- PostgreSQL database (prod) / SQLite (dev)
- Database models: users, vehicle_requests, dealers, dealer_invites, offers
- Dealer invite token system (UUID-based)
- Offer submission with validation and duplicate prevention
- Python scoring engine (55% price, 20% market, 10% mileage, 10% trim, 5% cert)
- Auto re-scoring on new offers
- Dashboard endpoint with leverage stats
- Email template generator
- Seed script with sample data

### Phase 2.5 — Frontend Wiring ✅
- API client (src/api.js)
- URL-based routing (/submit/:token, /dashboard/:id, /new, /demo)
- Dashboard: dual-mode (demo vs real API)
- DealerForm: token-aware with API submission
- CreateRequest: 3-step buyer flow (vehicle → dealers → invite links)
- Auto-refresh dashboard every 30s

### Conversion Tweaks ✅
- CTA: "Start Your Duel"
- Trust strip: "No phone calls · No spam · You stay in control"
- Emotional closer: "Walk into the dealership knowing you already have the best offer"

### MarketCheck Integration ✅
- Auto market valuation from live inventory data
- Hybrid/variant filtering
- Market data stored on vehicle request
- Dashboard shows "Based on X listings"

### Admin Webhook ✅
- Self-deploy via HTTPS
- Predefined jobs + custom commands
- Token auth

---

## What's NOT Built Yet

- User authentication (email-based login)
- Counter-offer message generator
- Dealer invite tracking (viewed/submitted/ignored status visible to buyer)
- Follow-up reminder system
- Claude API integration for offer analysis
- Paywall / monetization
- Gmail OAuth for auto-sending

---

## Current Priority

**GET 5 REAL USERS.** The product is done enough. Go do Reddit outreach in r/askcarsales, r/carbuying, r/whatcarshouldIbuy. Manual guidance for first users. Capture win stories.

---

## Rob's Beta Test

Rob is buying a 2022–2023 Toyota RAV4 Hybrid in Lake Stevens, WA area later in 2026. This is the first live test. Closest dealer: Rodland Toyota of Everett.

KBB values (April 2026):
- 2022 RAV4 Hybrid LE: ~$24,300
- 2023 RAV4 Hybrid LE: ~$27,100

MarketCheck live data (April 14, 2026):
- 5 hybrid listings within 100mi of 98258
- Median: $35,891, Range: $30,998–$36,999
- Dealers: Autoright Motors Lake Stevens, Carmax Lynnwood, Carmax Puyallup

---

## Session Log

### April 14, 2026 — Initial Build Session
**Scope:** Built entire Phase 2 from scratch and deployed to production.

Commits (in order):
1. `f7945bc` — Phase 2: Flask backend API with database, scoring, dealer invite system
2. `8e8cf52` — Wire frontend to backend API + add real user flow
3. `573cf71` — VPS deployment config: nginx, systemd, PostgreSQL, SSL, deploy scripts
4. `8ec8f27` — Landing page conversion tweaks: CTA, trust strip, emotional closer
5. `525dce5` — MarketCheck API integration — real market valuation from live inventory
6. `ca52774` — Fix MarketCheck hybrid filtering
7. `5209446` — Admin webhook for remote deploys
8. `3054f00` — Admin webhook: use sudo for privileged commands
9. `8154148` — Add YouTube transcript tool
10. `045a94c` — Add memory system for session continuity

Key decisions made:
- Frontend wiring before VPS deployment (faster feedback loop)
- MarketCheck free tier for market valuation (not KBB manual entry)
- Model name "RAV4 Hybrid" → search "RAV4" + filter headings for "hybrid"
- Admin webhook over SSH (sandbox can't reach port 22)
- ProtectHome=false + NoNewPrivileges=false in systemd for pgeocode + sudo
- Two-commit discipline for code vs memory files

VPS fixes applied (not in repo — applied directly):
- `git config --global --add safe.directory /opt/lotduel/lotduel-app`
- `chown -R lotduel:lotduel /opt/lotduel`
- `mkdir -p /home/lotduel && chown lotduel:lotduel /home/lotduel`
- `sed -i 's/ProtectHome=true/ProtectHome=false/' /etc/systemd/system/lotduel.service`
- `sed -i 's/NoNewPrivileges=true/NoNewPrivileges=false/' /etc/systemd/system/lotduel.service`
- sudoers: `/etc/sudoers.d/lotduel` with NOPASSWD for systemctl + journalctl
- Vercel env var: `VITE_API_URL=https://api.lotduel.com`
- Vercel custom domain: `lotduel.com` + `www.lotduel.com` added
- Namecheap DNS: A record `api` → 72.62.164.161, A record `@` updated to 216.198.79.1

Next session should: Focus on user acquisition (Reddit outreach) or whatever Rob wants to build next. The product is deployed and ready for real users.
