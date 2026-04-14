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

    # Build year range string
    year_range = f"{year_min}-{year_max}" if year_min != year_max else str(year_min)

    params = {
        "api_key": api_key,
        "car_type": "used",
        "make": make,
        "model": model,
        "year": year_range,
        "miles_range": f"0-{mileage_max}",
        "latitude": lat,
        "longitude": lng,
        "radius": radius,
        "stats": "price,miles",
        "rows": 10,  # Get a few listings for context
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
    num_listings = data.get("num_found", 0)
    stats = data.get("stats", {})
    price_stats = stats.get("price", {})
    miles_stats = stats.get("miles", {})
    listings = data.get("listings", [])

    if num_listings == 0:
        logger.info(f"No MarketCheck listings found for {year_range} {make} {model}")
        return {
            "source": "marketcheck",
            "num_listings": 0,
            "market_value": None,
            "comparables": [],
        }

    # Extract price statistics
    mean_price = price_stats.get("mean")
    median_price = price_stats.get("median")
    min_price = price_stats.get("min")
    max_price = price_stats.get("max")

    # Use median as the market value (more robust than mean)
    market_value = int(median_price) if median_price else (
        int(mean_price) if mean_price else None
    )

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
        "num_listings": num_listings,
        "market_value": market_value,
        "mean_price": int(mean_price) if mean_price else None,
        "median_price": int(median_price) if median_price else None,
        "min_price": int(min_price) if min_price else None,
        "max_price": int(max_price) if max_price else None,
        "avg_mileage": int(miles_stats.get("mean", 0)) if miles_stats.get("mean") else None,
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
