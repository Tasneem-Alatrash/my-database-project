"""Waste listing endpoints: create, browse/filter, detail, and matches."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.matching import find_matches

router = APIRouter(prefix="/api/listings", tags=["listings"])


@router.post("", response_model=schemas.ListingOut, status_code=201)
def create_listing(payload: schemas.ListingCreate, db: Session = Depends(get_db)):
    factory = db.query(models.Factory).filter(models.Factory.id == payload.factory_id).first()
    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found.")

    listing = models.Listing(**payload.model_dump())
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


@router.get("", response_model=List[schemas.ListingOut])
def list_listings(
    material_type: Optional[str] = None,
    listing_type: Optional[str] = Query(None, pattern="^(offer|request)$"),
    location: Optional[str] = None,
    status: Optional[str] = "active",
    db: Session = Depends(get_db),
):
    query = db.query(models.Listing)
    if material_type:
        query = query.filter(models.Listing.material_type == material_type)
    if listing_type:
        query = query.filter(models.Listing.listing_type == listing_type)
    if location:
        query = query.filter(models.Listing.location.ilike(f"%{location}%"))
    if status:
        query = query.filter(models.Listing.status == status)
    return query.order_by(models.Listing.created_at.desc()).all()


@router.get("/{listing_id}", response_model=schemas.ListingOut)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    return listing


@router.get("/{listing_id}/matches", response_model=List[schemas.MatchOut])
def get_listing_matches(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")

    ranked = find_matches(db, listing)
    return [
        schemas.MatchOut(id=candidate.id, match_score=score, listing=candidate)
        for candidate, score in ranked
    ]


@router.delete("/{listing_id}", status_code=204)
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    db.delete(listing)
    db.commit()
