"""App-wide configuration and constants, including impact-calculation factors."""

# kg of CO2 saved per kg of material diverted from landfill/recycled,
# via industrial symbiosis instead of virgin material production + landfill disposal.
CO2_SAVINGS_FACTOR_KG = {
    "plastic": 1.5,
    "metal": 4.0,
    "wood": 0.5,
    "cardboard": 0.9,
    "glass": 0.3,
    "rubber": 1.2,
    "e-waste": 3.5,
    "organic": 0.2,
    "mixed": 0.8,
    "other": 0.5,
}

MATERIAL_TYPES = list(CO2_SAVINGS_FACTOR_KG.keys())

CONDITIONS = ["clean", "contaminated", "unknown"]

LISTING_TYPES = ["offer", "request"]
