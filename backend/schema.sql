-- ════════════════════════════════════════════════════════════════
-- LotDuel Database Schema (PostgreSQL)
-- Reference only — tables are created via Flask-Migrate / SQLAlchemy
-- ════════════════════════════════════════════════════════════════

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE vehicle_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    make VARCHAR(50) NOT NULL,
    model VARCHAR(80) NOT NULL,
    year_min INTEGER NOT NULL,
    year_max INTEGER NOT NULL,
    trim_targets TEXT DEFAULT '[]',
    mileage_max INTEGER NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    radius_miles INTEGER DEFAULT 50,
    market_value INTEGER,
    market_source VARCHAR(20),
    market_data TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE dealers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    website VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE dealer_invites (
    id SERIAL PRIMARY KEY,
    vehicle_request_id INTEGER NOT NULL REFERENCES vehicle_requests(id),
    dealer_id INTEGER NOT NULL REFERENCES dealers(id),
    invite_token VARCHAR(32) UNIQUE NOT NULL,
    email_subject TEXT,
    email_body TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    viewed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    vehicle_request_id INTEGER NOT NULL REFERENCES vehicle_requests(id),
    dealer_invite_id INTEGER NOT NULL REFERENCES dealer_invites(id),
    dealer_id INTEGER NOT NULL REFERENCES dealers(id),
    year INTEGER NOT NULL,
    make VARCHAR(50) NOT NULL DEFAULT 'Toyota',
    model VARCHAR(80) NOT NULL DEFAULT 'RAV4 Hybrid',
    trim VARCHAR(50) NOT NULL,
    mileage INTEGER NOT NULL,
    otd_price INTEGER NOT NULL,
    certified BOOLEAN DEFAULT FALSE,
    extras TEXT,
    stock_number VARCHAR(50),
    vin VARCHAR(17),
    contact_name VARCHAR(120),
    notes TEXT,
    total_score FLOAT,
    price_score FLOAT,
    market_score FLOAT,
    mileage_score FLOAT,
    trim_score FLOAT,
    cert_score FLOAT,
    rank INTEGER,
    label VARCHAR(20),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_vehicle_requests_user ON vehicle_requests(user_id);
CREATE INDEX idx_dealer_invites_token ON dealer_invites(invite_token);
CREATE INDEX idx_dealer_invites_request ON dealer_invites(vehicle_request_id);
CREATE INDEX idx_offers_request ON offers(vehicle_request_id);
CREATE INDEX idx_offers_dealer ON offers(dealer_id);
