"""Impact dashboard aggregation endpoint."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.config import CO2_SAVINGS_FACTOR_KG, MATERIAL_TYPES
from app.matching import find_matches

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# Match scores at/above this threshold are counted as a "successful match"
# for the purposes of the impact dashboard.
MATCH_SCORE_THRESHOLD = 40.0


def _count_successful_matches(db: Session) -> int:
    offers = db.query(models.Listing).filter(
        models.Listing.listing_type == "offer", models.Listing.status == "active"
    ).all()

    seen_pairs = set()
    for offer in offers:
        for candidate, score in find_matches(db, offer):
            if score >= MATCH_SCORE_THRESHOLD:
                seen_pairs.add(frozenset({offer.id, candidate.id}))
    return len(seen_pairs)


@router.get("", response_model=schemas.DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    offer_listings = db.query(models.Listing).filter(models.Listing.listing_type == "offer").all()

    breakdown = []
    total_waste_kg = 0.0
    total_co2_kg = 0.0

    for material in MATERIAL_TYPES:
        material_offers = [l for l in offer_listings if l.material_type == material]
        qty = sum(l.quantity_kg_month for l in material_offers)
        co2 = qty * CO2_SAVINGS_FACTOR_KG.get(material, 0)
        listing_count = db.query(models.Listing).filter(models.Listing.material_type == material).count()

        total_waste_kg += qty
        total_co2_kg += co2

        if listing_count > 0:
            breakdown.append(
                schemas.MaterialBreakdownItem(
                    material_type=material,
                    quantity_kg_month=round(qty, 1),
                    co2_saved_kg=round(co2, 1),
                    listing_count=listing_count,
                )
            )

    breakdown.sort(key=lambda item: item.quantity_kg_month, reverse=True)

    return schemas.DashboardStats(
        total_waste_diverted_kg_month=round(total_waste_kg, 1),
        total_co2_saved_kg_month=round(total_co2_kg, 1),
        total_matches=_count_successful_matches(db),
        total_listings=db.query(models.Listing).count(),
        total_factories=db.query(models.Factory).count(),
        breakdown_by_material=breakdown,
    )
