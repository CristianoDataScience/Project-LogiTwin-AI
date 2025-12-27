from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from . import models, database, auth
import random

router = APIRouter(prefix="/api/simulations", tags=["simulations"])

@router.post("/run")
def run_simulation(params: dict, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    params: {
        "weather": "rain" | "clear" | "storm",
        "traffic_factor": 1.0 to 2.0 (multiplier),
        "accident_prob": 0.0 to 1.0
    }
    """
    # Calculate delays
    weather = params.get("weather", "clear")
    traffic_factor = float(params.get("traffic_factor", 1.0))
    
    trucks = db.query(models.Truck).filter(models.Truck.status.in_(["EM TRÂNSITO", "IN_TRANSIT"])).all() # Use both EN/PT status just in case
    overall_delay = 0
    affected_trucks = []
    
    simulation_context = f"Condição Climática: {weather}. Intensidade de Tráfego: {traffic_factor}x. "
    
    for truck in trucks:
        if not truck.current_route_id:
            continue
            
        delay_multiplier = 1.0
        if weather in ["rain", "Chuva"]: delay_multiplier *= 1.2
        elif weather in ["storm", "Tempestade"]: delay_multiplier *= 1.5
        delay_multiplier *= traffic_factor
        
        base_delay = random.randint(0, 30)
        added_delay = base_delay * delay_multiplier
        overall_delay += added_delay
        
        if added_delay > 30:
            affected_trucks.append({
                "license_plate": truck.license_plate,
                "current_load": truck.current_load,
                "delay_minutes": int(added_delay)
            })

    # AI Analysis
    suggested_actions = []
    if affected_trucks:
        try:
            from openai import OpenAI
            import os
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            
            prompt = f"""
            Atue como um Especialista em Logística Senior. Analise o seguinte cenário de crise e forneça 3 recomendações táticas e concisas (max 1 frase cada) em Português do Brasil para mitigar os atrasos.
            
            Contexto: {simulation_context}
            Caminhões Afetados: {affected_trucks}
            
            Retorne APENAS a lista de recomendações JSON string array. Exemplo: ["Ação 1", "Ação 2"]
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200
            )
            
            import json
            import re
            content = response.choices[0].message.content
            # Try to parse list from content
            try:
                # Find brackets in case of extra text
                match = re.search(r'\[.*\]', content, re.DOTALL)
                if match:
                    suggested_actions = json.loads(match.group())
                else:
                    suggested_actions = [content]
            except:
                 suggested_actions = [content] # Fallback
                 
        except Exception as e:
            print(f"OpenAI Error: {e}")
            suggested_actions = ["Erro ao consultar IA. Recomenda-se revisão manual das rotas."]
    else:
        suggested_actions = ["Operação fluindo normalmente. Monitorar condições climáticas."]

    results = {
        "affected_trucks": [t["license_plate"] for t in affected_trucks], # Update format for frontend
        "suggested_actions": suggested_actions,
        "overall_delay_minutes": overall_delay
    }
        
    # Save Simulation
    sim = models.Simulation(
        name=f"Sim-{random.randint(1000,9999)}",
        parameters=params,
        results=results
    )
    db.add(sim)
    db.commit()
    
    return results
