import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Update to a more definitive heavy truck icon
const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554936.png',
    iconSize: [35, 35], // Slightly larger
});

const cdIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [30, 30],
});

export default function MapComponent({ trucks = [], routes = [], cds = [] }) {
    // Center on SP approx
    const center = [-23.0, -45.0];

    return (
        <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />

            {/* Distribution Centers */}
            {cds.map(cd => (
                <Marker key={`cd-${cd.id}`} position={[cd.location_lat, cd.location_lng]} icon={cdIcon}>
                    <Popup>
                        <strong>{cd.name}</strong><br />
                        Capacidade: {cd.current_load}/{cd.capacity}
                    </Popup>
                </Marker>
            ))}

            {/* Routes */}
            {routes.map(r => (
                <Polyline
                    key={`route-${r.id}`}
                    positions={r.waypoints.map(p => [p[0], p[1]])}
                    color="#3b82f6"
                    weight={3}
                    opacity={0.6}
                />
            ))}

            {/* Trucks */}
            {trucks.map(t => (
                <Marker key={`truck-${t.id}`} position={[t.location_lat, t.location_lng]} icon={truckIcon}>
                    <Popup>
                        <strong>{t.license_plate}</strong><br />
                        Status: {t.status === 'IN_TRANSIT' ? 'EM TRÂNSITO' : t.status === 'IDLE' ? 'PARADO' : 'MANUTENÇÃO'}<br />
                        Carga: {t.current_load}%
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
