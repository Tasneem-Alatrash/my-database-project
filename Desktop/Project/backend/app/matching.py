"""Matching algorithm for the waste marketplace.

Given a listing, finds and ranks compatible counterpart listings
(offer <-> request) by material type match, sub-type similarity, and
quantity compatibility.
"""
from difflib import SequenceMatcher
from typing import List, Tuple

from sqlalchemy.orm import Session

from app.models import Listing

# Weights for the composite match score.
MATERIAL_MATCH_WEIGHT = 50
SUBTYPE_SIMILARITY_WEIGHT = 30
QUANTITY_COMPATIBILITY_WEIGHT = 20


def _subtype_similarity(a: str, b: str) -> float:
    """Return a 0-1 similarity score between two sub-type strings."""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def _quantity_compatibility(qty_a: float, qty_b: float) -> float:
    """Return a 0-1 score for how compatible two monthly quantities are.

    Perfect compatibility when quantities are equal or the smaller one can be
    fully absorbed by the larger one without huge excess/shortfall.
    """
    if qty_a <= 0 or qty_b <= 0:
        return 0.0
    smaller, larger = sorted([qty_a, qty_b])
    return smaller / larger


def find_matches(db: Session, listing: Listing, limit: int = 10) -> List[Tuple[Listing, float]]:
    """Find and rank counterpart listings for the given listing.

    An "offer" matches against "request" listings and vice versa.
    """
    counterpart_type = "request" if listing.listing_type == "offer" else "offer"

    candidates = (
        db.query(Listing)
        .filter(
            Listing.listing_type == counterpart_type,
            Listing.material_type == listing.material_type,
            Listing.status == "active",
            Listing.id != listing.id,
            Listing.factory_id != listing.factory_id,
        )
        .all()
    )

    scored = []
    for candidate in candidates:
        material_score = MATERIAL_MATCH_WEIGHT  # already filtered to be equal
        subtype_score = _subtype_similarity(listing.sub_type or "", candidate.sub_type or "") * SUBTYPE_SIMILARITY_WEIGHT
        quantity_score = (
            _quantity_compatibility(listing.quantity_kg_month, candidate.quantity_kg_month)
            * QUANTITY_COMPATIBILITY_WEIGHT
        )
        total_score = round(material_score + subtype_score + quantity_score, 1)
        scored.append((candidate, total_score))

    scored.sort(key=lambda pair: pair[1], reverse=True)
    return scored[:limit]
