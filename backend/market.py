"""
MarketCheck API Client
Fetches real inventory data to determine fair market value.

Uses the Inventory Search API ($0.002/call) to find comparable
vehicles and compute market pricing benchmarks.

Free tier: 500 calls/month, 100-mile radius limit.
"""

import logging
import requests
import pgeocode

logger = logging.getLogger(__name__)

MARKETCHECK_BASE = "https://api.marketcheck.com/v2"

# Zip code geocoder (offline, instant)
_nomi = pgeocode.Nominatim("us")


def zip_to_coords(zip_code):
    """Convert US zip code to lat/lng coordinates."""
    result = _nomi.query_postal_code(zip_code)
    if result is not None and result.latitude == result.latitude:  # NaN check
        return round(result.latitude, 4), round(result.longitude, 4)
    return None, None


def fetch_market_data(api_key, make, model, year_min, year_max, mileage_max,
                      zip_code, radius_miles=100, trim=None):
    """Fetch comparable inventory listings and compute market stats.

    Args:
        api_key: MarketCheck API key
        make: e.g. "Toyota"
        model: e.g. "RAV4 Hybrid"
        year_min: e.g. 2022
        year_max: e.g. 2023
        mileage_max: e.g. 40000
        zip_code: buyer's zip code
        radius_miles: search radius (free tier caps at 100)
        trim: optional trim filter

    Returns:
        dict with market stats, or None on failure
    """
    if not api_key:
        logger.warning("No MarketCheck API key configured")
        return None

    # Convert zip to coordinates
    lat, lng = zip_to_coords(zip_code)
    if lat is None:
        logger.warning(f"Could not geocode zip code: {zip_code}")
        return None

    # Cap radius to free tier limit
    radius = min(radius_miles, 100)

    # Handle variant models (e.g. "RAV4 Hybrid" → search "RAV4", filter for "Hybrid")
    # MarketCheck stores variants in the listing heading, not the model field
    variant_keyword = None
    search_model = model
    for variant in ["Hybrid", "Prime", "Plug-In", "PHEV", "EV"]:
        if variant.lower() in model.lower():
            search_model = model.lower().replace(variant.lower(), "").strip()
            variant_keyword = variant.lower()
            break

    # Build year range string
    year_range = f"{year_min}-{year_max}" if year_min != year_max else str(year_min)

    params = {
        "api_key": api_key,
        "car_type": "used",
        "make": make,
        "model": search_model,
        "year": year_range,
        "miles_range": f"0-{mileage_max}",
        "latitude": lat,
        "longitude": lng,
        "radius": radius,
        "stats": "price,miles",
        "rows": 50,  # Fetch more so we can filter for variants
        "include_relevant_links": "false",
    }

    if trim:
        params["trim"] = trim

    try:
        resp = requests.get(
            f"{MARKETCHECK_BASE}/search/car/active",
            params=params,
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        logger.error(f"MarketCheck API error: {e}")
        return None

    # Parse results
    listings = data.get("listings", [])

    # Filter for variant if needed (e.g. only Hybrid listings)
    if variant_keyword and listings:
        listings = [
            l for l in listings
            if variant_keyword in (l.get("heading") or "").lower()
        ]

    if not listings:
        num_found = data.get("num_found", 0)
        logger.info(f"No MarketCheck listings found for {year_range} {make} {model}")
        return {
            "source": "marketcheck",
            "num_listings": 0,
            "num_total_before_filter": num_found,
            "variant_filter": variant_keyword,
            "market_value": None,
            "comparables": [],
        }

    # Compute price stats from filtered listings
    prices = [l.get("price") for l in listings if l.get("price")]
    mileages = [l.get("miles") for l in listings if l.get("miles")]

    if not prices:
        return {
            "source": "marketcheck",
            "num_listings": len(listings),
            "market_value": None,
            "comparables": [],
        }

    prices_sorted = sorted(prices)
    mid = len(prices_sorted) // 2
    median_price = (
        prices_sorted[mid]
        if len(prices_sorted) % 2 == 1
        else (prices_sorted[mid - 1] + prices_sorted[mid]) // 2
    )
    mean_price = sum(prices) // len(prices)
    min_price = min(prices)
    max_price = max(prices)
    avg_mileage = sum(mileages) // len(mileages) if mileages else None

    # Use median as the market value (more robust than mean)
    market_value = int(median_price)

    # Build comparable listings summary
    comparables = []
    for listing in listings[:10]:
        comp = {
            "year": listing.get("build", {}).get("year"),
            "make": listing.get("build", {}).get("make"),
            "model": listing.get("build", {}).get("model"),
            "trim": listing.get("build", {}).get("trim"),
            "mileage": listing.get("miles"),
            "price": listing.get("price"),
            "dealer": listing.get("dealer", {}).get("name"),
            "city": listing.get("dealer", {}).get("city"),
            "state": listing.get("dealer", {}).get("state"),
        }
        if comp["price"]:
            comparables.append(comp)

    return {
        "source": "marketcheck",
        "num_listings": len(listings),
        "variant_filter": variant_keyword,
        "market_value": market_value,
        "mean_price": mean_price,
        "median_price": int(median_price),
        "min_price": min_price,
        "max_price": max_price,
        "avg_mileage": avg_mileage,
        "comparables": comparables,
        "search_params": {
            "year": year_range,
            "make": make,
            "model": model,
            "zip": zip_code,
            "radius": radius,
            "mileage_max": mileage_max,
        },
    }
