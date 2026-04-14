"""
LotDuel Scoring Engine
Mirrors the frontend scoring logic in data/scoring.js

Weights:
  - OTD Price:      55%
  - Market Diff:    20%
  - Mileage:        10%
  - Trim Match:     10%
  - Certification:   5%

Labels:
  - 85+  = Best Deal (green)
  - 72-84 = Competitive (yellow)
  - <72  = Overpriced (red)
"""

import json


def score_offers(offers, vehicle_request):
    """Score and rank all offers for a vehicle request.

    Args:
        offers: list of Offer model instances
        vehicle_request: VehicleRequest model instance

    Returns:
        list of offers with scores and ranks populated
    """
    if not offers:
        return []

    market_value = vehicle_request.market_value or 28500  # fallback
    trim_targets = _parse_trims(vehicle_request.trim_targets)

    # Gather values for relative scoring
    prices = [o.otd_price for o in offers]
    mileages = [o.mileage for o in offers]
    lowest_price = min(prices)
    max_mileage = max(mileages) if max(mileages) > 0 else 1

    for offer in offers:
        # Price score: lowest price gets 100
        offer.price_score = round((lowest_price / offer.otd_price) * 100, 2)

        # Market score: below market = good, above = bad
        market_diff = market_value - offer.otd_price
        raw_market = 50 + (market_diff / market_value) * 200
        offer.market_score = round(max(0, min(100, raw_market)), 2)

        # Mileage score: lower is better
        offer.mileage_score = round(
            ((max_mileage - offer.mileage) / max_mileage) * 100, 2
        )

        # Trim match score
        offer.trim_score = _trim_score(offer.trim, trim_targets)

        # Certification score
        offer.cert_score = 100.0 if offer.certified else 60.0

        # Weighted total
        offer.total_score = round(
            offer.price_score * 0.55
            + offer.market_score * 0.20
            + offer.mileage_score * 0.10
            + offer.trim_score * 0.10
            + offer.cert_score * 0.05,
        )

        # Label
        offer.label = _get_label(offer.total_score)

    # Rank by total score descending
    ranked = sorted(offers, key=lambda o: o.total_score, reverse=True)
    for i, offer in enumerate(ranked):
        offer.rank = i + 1

    return ranked


def _parse_trims(trim_json):
    """Parse trim targets from JSON string."""
    if not trim_json:
        return ["LE", "XLE", "SE"]
    try:
        trims = json.loads(trim_json)
        return trims if isinstance(trims, list) and trims else ["LE", "XLE", "SE"]
    except (json.JSONDecodeError, TypeError):
        return ["LE", "XLE", "SE"]


def _trim_score(offer_trim, targets):
    """Score how well the offer trim matches buyer's target trims."""
    if offer_trim in targets:
        return 100.0

    # Acceptable alternatives (close enough)
    acceptable = {
        "XLE Premium": ["XLE"],
        "XLE": ["XLE Premium"],
        "SE": ["XSE"],
        "XSE": ["SE"],
    }
    alts = acceptable.get(offer_trim, [])
    if any(t in targets for t in alts):
        return 70.0

    return 30.0


def _get_label(score):
    """Get deal quality label from score."""
    if score >= 85:
        return "Best Deal"
    if score >= 72:
        return "Competitive"
    return "Overpriced"
