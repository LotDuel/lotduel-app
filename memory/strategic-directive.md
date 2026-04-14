# LotDuel — Strategic Directive
## Last updated: April 14, 2026

---

## Core Concept

LotDuel is a car buyer leverage tool. It makes multiple dealers compete for a buyer's business by submitting OTD quotes through a structured form. The buyer sees all offers ranked and walks into the best deal fully informed.

**One-liner:** "Make dealerships compete for your deal."

---

## Product Principles

1. **LotDuel is a leverage tool, not a marketplace.** Dealers don't know they're "competing" — they just see a serious buyer asking for a quote.
2. **The buyer controls everything.** LotDuel never acts as middleman. The buyer sends emails, chooses winners, makes decisions.
3. **Never send bulk email from lotduel.com.** The buyer sends from their own Gmail/Outlook. Zero spam risk. Higher response rates.
4. **Never compromise ranking integrity for monetization.** Scoring is pure math. No pay-to-play.
5. **Dealer-facing tone: professional and respectful.** Never "you're in a gladiator arena."
6. **Buyer-facing tone: confident and strategic.** "You're in control."

---

## Competitive Wedge

Previous attempts (CarWoo, etc.) failed because they:
1. Made dealers feel like commodities in a race-to-the-bottom
2. Became lead-gen spam platforms
3. Charged dealers per-lead or subscription
4. Removed buyer control by acting as middlemen

LotDuel avoids all four. The buyer controls the process. Dealers see a real person, not a platform.

---

## Roadmap

### Phase 1 — DONE ✅
Landing page, demo, scoring engine, GitHub + Vercel deployment

### Phase 2 — DONE ✅
Flask API, PostgreSQL, dealer invite tokens, offer submission, real-time ranking, email generator, MarketCheck integration, admin webhook

### Phase 3 — Intelligence Layer (next after user validation)
- Claude API for offer analysis and counter-offer drafting
- Auto-lookup fair pricing by year/trim/mileage
- Dealer invite tracking (viewed, submitted, ignored)
- Follow-up reminder system

### Phase 4 — Full AI Agent
- User types "I want a 2022-2023 RAV4 Hybrid near Lake Stevens"
- Agent researches pricing, finds dealers, generates emails
- Optional Gmail OAuth to send on buyer's behalf
- Monitors responses, parses email replies
- Full autonomous car buying assistant

---

## Monetization (planned)

- **Free tier:** 3 dealer invites, basic dashboard
- **Duel Pass ($29):** 15 dealers, full ranking, market comparison, leverage tools
- **Elite ($49):** Counter-offer automation, export/PDF, negotiation scripts
- **Paywall trigger:** After buyer receives 2–3 offers and sees value

---

## First 100 Users Strategy

1. Reddit outreach: r/askcarsales, r/carbuying, r/whatcarshouldIbuy
2. Facebook groups: Seattle/WA car buyer groups
3. Manual onboarding for first 10–20 users
4. Capture win stories → screenshots → marketing fuel

---

## Project Separation Rules

- LotDuel is COMPLETELY SEPARATE from OneWayBIT and DripBuild
- Each has its own GitHub org, repo, domain, branding
- Never cross-reference code, content, or branding between projects
- **Owner:** WiseCorp LLC (Rob), Washington State
