from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from . import models, database, auth

router = APIRouter(prefix="/api", tags=["operations"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_orders = db.query(models.Order).count()
    active_trucks = db.query(models.Truck).filter(models.Truck.status == "IN_TRANSIT").count()
    delayed_orders = 0 # Mock calculation
    bottlenecks = 0 # Mock
    
    return {
        "total_orders": total_orders,
        "active_trucks": active_trucks,
        "delayed_orders": delayed_orders,
        "bottlenecks": bottlenecks
    }

@router.get("/trucks")
def get_trucks(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Truck).all()

@router.get("/routes")
def get_routes(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Route).all()

@router.get("/distribution_centers")
def get_cds(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.DistributionCenter).all()

@router.get("/orders")
def get_orders(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Order).all()
