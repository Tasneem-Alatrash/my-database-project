"""SQLAlchemy ORM models: Factory, Listing, Match."""
import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Factory(Base):
    __tablename__ = "factories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry_type = Column(String, nullable=False)
    location = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listings = relationship("Listing", back_populates="factory", cascade="all, delete-orphan")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    factory_id = Column(Integer, ForeignKey("factories.id"), nullable=False)
    listing_type = Column(String, nullable=False)  # "offer" | "request"
    material_type = Column(String, nullable=False)
    sub_type = Column(String, nullable=True)
    quantity_kg_month = Column(Float, nullable=False)
    condition = Column(String, default="unknown")
    location = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    status = Column(String, default="active")  # active | matched | closed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    factory = relationship("Factory", back_populates="listings")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    listing_a_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    listing_b_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    match_score = Column(Float, nullable=False)
    confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    listing_a = relationship("Listing", foreign_keys=[listing_a_id])
    listing_b = relationship("Listing", foreign_keys=[listing_b_id])
