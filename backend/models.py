from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class DistributionCenter(Base):
    __tablename__ = "distribution_centers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location_lat = Column(Float)
    location_lng = Column(Float)
    capacity = Column(Integer)
    current_load = Column(Integer, default=0)

class Truck(Base):
    __tablename__ = "trucks"
    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String, unique=True, index=True)
    status = Column(String, default="IDLE") # IDLE, IN_TRANSIT, MAINTENANCE
    location_lat = Column(Float)
    location_lng = Column(Float)
    capacity = Column(Integer)
    current_load = Column(Integer, default=0)
    current_route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)

class Route(Base):
    __tablename__ = "routes"
    id = Column(Integer, primary_key=True, index=True)
    origin_id = Column(Integer, ForeignKey("distribution_centers.id"))
    destination_id = Column(Integer, ForeignKey("distribution_centers.id"))
    waypoints = Column(JSON) # List of [lat, lng]
    distance_km = Column(Float)
    estimated_time_min = Column(Float)
    is_active = Column(Boolean, default=True)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    destination_lat = Column(Float)
    destination_lng = Column(Float)
    weight = Column(Float)
    status = Column(String, default="PENDING") # PENDING, ASSIGNED, DELIVERED
    assigned_truck_id = Column(Integer, ForeignKey("trucks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Simulation(Base):
    __tablename__ = "simulations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    parameters = Column(JSON) # {"traffic_factor": 1.2, "weather": "rain"}
    results = Column(JSON) # {"delayed_trucks": [...], "new_kpis": {...}}
    created_at = Column(DateTime, default=datetime.utcnow)

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    cnh = Column(String, unique=True, nullable=True) # Optional for non-drivers
    role = Column(String, default="Motorista") # Motorista, Operador, Gerente
    status = Column(String, default="AVAILABLE") # AVAILABLE, BUSY

