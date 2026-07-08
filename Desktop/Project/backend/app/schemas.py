"""Pydantic request/response schemas."""
import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict


# ---------- Factory ----------

class FactoryCreate(BaseModel):
    name: str
    industry_type: str
    location: str
    contact: str


class FactoryOut(FactoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime


# ---------- Listing ----------

class ListingCreate(BaseModel):
    factory_id: int
    listing_type: str = Field(pattern="^(offer|request)$")
    material_type: str
    sub_type: Optional[str] = None
    quantity_kg_month: float = Field(gt=0)
    condition: str = "unknown"
    location: str
    description: Optional[str] = None
    photo_url: Optional[str] = None


class ListingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    factory_id: int
    listing_type: str
    material_type: str
    sub_type: Optional[str] = None
    quantity_kg_month: float
    condition: str
    location: str
    description: Optional[str] = None
    photo_url: Optional[str] = None
    status: str
    created_at: datetime.datetime
    factory: Optional[FactoryOut] = None


class MatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    match_score: float
    listing: ListingOut


# ---------- Classification ----------

class ClassificationResult(BaseModel):
    material_type: str
    sub_type: str
    condition: str
    confidence: int
    reuse_suggestions: List[str]
    estimated_value_note: str


# ---------- Dashboard ----------

class MaterialBreakdownItem(BaseModel):
    material_type: str
    quantity_kg_month: float
    co2_saved_kg: float
    listing_count: int


class DashboardStats(BaseModel):
    total_waste_diverted_kg_month: float
    total_co2_saved_kg_month: float
    total_matches: int
    total_listings: int
    total_factories: int
    breakdown_by_material: List[MaterialBreakdownItem]
