"""
Buyer-facing API routes.
Handles vehicle requests, dealer invites, offer viewing, and email generation.
"""

import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, current_app
from models import db, User, VehicleRequest, Dealer, DealerInvite, Offer
from scoring import score_offers
from market import fetch_market_data

buyer_bp = Blueprint("buyer", __name__, url_prefix="/api")


# ── Users ──────────────────────────────────────────────────────────────────────


@buyer_bp.route("/users", methods=["POST"])
def create_user():
    """Create or retrieve a user by email (simple auth for MVP)."""
    data = request.get_json()
    if not data or not data.get("email") or not data.get("name"):
        return jsonify({"error": "name and email required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify(user.to_dict()), 200

    user = User(name=data["name"], email=data["email"])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@buyer_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())


# ── Vehicle Requests ───────────────────────────────────────────────────────────


@buyer_bp.route("/requests", methods=["POST"])
def create_request():
    """Create a new vehicle request. Auto-fetches market data from MarketCheck."""
    data = request.get_json()
    required = ["user_id", "make", "model", "year_min", "year_max", "mileage_max", "zip_code"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    vr = VehicleRequest(
        user_id=data["user_id"],
        make=data["make"],
        model=data["model"],
        year_min=data["year_min"],
        year_max=data["year_max"],
        trim_targets=json.dumps(data.get("trim_targets", ["LE", "XLE", "SE"])),
        mileage_max=data["mileage_max"],
        zip_code=data["zip_code"],
        radius_miles=data.get("radius_miles", 50),
        market_value=data.get("market_value"),
        notes=data.get("notes"),
    )
    db.session.add(vr)
    db.session.flush()

    # Auto-fetch market data if no manual value provided
    if not vr.market_value:
        _fetch_and_store_market_data(vr)

    db.session.commit()
    return jsonify(vr.to_dict(include_stats=True, include_market=True)), 201


@buyer_bp.route("/requests/<int:request_id>", methods=["GET"])
def get_request(request_id):
    """Get vehicle request details."""
    vr = VehicleRequest.query.get_or_404(request_id)
    return jsonify(vr.to_dict(include_stats=True))


@buyer_bp.route("/requests/<int:request_id>", methods=["PATCH"])
def update_request(request_id):
    """Update vehicle request (e.g., set market_value, change status)."""
    vr = VehicleRequest.query.get_or_404(request_id)
    data = request.get_json()

    updatable = [
        "market_value", "notes", "status", "mileage_max",
        "radius_miles", "trim_targets",
    ]
    for field in updatable:
        if field in data:
            if field == "trim_targets" and isinstance(data[field], list):
                setattr(vr, field, json.dumps(data[field]))
            else:
                setattr(vr, field, data[field])

    db.session.commit()
    return jsonify(vr.to_dict(include_stats=True))


@buyer_bp.route("/requests/<int:request_id>/market", methods=["GET"])
def get_market_data(request_id):
    """Get market valuation data for a vehicle request."""
    vr = VehicleRequest.query.get_or_404(request_id)
    return jsonify(vr.to_dict(include_market=True))


@buyer_bp.route("/requests/<int:request_id>/market", methods=["POST"])
def refresh_market_data(request_id):
    """Refresh market data from MarketCheck API."""
    vr = VehicleRequest.query.get_or_404(request_id)
    result = _fetch_and_store_market_data(vr)
    db.session.commit()

    if result:
        return jsonify({
            "message": f"Market data updated — {result['num_listings']} comparable listings found",
            "market_value": vr.market_value,
            "market": result,
        })
    else:
        return jsonify({
            "error": "Could not fetch market data. Check API key or try again.",
            "market_value": vr.market_value,
        }), 502


def _fetch_and_store_market_data(vr):
    """Fetch market data from MarketCheck and store on the vehicle request."""
    api_key = current_app.config.get("MARKETCHECK_API_KEY")
    if not api_key:
        return None

    result = fetch_market_data(
        api_key=api_key,
        make=vr.make,
        model=vr.model,
        year_min=vr.year_min,
        year_max=vr.year_max,
        mileage_max=vr.mileage_max,
        zip_code=vr.zip_code,
        radius_miles=vr.radius_miles,
    )

    if result and result.get("market_value"):
        vr.market_value = result["market_value"]
        vr.market_source = "marketcheck"
        vr.market_data = json.dumps(result)
    elif result:
        # Got a response but no listings found
        vr.market_data = json.dumps(result)
        vr.market_source = "marketcheck"

    return result


@buyer_bp.route("/users/<int:user_id>/requests", methods=["GET"])
def list_user_requests(user_id):
    """List all vehicle requests for a user."""
    User.query.get_or_404(user_id)
    requests = VehicleRequest.query.filter_by(user_id=user_id).order_by(
        VehicleRequest.created_at.desc()
    ).all()
    return jsonify([r.to_dict(include_stats=True) for r in requests])


# ── Dealer Invites ─────────────────────────────────────────────────────────────


@buyer_bp.route("/requests/<int:request_id>/invites", methods=["POST"])
def create_invite(request_id):
    """Generate a dealer invite token. Creates dealer record if needed."""
    vr = VehicleRequest.query.get_or_404(request_id)
    data = request.get_json()

    if not data.get("dealer_name"):
        return jsonify({"error": "dealer_name required"}), 400

    # Find or create dealer
    dealer = None
    if data.get("dealer_email"):
        dealer = Dealer.query.filter_by(email=data["dealer_email"]).first()

    if not dealer:
        dealer = Dealer(
            name=data["dealer_name"],
            email=data.get("dealer_email"),
            phone=data.get("dealer_phone"),
            website=data.get("dealer_website"),
            city=data.get("dealer_city"),
            state=data.get("dealer_state"),
            zip_code=data.get("dealer_zip"),
        )
        db.session.add(dealer)
        db.session.flush()

    # Check for duplicate invite
    existing = DealerInvite.query.filter_by(
        vehicle_request_id=request_id, dealer_id=dealer.id
    ).first()
    if existing:
        return jsonify({
            "error": "Invite already exists for this dealer",
            "invite": existing.to_dict(),
            "invite_url": existing.invite_url,
        }), 409

    # Create invite
    invite = DealerInvite(
        vehicle_request_id=request_id,
        dealer_id=dealer.id,
    )
    db.session.add(invite)
    db.session.commit()

    result = invite.to_dict()
    result["invite_url"] = invite.invite_url

    # Generate email content
    buyer_name = vr.user.name.split()[0] if vr.user else "A buyer"
    year_range = f"{vr.year_min}–{vr.year_max}" if vr.year_min != vr.year_max else str(vr.year_min)

    result["email_subject"] = f"Ready Buyer – Requesting OTD Quote ({vr.make} {vr.model})"
    result["email_body"] = (
        f"Hi {dealer.name},\n\n"
        f"I'm planning to purchase a {year_range} {vr.make} {vr.model} "
        f"within the next few days and am collecting out-the-door (OTD) quotes "
        f"from local dealerships.\n\n"
        f"If you're interested, you can submit your best offer here:\n"
        f"👉 {invite.invite_url}\n\n"
        f"I'm ready to move forward quickly with the most competitive offer.\n\n"
        f"Thanks,\n{buyer_name}"
    )

    return jsonify(result), 201


@buyer_bp.route("/requests/<int:request_id>/invites", methods=["GET"])
def list_invites(request_id):
    """List all dealer invites for a vehicle request."""
    VehicleRequest.query.get_or_404(request_id)
    invites = DealerInvite.query.filter_by(
        vehicle_request_id=request_id
    ).order_by(DealerInvite.created_at.desc()).all()

    results = []
    for inv in invites:
        d = inv.to_dict()
        d["invite_url"] = inv.invite_url
        results.append(d)
    return jsonify(results)


# ── Offers ─────────────────────────────────────────────────────────────────────


@buyer_bp.route("/requests/<int:request_id>/offers", methods=["GET"])
def list_offers(request_id):
    """Get all scored and ranked offers for a vehicle request."""
    vr = VehicleRequest.query.get_or_404(request_id)
    offers = Offer.query.filter_by(vehicle_request_id=request_id).all()

    if not offers:
        return jsonify([])

    # Re-score and rank
    ranked = score_offers(offers, vr)
    db.session.commit()

    return jsonify([o.to_dict() for o in ranked])


@buyer_bp.route("/offers/<int:offer_id>", methods=["GET"])
def get_offer(offer_id):
    """Get a single offer with full detail."""
    offer = Offer.query.get_or_404(offer_id)
    return jsonify(offer.to_dict())


@buyer_bp.route("/requests/<int:request_id>/recalculate", methods=["POST"])
def recalculate(request_id):
    """Force recalculation of all offer scores and rankings."""
    vr = VehicleRequest.query.get_or_404(request_id)
    offers = Offer.query.filter_by(vehicle_request_id=request_id).all()

    if not offers:
        return jsonify({"message": "No offers to recalculate"}), 200

    ranked = score_offers(offers, vr)
    db.session.commit()

    return jsonify({
        "message": f"Recalculated {len(ranked)} offers",
        "offers": [o.to_dict() for o in ranked],
    })


# ── Dashboard Summary ──────────────────────────────────────────────────────────


@buyer_bp.route("/requests/<int:request_id>/dashboard", methods=["GET"])
def dashboard(request_id):
    """Get full dashboard data: request info, offers, stats."""
    vr = VehicleRequest.query.get_or_404(request_id)
    offers = Offer.query.filter_by(vehicle_request_id=request_id).all()

    if offers:
        ranked = score_offers(offers, vr)
        db.session.commit()
    else:
        ranked = []

    # Compute leverage stats
    market_value = vr.market_value or 28500
    prices = [o.otd_price for o in ranked]
    avg_price = round(sum(prices) / len(prices)) if prices else 0
    best_price = min(prices) if prices else 0
    savings = market_value - best_price if prices else 0

    invite_count = DealerInvite.query.filter_by(vehicle_request_id=request_id).count()

    return jsonify({
        "request": vr.to_dict(include_market=True),
        "offers": [o.to_dict() for o in ranked],
        "stats": {
            "invite_count": invite_count,
            "offer_count": len(ranked),
            "market_value": market_value,
            "market_source": vr.market_source,
            "avg_price": avg_price,
            "best_price": best_price,
            "savings": savings,
        },
    })
