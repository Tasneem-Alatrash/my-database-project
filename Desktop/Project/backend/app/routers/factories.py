"""Factory registration and listing endpoints (no real auth — demo-friendly)."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/factories", tags=["factories"])


@router.post("", response_model=schemas.FactoryOut, status_code=201)
def create_factory(payload: schemas.FactoryCreate, db: Session = Depends(get_db)):
    factory = models.Factory(**payload.model_dump())
    db.add(factory)
    db.commit()
    db.refresh(factory)
    return factory


@router.get("", response_model=List[schemas.FactoryOut])
def list_factories(db: Session = Depends(get_db)):
    return db.query(models.Factory).order_by(models.Factory.name).all()


@router.get("/{factory_id}", response_model=schemas.FactoryOut)
def get_factory(factory_id: int, db: Session = Depends(get_db)):
    factory = db.query(models.Factory).filter(models.Factory.id == factory_id).first()
    if not factory:
        raise HTTPException(status_code=404, detail="Factory not found.")
    return factory
