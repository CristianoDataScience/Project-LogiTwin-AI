from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from . import models, database, auth

router = APIRouter(prefix="/api", tags=["operations"])

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    total_orders = db.query(models.Order).count()
    active_trucks = db.query(models.Truck).filter(models.Truck.status == "IN_TRANSIT").count()
    delayed_orders = db.query(models.Order).filter(models.Order.status == "PENDENTE").count()
    bottlenecks = 2 
    
    # New Business KPIs
    avg_delay = 15 # minutes (mock)
    risk_cost = delayed_orders * 150.00 # R$ (mock calculation)
    op_risk_percentage = min(100, (delayed_orders / max(1, total_orders)) * 100)

    return {
        "total_orders": total_orders,
        "active_trucks": active_trucks,
        "delayed_orders": delayed_orders,
        "bottlenecks": bottlenecks,
        "avg_delay": avg_delay,
        "risk_cost": risk_cost,
        "op_risk_percentage": op_risk_percentage
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

# CRUD Operations
class TruckCreate(BaseModel):
    license_plate: str
    capacity: int
    status: str = "IDLE"

@router.post("/trucks")
def create_truck(truck: TruckCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Default location SP
    new_truck = models.Truck(
        license_plate=truck.license_plate,
        capacity=truck.capacity,
        status=truck.status,
        location_lat=-23.5505,
        location_lng=-46.6333,
        current_load=0
    )
    db.add(new_truck)
    db.commit()
    db.refresh(new_truck)
    return new_truck

class RouteCreate(BaseModel):
    origin_id: int
    destination_id: int
    distance_km: float
    estimated_time_min: float

@router.post("/routes")
def create_route(route: RouteCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Mock waypoints logic (straight line)
    origin = db.query(models.DistributionCenter).filter(models.DistributionCenter.id == route.origin_id).first()
    dest = db.query(models.DistributionCenter).filter(models.DistributionCenter.id == route.destination_id).first()
    
    if not origin or not dest:
        raise HTTPException(status_code=400, detail="Invalid Distribution Centers")

    # Melhoria na lógica de waypoints (evitar o mar em rotas costeiras como SP-RJ)
    # Se a longitude for muito próxima da costa (~-43 a -46), empurramos o midpoint para o interior
    mid_lat = (origin.location_lat + dest.location_lat)/2
    mid_lng = (origin.location_lng + dest.location_lng)/2
    
    # Se for uma rota longa entre SP e RJ, forçamos passar por pontos terrestres conhecidos (SJC/Resende)
    # Isso é uma heurística simples para o Digital Twin
    if origin.location_lng < -46 and dest.location_lng > -44: # SP para Rio
        waypoints = [
            [origin.location_lat, origin.location_lng],
            [-23.18, -45.88], # SJC
            [-22.47, -44.45], # Resende
            [dest.location_lat, dest.location_lng]
        ]
    else:
        waypoints = [
            [origin.location_lat, origin.location_lng],
            [mid_lat, mid_lng],
            [dest.location_lat, dest.location_lng]
        ]

    new_route = models.Route(
        origin_id=route.origin_id,
        destination_id=route.destination_id,
        waypoints=waypoints,
        distance_km=route.distance_km,
        estimated_time_min=route.estimated_time_min,
        is_active=True
    )
    db.add(new_route)
    db.commit()
    db.refresh(new_route)
    return new_route

class DriverCreate(BaseModel):
    name: str
    cnh: str = None
    role: str = "Motorista"

@router.post("/drivers")
def create_driver(driver: DriverCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_driver = models.Driver(name=driver.name, cnh=driver.cnh, role=driver.role)
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

@router.get("/drivers")
def get_drivers(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Driver).all()
