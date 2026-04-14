# LotDuel

**Make dealerships compete for your deal.**

Car buyer leverage tool — send one request, get multiple OTD quotes from local dealers, compare side-by-side, walk in with leverage.

## Stack

- **Frontend:** Vite + React
- **Hosting:** Vercel
- **Backend (planned):** Python/Flask + PostgreSQL

## Project Structure

```
src/
├── App.jsx                    # Main app with view routing
├── main.jsx                   # React entry point
├── styles.css                 # Global styles + animations
├── data/
│   └── scoring.js             # Sample data, scoring logic, utilities
└── components/
    ├── Logo.jsx               # LotDuel logo component
    ├── LandingPage.jsx        # Marketing landing page
    ├── Dashboard.jsx          # Buyer offer comparison dashboard
    └── DealerForm.jsx         # Dealer quote submission form
```

## Development

```bash
npm install
npm run dev
```

## Deploy

Connected to Vercel — pushes to `main` auto-deploy.

## Roadmap

- **v1 (current):** Landing page + interactive demo with sample data
- **v2:** Backend API, real dealer submissions, invite token system
- **v3:** Ranking engine, market valuation integration, email templates
- **v4:** Counter-offer mode, dealer tracking, SaaS onboarding

---

Part of the WiseCorp LLC project portfolio.
Domain: lotduel.com | Registered April 2026
