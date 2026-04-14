"""
Seed the development database with sample data.
Mirrors the 7 WA dealer offers from the frontend demo.

Usage: python seed.py
"""

import json
from app import create_app
from models import db, User, VehicleRequest, Dealer, DealerInvite, Offer
from scoring import score_offers

SAMPLE_DEALERS = [
    {"name": "Rodland Toyota", "city": "Everett", "state": "WA", "zip_code": "98204"},
    {"name": "Toyota of Kirkland", "city": "Kirkland", "state": "WA", "zip_code": "98034"},
    {"name": "Toyota of Marysville", "city": "Marysville", "state": "WA", "zip_code": "98270"},
    {"name": "Toyota of Bellingham", "city": "Bellingham", "state": "WA", "zip_code": "98226"},
    {"name": "Doxon Toyota", "city": "Auburn", "state": "WA", "zip_code": "98002"},
    {"name": "Toyota of Puyallup", "city": "Puyallup", "state": "WA", "zip_code": "98371"},
    {"name": "Toyota of Seattle", "city": "Seattle", "state": "WA", "zip_code": "98188"},
]

SAMPLE_OFFERS = [
    {"year": 2023, "trim": "LE", "mileage": 18420, "otd": 27850, "certified": True, "extras": "New tires, roof rack cross bars", "contact_name": "Marcus R."},
    {"year": 2023, "trim": "XLE Premium", "mileage": 22100, "otd": 31200, "certified": True, "extras": "All-weather mats, cargo tray", "contact_name": "Jennifer L."},
    {"year": 2022, "trim": "SE", "mileage": 31500, "otd": 25900, "certified": True, "extras": "Paint protection film", "contact_name": "David K."},
    {"year": 2023, "trim": "LE", "mileage": 24800, "otd": 28400, "certified": False, "extras": "None", "contact_name": "Sarah M."},
    {"year": 2022, "trim": "XLE", "mileage": 28900, "otd": 26750, "certified": True, "extras": "Extended warranty included", "contact_name": "Chris P."},
    {"year": 2023, "trim": "XSE", "mileage": 15200, "otd": 33100, "certified": True, "extras": "Panoramic roof, BSM, advanced tech pkg", "contact_name": "Amy T."},
    {"year": 2022, "trim": "LE", "mileage": 35600, "otd": 24300, "certified": False, "extras": "Recently serviced", "contact_name": "Mike W."},
]


def seed():
    app = create_app("development")
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        # Create user (Rob)
        user = User(name="Rob", email="rob@lotduel.com")
        db.session.add(user)
        db.session.flush()

        # Create vehicle request
        vr = VehicleRequest(
            user_id=user.id,
            make="Toyota",
            model="RAV4 Hybrid",
            year_min=2022,
            year_max=2023,
            trim_targets=json.dumps(["LE", "XLE", "SE"]),
            mileage_max=40000,
            zip_code="98258",
            radius_miles=60,
            market_value=28500,
        )
        db.session.add(vr)
        db.session.flush()

        # Create dealers, invites, and offers
        for i, dealer_data in enumerate(SAMPLE_DEALERS):
            dealer = Dealer(**dealer_data)
            db.session.add(dealer)
            db.session.flush()

            invite = DealerInvite(
                vehicle_request_id=vr.id,
                dealer_id=dealer.id,
                status="submitted",
            )
            db.session.add(invite)
            db.session.flush()

            offer_data = SAMPLE_OFFERS[i]
            offer = Offer(
                vehicle_request_id=vr.id,
                dealer_invite_id=invite.id,
                dealer_id=dealer.id,
                year=offer_data["year"],
                make="Toyota",
                model="RAV4 Hybrid",
                trim=offer_data["trim"],
                mileage=offer_data["mileage"],
                otd_price=offer_data["otd"],
                certified=offer_data["certified"],
                extras=offer_data["extras"],
                contact_name=offer_data["contact_name"],
            )
            db.session.add(offer)

        db.session.flush()

        # Score all offers
        offers = Offer.query.filter_by(vehicle_request_id=vr.id).all()
        score_offers(offers, vr)
        db.session.commit()

        print(f"✓ Seeded database:")
        print(f"  - 1 user (Rob)")
        print(f"  - 1 vehicle request (RAV4 Hybrid)")
        print(f"  - {len(SAMPLE_DEALERS)} dealers")
        print(f"  - {len(SAMPLE_OFFERS)} offers (scored and ranked)")
        print()
        print(f"  Rankings:")
        for o in sorted(offers, key=lambda x: x.rank or 99):
            print(f"    #{o.rank} {o.dealer_ref.name} — ${o.otd_price:,} — {o.total_score}pts — {o.label}")


if __name__ == "__main__":
    seed()
