from sqlalchemy.orm import Session
from . import models, auth
from faker import Faker
import random

fake = Faker('pt_BR') # Portuguese localization

def populate_db(db: Session):
    if db.query(models.User).first():
        return # Already populated

    # Create Test User
    hashed = auth.get_password_hash("admin123")
    user = models.User(email="admin@logistics.com", hashed_password=hashed)
    db.add(user)

    # CDs
    cds = [
        models.DistributionCenter(name="CD São Paulo", location_lat=-23.5505, location_lng=-46.6333, capacity=1000, current_load=500),
        models.DistributionCenter(name="CD Rio de Janeiro", location_lat=-22.9068, location_lng=-43.1729, capacity=800, current_load=300),
        models.DistributionCenter(name="CD Campinas", location_lat=-22.9099, location_lng=-47.0626, capacity=600, current_load=200),
    ]
    db.add_all(cds)
    db.commit()
    
    for cd in cds: db.refresh(cd)

    # Routes (Simple mesh)
    routes = []
    # SP -> RJ
    routes.append(models.Route(origin_id=cds[0].id, destination_id=cds[1].id, distance_km=430, estimated_time_min=300, waypoints=[[-23.55,-46.63], [-23.0,-45.0], [-22.90,-43.17]]))
    # RJ -> SP
    routes.append(models.Route(origin_id=cds[1].id, destination_id=cds[0].id, distance_km=430, estimated_time_min=300, waypoints=[[-22.90,-43.17], [-23.0,-45.0], [-23.55,-46.63]]))
    # SP -> Campinas
    routes.append(models.Route(origin_id=cds[0].id, destination_id=cds[2].id, distance_km=90, estimated_time_min=60, waypoints=[[-23.55,-46.63], [-22.90,-47.06]]))
    
    db.add_all(routes)
    db.commit()
    for r in routes: db.refresh(r)

    # Trucks - STATUS IN PORTUGUESE
    trucks = []
    for i in range(10):
        status = random.choice(["PARADO", "EM TRÂNSITO", "MANUTENÇÃO"]) # Translated
        lat = random.uniform(-24.0, -22.0)
        lng = random.uniform(-47.0, -43.0)
        t = models.Truck(
            license_plate=fake.license_plate(),
            status=status,
            location_lat=lat,
            location_lng=lng,
            capacity=100,
            current_load=random.randint(0, 100)
        )
        if status == "EM TRÂNSITO":
            t.current_route_id = random.choice(routes).id
        trucks.append(t)
    db.add_all(trucks)
    
    # Orders
    orders = []
    for i in range(30):
        orders.append(models.Order(
            customer_name=fake.company(),
            destination_lat=random.uniform(-24.0, -22.0),
            destination_lng=random.uniform(-47.0, -43.0),
            weight=random.randint(1, 20),
            status=random.choice(["PENDENTE", "ATRIBUÍDO", "ENTREGUE"]) # Translated
        ))
    db.add_all(orders)
    
    db.commit()
