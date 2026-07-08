# ReSort AI

An industrial waste management platform that uses AI to classify waste materials from photos and connects factories to exchange waste as resources (industrial symbiosis).

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS, RTL-ready (Arabic default, English toggle)
- **Backend**: Python FastAPI
- **Database**: SQLite via SQLAlchemy
- **AI**: Anthropic Claude (vision) for waste image classification — swappable for a local model later

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── database.py          # SQLAlchemy engine/session
│   │   ├── models.py            # Factory, Listing, Match ORM models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── config.py            # CO2 savings factors & constants
│   │   ├── matching.py          # Offer<->request matching algorithm
│   │   ├── classifier/          # Swappable waste classifier module
│   │   │   ├── base.py          # Abstract classifier interface
│   │   │   └── claude_classifier.py
│   │   └── routers/             # classify, factories, listings, dashboard
│   ├── seed.py                  # Demo data seed script
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/                # Landing, Classify, Marketplace, ListingDetail, Dashboard
    │   ├── components/           # Navbar, ListingCard, ConfidenceBar, Modal
    │   ├── i18n/                 # translations.js (EN + AR) and language context
    │   ├── context/              # FactoryContext ("logged in as" demo session)
    │   └── api/client.js         # Axios API client
    ├── package.json
    └── .env.example
```

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env and set ANTHROPIC_API_KEY=sk-ant-...
```

Seed the database with demo factories and listings:

```bash
python seed.py
```

Run the API server (port 8000):

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point at http://localhost:8000
npm run dev
```

The app runs at **http://localhost:5173** and talks to the API at **http://localhost:8000**.

## Environment Variables

| File | Variable | Description |
|---|---|---|
| `backend/.env` | `ANTHROPIC_API_KEY` | **Required.** Your Anthropic API key, used for waste image classification. |
| `backend/.env` | `ANTHROPIC_MODEL` | Optional. Claude model id (default: `claude-sonnet-4-6`). |
| `backend/.env` | `DATABASE_URL` | Optional. SQLAlchemy connection string (defaults to a local SQLite file). |
| `backend/.env` | `FRONTEND_ORIGIN` | Optional. Origin allowed by CORS (default: `http://localhost:5173`). |
| `frontend/.env` | `VITE_API_BASE_URL` | Base URL of the backend API (default: `http://localhost:8000`). |

## Core Features

1. **Waste Classification (AI)** — Upload a photo on the Classify page; the backend sends it to Claude and returns structured JSON (material type, sub-type, condition, confidence, reuse suggestions, estimated value).
2. **Waste Marketplace** — Factories register (name, industry, location, contact) with a simple localStorage-based "logged in as" selector (no real auth). Post offer/request listings; a matching algorithm ranks compatible counterpart listings by material match, sub-type similarity, and quantity compatibility.
3. **Impact Dashboard** — Charts (via Recharts) for total waste diverted, estimated CO2 saved, successful matches, and breakdown by material type. CO2 factors live in `backend/app/config.py`.
4. **Bilingual UI** — All strings live in `frontend/src/i18n/translations.js` (English + Arabic). Arabic is the default with full RTL layout; toggle language from the navbar.

## Notes

- The classifier is isolated behind `app/classifier/base.py`'s `WasteClassifier` interface so `ClaudeWasteClassifier` can later be swapped for a local YOLO-based implementation without touching the API layer.
- Re-run `python seed.py` any time to reset the demo data (it drops and recreates all tables).
