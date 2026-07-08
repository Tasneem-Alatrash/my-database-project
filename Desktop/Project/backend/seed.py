"""Seed script: populates the database with demo factories and listings.

Run with:  python backend/seed.py   (from the project root)
       or:  python seed.py          (from inside the backend/ folder)
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine, SessionLocal
from app import models

FACTORIES = [
    {"name": "Nile Plastics Co.", "industry_type": "Plastics Manufacturing", "location": "6th of October City", "contact": "info@nileplastics.eg"},
    {"name": "Delta Steel Works", "industry_type": "Metal Fabrication", "location": "Sadat City", "contact": "contact@deltasteel.eg"},
    {"name": "Cairo Furniture House", "industry_type": "Furniture & Wood", "location": "Obour City", "contact": "sales@cairofurniture.eg"},
    {"name": "Alex Packaging Ltd.", "industry_type": "Packaging & Cardboard", "location": "Alexandria", "contact": "hello@alexpackaging.eg"},
    {"name": "Pharaonic Glassworks", "industry_type": "Glass Production", "location": "Ismailia", "contact": "info@pharaonicglass.eg"},
    {"name": "Suez Auto Parts", "industry_type": "Automotive & Rubber", "location": "Suez", "contact": "parts@suezauto.eg"},
    {"name": "Smart Electronics Egypt", "industry_type": "Electronics Assembly", "location": "10th of Ramadan City", "contact": "info@smartelectronics.eg"},
    {"name": "Delta Fresh Foods", "industry_type": "Food Processing", "location": "Mansoura", "contact": "ops@deltafresh.eg"},
    {"name": "Nile Textiles Group", "industry_type": "Textile Manufacturing", "location": "Mahalla El Kubra", "contact": "info@niletextiles.eg"},
    {"name": "Giza Construction Materials", "industry_type": "Construction Materials", "location": "Giza", "contact": "sales@gizaconstruction.eg"},
    {"name": "Cairo Chemical Industries", "industry_type": "Chemical Processing", "location": "Helwan", "contact": "info@cairochemical.eg"},
    {"name": "Red Sea Print & Publishing", "industry_type": "Printing & Publishing", "location": "Port Said", "contact": "print@redseapublish.eg"},
    {"name": "Aswan Metal Recyclers", "industry_type": "Metal Fabrication", "location": "Aswan", "contact": "recycle@aswanmetal.eg"},
    {"name": "Beni Suef Cardboard Co.", "industry_type": "Packaging & Cardboard", "location": "Beni Suef", "contact": "info@bscardboard.eg"},
    {"name": "Tanta Rubber Industries", "industry_type": "Automotive & Rubber", "location": "Tanta", "contact": "sales@tantarubber.eg"},
]

# Listings reference factories by name; quantities are kg/month.
LISTINGS = [
    # Plastic
    {"factory": "Nile Plastics Co.", "listing_type": "offer", "material_type": "plastic", "sub_type": "PET plastic", "quantity_kg_month": 5000, "condition": "clean", "description": "Clean PET bottle scrap from production line trimmings."},
    {"factory": "Suez Auto Parts", "listing_type": "offer", "material_type": "plastic", "sub_type": "HDPE plastic", "quantity_kg_month": 1200, "condition": "clean", "description": "HDPE offcuts from bumper molding."},
    {"factory": "Smart Electronics Egypt", "listing_type": "request", "material_type": "plastic", "sub_type": "ABS plastic", "quantity_kg_month": 800, "condition": "clean", "description": "Need ABS pellets for injection-molded casings."},
    {"factory": "Giza Construction Materials", "listing_type": "request", "material_type": "plastic", "sub_type": "PET plastic", "quantity_kg_month": 3000, "condition": "unknown", "description": "Looking for recycled PET flakes for composite panels."},
    {"factory": "Cairo Chemical Industries", "listing_type": "offer", "material_type": "plastic", "sub_type": "mixed plastic drums", "quantity_kg_month": 600, "condition": "contaminated", "description": "Used chemical drums, requires cleaning before reuse."},
    # Metal
    {"factory": "Delta Steel Works", "listing_type": "offer", "material_type": "metal", "sub_type": "steel scrap", "quantity_kg_month": 8000, "condition": "clean", "description": "Steel offcuts from structural beam fabrication."},
    {"factory": "Aswan Metal Recyclers", "listing_type": "offer", "material_type": "metal", "sub_type": "aluminum shavings", "quantity_kg_month": 2500, "condition": "clean", "description": "Aluminum shavings from CNC machining."},
    {"factory": "Cairo Furniture House", "listing_type": "request", "material_type": "metal", "sub_type": "steel fittings", "quantity_kg_month": 500, "condition": "clean", "description": "Need steel brackets and fittings scrap for furniture hardware."},
    {"factory": "Suez Auto Parts", "listing_type": "request", "material_type": "metal", "sub_type": "aluminum sheet", "quantity_kg_month": 1800, "condition": "unknown", "description": "Looking for aluminum sheet scrap for parts fabrication."},
    # Wood
    {"factory": "Cairo Furniture House", "listing_type": "offer", "material_type": "wood", "sub_type": "wood offcuts", "quantity_kg_month": 3500, "condition": "clean", "description": "Sawdust and wood offcuts from furniture cutting."},
    {"factory": "Giza Construction Materials", "listing_type": "request", "material_type": "wood", "sub_type": "wood pallets", "quantity_kg_month": 2000, "condition": "unknown", "description": "Need used wood pallets for formwork."},
    {"factory": "Delta Fresh Foods", "listing_type": "offer", "material_type": "wood", "sub_type": "wooden crates", "quantity_kg_month": 900, "condition": "clean", "description": "Surplus wooden shipping crates."},
    # Cardboard
    {"factory": "Alex Packaging Ltd.", "listing_type": "offer", "material_type": "cardboard", "sub_type": "cardboard trimmings", "quantity_kg_month": 4200, "condition": "clean", "description": "Corrugated cardboard trimmings from box production."},
    {"factory": "Beni Suef Cardboard Co.", "listing_type": "offer", "material_type": "cardboard", "sub_type": "corrugated cardboard", "quantity_kg_month": 6000, "condition": "clean", "description": "Excess corrugated cardboard sheets."},
    {"factory": "Red Sea Print & Publishing", "listing_type": "request", "material_type": "cardboard", "sub_type": "cardboard rolls", "quantity_kg_month": 1500, "condition": "clean", "description": "Need cardboard rolls/sheets for packaging inserts."},
    {"factory": "Nile Plastics Co.", "listing_type": "request", "material_type": "cardboard", "sub_type": "cardboard packaging", "quantity_kg_month": 1000, "condition": "unknown", "description": "Looking for cardboard for product packaging."},
    # Glass
    {"factory": "Pharaonic Glassworks", "listing_type": "offer", "material_type": "glass", "sub_type": "glass cullet", "quantity_kg_month": 3000, "condition": "clean", "description": "Clean glass cullet from bottle manufacturing rejects."},
    {"factory": "Alex Packaging Ltd.", "listing_type": "request", "material_type": "glass", "sub_type": "glass cullet", "quantity_kg_month": 2500, "condition": "clean", "description": "Need glass cullet for glass container production."},
    # Rubber
    {"factory": "Tanta Rubber Industries", "listing_type": "offer", "material_type": "rubber", "sub_type": "tire scrap", "quantity_kg_month": 2200, "condition": "contaminated", "description": "Rubber offcuts and tire scrap from molding process."},
    {"factory": "Suez Auto Parts", "listing_type": "offer", "material_type": "rubber", "sub_type": "rubber gaskets", "quantity_kg_month": 700, "condition": "contaminated", "description": "Used rubber gaskets and seals."},
    {"factory": "Delta Steel Works", "listing_type": "request", "material_type": "rubber", "sub_type": "rubber matting", "quantity_kg_month": 900, "condition": "unknown", "description": "Need rubber matting material for factory flooring."},
    # E-waste
    {"factory": "Smart Electronics Egypt", "listing_type": "offer", "material_type": "e-waste", "sub_type": "circuit board scrap", "quantity_kg_month": 450, "condition": "contaminated", "description": "Rejected circuit boards and electronic components."},
    {"factory": "Cairo Chemical Industries", "listing_type": "offer", "material_type": "e-waste", "sub_type": "used batteries", "quantity_kg_month": 300, "condition": "contaminated", "description": "Used industrial batteries, handle with care."},
    {"factory": "Aswan Metal Recyclers", "listing_type": "request", "material_type": "e-waste", "sub_type": "circuit boards", "quantity_kg_month": 600, "condition": "unknown", "description": "Need e-waste for precious metal recovery."},
    # Organic
    {"factory": "Delta Fresh Foods", "listing_type": "offer", "material_type": "organic", "sub_type": "food processing waste", "quantity_kg_month": 5000, "condition": "contaminated", "description": "Organic food scraps and peels from processing lines."},
    {"factory": "Nile Textiles Group", "listing_type": "request", "material_type": "organic", "sub_type": "biomass waste", "quantity_kg_month": 2000, "condition": "unknown", "description": "Need organic waste as biomass fuel for boilers."},
    # Mixed
    {"factory": "Cairo Chemical Industries", "listing_type": "offer", "material_type": "mixed", "sub_type": "mixed industrial waste", "quantity_kg_month": 800, "condition": "contaminated", "description": "Mixed industrial waste, needs sorting."},
    {"factory": "Beni Suef Cardboard Co.", "listing_type": "request", "material_type": "mixed", "sub_type": "mixed recyclables", "quantity_kg_month": 500, "condition": "unknown", "description": "Looking for mixed recyclables to sort and bale."},
    # Other
    {"factory": "Tanta Rubber Industries", "listing_type": "offer", "material_type": "other", "sub_type": "misc factory waste", "quantity_kg_month": 400, "condition": "unknown", "description": "Miscellaneous factory waste, open to offers."},
    {"factory": "Red Sea Print & Publishing", "listing_type": "request", "material_type": "other", "sub_type": "misc materials", "quantity_kg_month": 300, "condition": "unknown", "description": "Open to miscellaneous materials for testing new processes."},
]


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        factory_objs = {}
        for f in FACTORIES:
            factory = models.Factory(**f)
            db.add(factory)
            db.flush()
            factory_objs[f["name"]] = factory

        for l in LISTINGS:
            factory = factory_objs[l["factory"]]
            listing = models.Listing(
                factory_id=factory.id,
                listing_type=l["listing_type"],
                material_type=l["material_type"],
                sub_type=l["sub_type"],
                quantity_kg_month=l["quantity_kg_month"],
                condition=l["condition"],
                location=factory.location,
                description=l["description"],
            )
            db.add(listing)

        db.commit()
        print(f"Seeded {len(FACTORIES)} factories and {len(LISTINGS)} listings.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
