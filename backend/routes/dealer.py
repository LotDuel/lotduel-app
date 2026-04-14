"""
Dealer-facing API routes.
Handles invite token resolution and OTD quote submission.
These are public endpoints — no auth required (token is the auth).
"""

from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from models import db, DealerInvite, Offer
from scoring import score_offers

dealer_bp = Blueprint("dealer", __name__, url_prefix="/api")


@dealer_bp.route("/invites/<token>", methods=["GET"])
def get_invite(token):
    """Look up an invite by token. Returns what the buyer is looking for.

    This is called when a dealer clicks the invite link.
    Marks the invite as 'viewed' on first access.
    """
    invite = DealerInvite.query.filter_by(invite_token=token).first()
    if not invite:
        return jsonify({"error": "Invalid or expired invite link"}), 404

    vr = invite.vehicle_request

    # Check if request is still active
    if vr.status != "active":
        return jsonify({"error": "This vehicle request is no longer active"}), 410

    # Mark as viewed on first access
    if not invite.viewed_at:
        invite.viewed_at = datetime.now(timezone.utc)
        if invite.status == "pending":
            invite.status = "viewed"
        db.session.commit()

    # Check if already submitted
    if invite.status == "submitted":
        return jsonify({
            "error": "You have already submitted an offer for this request",
            "already_submitted": True,
        }), 409

    year_range = (
        f"{vr.year_min}–{vr.year_max}"
        if vr.year_min != vr.year_max
        else str(vr.year_min)
    )

    return jsonify({
        "invite_token": token,
        "dealer_name": invite.dealer.name if invite.dealer else None,
        "request": {
            "make": vr.make,
            "model": vr.model,
            "year_min": vr.year_min,
            "year_max": vr.year_max,
            "year_display": year_range,
            "mileage_max": vr.mileage_max,
            "zip_code": vr.zip_code,
            "radius_miles": vr.radius_miles,
            "notes": vr.notes,
        },
    })


@dealer_bp.route("/invites/<token>/submit", methods=["POST"])
def submit_offer(token):
    """Submit an OTD quote through a dealer invite.

    Required fields: year, trim, mileage, otd_price
    Optional fields: certified, extras, stock_number, vin, contact_name, notes
    """
    invite = DealerInvite.query.filter_by(invite_token=token).first()
    if not invite:
        return jsonify({"error": "Invalid or expired invite link"}), 404

    vr = invite.vehicle_request

    if vr.status != "active":
        return jsonify({"error": "This vehicle request is no longer active"}), 410

    if invite.status == "submitted":
        return jsonify({"error": "An offer has already been submitted on this invite"}), 409

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    # Validate required fields
    errors = {}
    if not data.get("year"):
        errors["year"] = "Year is required"
    if not data.get("trim"):
        errors["trim"] = "Trim is required"
    if not data.get("mileage") and data.get("mileage") != 0:
        errors["mileage"] = "Mileage is required"
    if not data.get("otd_price") and data.get("otd_price") != 0:
        errors["otd_price"] = "OTD price is required"

    # Type validation
    try:
        year = int(data["year"])
        if year < vr.year_min or year > vr.year_max + 1:
            errors["year"] = f"Year must be between {vr.year_min} and {vr.year_max}"
    except (ValueError, TypeError, KeyError):
        errors["year"] = "Valid year required"

    try:
        mileage = int(data.get("mileage", 0))
        if mileage < 0:
            errors["mileage"] = "Mileage cannot be negative"
    except (ValueError, TypeError):
        errors["mileage"] = "Valid mileage required"

    try:
        otd_price = int(data.get("otd_price", 0))
        if otd_price <= 0:
            errors["otd_price"] = "OTD price must be greater than zero"
    except (ValueError, TypeError):
        errors["otd_price"] = "Valid OTD price required"

    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 422

    # Create the offer
    offer = Offer(
        vehicle_request_id=vr.id,
        dealer_invite_id=invite.id,
        dealer_id=invite.dealer_id,
        year=int(data["year"]),
        make=vr.make,
        model=vr.model,
        trim=data["trim"],
        mileage=int(data["mileage"]),
        otd_price=int(data["otd_price"]),
        certified=data.get("certified", False),
        extras=data.get("extras", ""),
        stock_number=data.get("stock_number", ""),
        vin=data.get("vin", ""),
        contact_name=data.get("contact_name", ""),
        notes=data.get("notes", ""),
    )
    db.session.add(offer)

    # Update invite status
    invite.status = "submitted"
    invite.submitted_at = datetime.now(timezone.utc)

    db.session.commit()

    # Score all offers for this request
    all_offers = Offer.query.filter_by(vehicle_request_id=vr.id).all()
    score_offers(all_offers, vr)
    db.session.commit()

    return jsonify({
        "message": "Offer submitted successfully",
        "offer": offer.to_dict(),
    }), 201
