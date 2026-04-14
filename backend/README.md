# LotDuel Backend API

Flask API for the LotDuel car buyer leverage tool.

## Quick Start (Development)

```bash
cd backend
pip install -r requirements.txt
python seed.py    # creates SQLite DB with sample data
python app.py     # starts dev server on :5000
```

## API Endpoints

### Health
- `GET /api/health` — service status

### Buyer
- `POST /api/users` — create/retrieve user by email
- `POST /api/requests` — create vehicle request
- `GET /api/requests/:id` — get request details
- `PATCH /api/requests/:id` — update request (market_value, status)
- `POST /api/requests/:id/invites` — generate dealer invite token + email
- `GET /api/requests/:id/invites` — list all invites
- `GET /api/requests/:id/offers` — get scored/ranked offers
- `GET /api/requests/:id/dashboard` — full dashboard data
- `POST /api/requests/:id/recalculate` — force re-score all offers

### Dealer (public, token-authenticated)
- `GET /api/invites/:token` — look up invite, see what buyer wants
- `POST /api/invites/:token/submit` — submit OTD quote

## Production Deployment

```bash
# On Hostinger VPS:
export DATABASE_URL=postgresql://lotduel:pass@localhost:5432/lotduel
export FLASK_ENV=production
export SECRET_KEY=<random-string>
export FRONTEND_URL=https://lotduel.com
gunicorn wsgi:app -b 0.0.0.0:5000
```

## Database

- **Dev:** SQLite (auto-created at `backend/lotduel_dev.db`)
- **Prod:** PostgreSQL on Hostinger VPS
- Schema reference: `schema.sql`
- ORM: SQLAlchemy with Flask-Migrate
