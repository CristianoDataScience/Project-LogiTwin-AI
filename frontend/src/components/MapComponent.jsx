import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Realistic Heavy Truck Icon (Semi-Trailer)
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2555/2555022.png',
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
});

const cdIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
});

export default function MapComponent({ trucks = [], routes = [], cds = [], layers = {} }) {
    // Center on Vale do Paraíba (Between SP and Rio)
    const center = [-22.9, -45.5];

    return (
        <MapContainer center={center} zoom={8} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* Distribution Centers */}
            {cds.map(cd => (
                <Marker key={`cd-${cd.id}`} position={[cd.location_lat, cd.location_lng]} icon={cdIcon}>
                    <Popup>
                        <div className="p-1">
                            <p className="font-bold text-primary">{cd.name}</p>
                            <p className="text-xs">Capacidade: {cd.current_load}/{cd.capacity} m³</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Routes - Realistic Highway Rendering */}
            {routes.map(r => (
                <Polyline
                    key={`route-${r.id}`}
                    positions={r.waypoints.map(p => [p[0], p[1]])}
                    color="#94a3b8"
                    weight={4}
                    opacity={0.6}
                />
            ))}

            {/* Trucks - Functional Semi-Trucks */}
            {trucks.map(t => (
                <Marker key={`truck-${t.id}`} position={[t.location_lat, t.location_lng]} icon={truckIcon}>
                    <Popup>
                        <div className="p-1">
                            <p className="font-bold text-accent">{t.license_plate}</p>
                            <p className="text-xs line-clamp-1">Status: <span className="font-semibold">{t.status}</span></p>
                            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${t.current_load}%` }}></div>
                            </div>
                            <p className="text-[10px] text-secondary mt-1">Carga: {t.current_load}%</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Smart Layers - Bottlenecks */}
            {layers?.bottlenecks && (
                <Circle
                    center={[-22.5, -44.5]} // Resende/Itatiaia region
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 2 }}
                    radius={10000}
                >
                    <Popup>⚠️ Gargalo Crítico: Serra das Araras - Fluxo Lento</Popup>
                </Circle>
            )}

            {/* Smart Layers - AI Alternative Highway Route (Via Dutra / Carvalho Pinto) */}
            {layers?.altRoutes && (
                <Polyline
                    positions={[
                        [-23.55, -46.63], // SP
                        [-23.30, -45.95], // Jacareí
                        [-23.18, -45.88], // SJC
                        [-23.02, -45.55], // Taubaté
                        [-22.95, -45.17], // Guaratinguetá
                        [-22.47, -44.45], // Resende
                        [-22.55, -44.15], // Volta Redonda
                        [-22.75, -43.45], // Nova Iguaçu
                        [-22.90, -43.17]  // Rio
                    ]}
                    pathOptions={{ color: '#3b82f6', dashArray: '12, 12', opacity: 0.8, weight: 6 }}
                >
                    <Popup>
                        <div className="p-2">
                            <p className="font-bold text-blue-600">🔵 Rota Inteligente IA</p>
                            <p className="text-xs">Sugestão: Via Carvalho Pinto/Dutra</p>
                            <p className="text-[10px] text-secondary">Tempo estimado: -45 min vs. Gargalo</p>
                        </div>
                    </Popup>
                </Polyline>
            )}
        </MapContainer>
    );
}
