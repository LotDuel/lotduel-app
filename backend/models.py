import uuid
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def generate_token():
    """Generate a URL-safe invite token."""
    return uuid.uuid4().hex[:16]


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    vehicle_requests = db.relationship(
        "VehicleRequest", backref="user", lazy="dynamic"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }


class VehicleRequest(db.Model):
    __tablename__ = "vehicle_requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(80), nullable=False)
    year_min = db.Column(db.Integer, nullable=False)
    year_max = db.Column(db.Integer, nullable=False)
    trim_targets = db.Column(db.Text, default="[]")  # JSON array of target trims
    mileage_max = db.Column(db.Integer, nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    radius_miles = db.Column(db.Integer, default=50)
    market_value = db.Column(db.Integer, nullable=True)  # Manual entry for now
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default="active")  # active, closed, expired
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    invites = db.relationship("DealerInvite", backref="vehicle_request", lazy="dynamic")
    offers = db.relationship("Offer", backref="vehicle_request", lazy="dynamic")

    def to_dict(self, include_stats=False):
        d = {
            "id": self.id,
            "user_id": self.user_id,
            "make": self.make,
            "model": self.model,
            "year_min": self.year_min,
            "year_max": self.year_max,
            "trim_targets": self.trim_targets,
            "mileage_max": self.mileage_max,
            "zip_code": self.zip_code,
            "radius_miles": self.radius_miles,
            "market_value": self.market_value,
            "notes": self.notes,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
        if include_stats:
            d["invite_count"] = self.invites.count()
            d["offer_count"] = self.offers.count()
        return d


class Dealer(db.Model):
    __tablename__ = "dealers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    website = db.Column(db.String(500), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    state = db.Column(db.String(2), nullable=True)
    zip_code = db.Column(db.String(10), nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    invites = db.relationship("DealerInvite", backref="dealer", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "state": self.state,
            "email": self.email,
            "phone": self.phone,
            "website": self.website,
        }


class DealerInvite(db.Model):
    __tablename__ = "dealer_invites"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_request_id = db.Column(
        db.Integer, db.ForeignKey("vehicle_requests.id"), nullable=False
    )
    dealer_id = db.Column(db.Integer, db.ForeignKey("dealers.id"), nullable=False)
    invite_token = db.Column(
        db.String(32), unique=True, nullable=False, default=generate_token
    )
    email_subject = db.Column(db.Text, nullable=True)
    email_body = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20), default="pending"
    )  # pending, viewed, submitted, expired
    sent_at = db.Column(db.DateTime, nullable=True)
    viewed_at = db.Column(db.DateTime, nullable=True)
    submitted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    offer = db.relationship("Offer", backref="invite", uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_request_id": self.vehicle_request_id,
            "dealer_id": self.dealer_id,
            "dealer": self.dealer.to_dict() if self.dealer else None,
            "invite_token": self.invite_token,
            "status": self.status,
            "sent_at": self.sent_at.isoformat() if self.sent_at else None,
            "viewed_at": self.viewed_at.isoformat() if self.viewed_at else None,
            "submitted_at": self.submitted_at.isoformat()
            if self.submitted_at
            else None,
        }

    @property
    def invite_url(self):
        """Generate the full invite URL for the dealer form."""
        from flask import current_app

        frontend = current_app.config.get("FRONTEND_URL", "https://lotduel.com")
        return f"{frontend}/submit/{self.invite_token}"


class Offer(db.Model):
    __tablename__ = "offers"

    id = db.Column(db.Integer, primary_key=True)
    vehicle_request_id = db.Column(
        db.Integer, db.ForeignKey("vehicle_requests.id"), nullable=False
    )
    dealer_invite_id = db.Column(
        db.Integer, db.ForeignKey("dealer_invites.id"), nullable=False
    )
    dealer_id = db.Column(db.Integer, db.ForeignKey("dealers.id"), nullable=False)

    # Vehicle details
    year = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(50), nullable=False, default="Toyota")
    model = db.Column(db.String(80), nullable=False, default="RAV4 Hybrid")
    trim = db.Column(db.String(50), nullable=False)
    mileage = db.Column(db.Integer, nullable=False)
    otd_price = db.Column(db.Integer, nullable=False)
    certified = db.Column(db.Boolean, default=False)
    extras = db.Column(db.Text, nullable=True)
    stock_number = db.Column(db.String(50), nullable=True)
    vin = db.Column(db.String(17), nullable=True)
    contact_name = db.Column(db.String(120), nullable=True)
    notes = db.Column(db.Text, nullable=True)

    # Scoring (calculated)
    total_score = db.Column(db.Float, nullable=True)
    price_score = db.Column(db.Float, nullable=True)
    market_score = db.Column(db.Float, nullable=True)
    mileage_score = db.Column(db.Float, nullable=True)
    trim_score = db.Column(db.Float, nullable=True)
    cert_score = db.Column(db.Float, nullable=True)
    rank = db.Column(db.Integer, nullable=True)
    label = db.Column(db.String(20), nullable=True)

    submitted_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    dealer_ref = db.relationship("Dealer", backref="offers")

    def to_dict(self):
        return {
            "id": self.id,
            "vehicle_request_id": self.vehicle_request_id,
            "dealer_id": self.dealer_id,
            "dealer": self.dealer_ref.name if self.dealer_ref else None,
            "city": self.dealer_ref.city if self.dealer_ref else None,
            "year": self.year,
            "make": self.make,
            "model": self.model,
            "trim": self.trim,
            "mileage": self.mileage,
            "otd": self.otd_price,
            "certified": self.certified,
            "extras": self.extras,
            "stock_number": self.stock_number,
            "vin": self.vin,
            "contact_name": self.contact_name,
            "notes": self.notes,
            "total_score": self.total_score,
            "price_score": self.price_score,
            "market_score": self.market_score,
            "mileage_score": self.mileage_score,
            "trim_score": self.trim_score,
            "cert_score": self.cert_score,
            "rank": self.rank,
            "label": self.label,
            "submitted_at": self.submitted_at.isoformat(),
        }
