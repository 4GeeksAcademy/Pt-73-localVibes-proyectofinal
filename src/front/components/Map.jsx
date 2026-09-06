import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix para los iconos de marcadores (Bug de Leaflet con Webpack/React)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para mover la cámara del mapa
function RecenterAutomatically({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], 13);
        }
    }, [lat, lng, map]);
    return null;
}

export const InteractiveMap = () => {
    const [events, setEvents] = useState([]);
    // Centramos inicialmente en Caracas (Plaza Venezuela)
    const [mapCenter, setMapCenter] = useState({ lat: 10.491, lng: -66.885 });

    useEffect(() => {
        // 1. Intentar obtener la ubicación real del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.log("Usando ubicación por defecto (Caracas)")
            );
        }

        // 2. Cargar los eventos de la semilla desde el Backend
        fetch(`${process.env.BACKEND_URL}/api/events`)
            .then((res) => {
                if (!res.ok) throw new Error("Error en la respuesta del servidor");
                return res.json();
            })
            .then((data) => setEvents(data))
            .catch((err) => console.error("Error cargando eventos:", err));
    }, []);

    return (
        <div className="container-fluid py-4 bg-light">
            {/* Encabezado con Bootstrap */}
            <div className="row mb-4 px-3">
                <div className="col-12 bg-white p-4 rounded shadow-sm border-start border-primary border-5">
                    <h2 className="fw-bold text-dark mb-1">📍 Explora LocalVibes</h2>
                    <p className="text-muted mb-0">
                        Mostrando <span className="badge bg-primary">{events.length}</span> eventos activos en el mapa
                    </p>
                </div>
            </div>

            <div className="row px-3">
                <div className="col-12 p-0 rounded shadow-lg overflow-hidden border">
                    {/* Contenedor del Mapa con altura fija vía inline style */}
                    <div style={{ height: "600px", width: "100%" }}>
                        <MapContainer 
                            center={[mapCenter.lat, mapCenter.lng]} 
                            zoom={12} 
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* Centrar mapa si cambia la ubicación */}
                            <RecenterAutomatically lat={mapCenter.lat} lng={mapCenter.lng} />

                            {/* Renderizar Marcadores de la Semilla */}
                            {events.map((event) => (
                                <Marker key={event.id} position={[event.latitude, event.longitude]}>
                                    <Popup className="custom-popup">
                                        <div className="card border-0" style={{ width: "200px" }}>
                                            {event.image_url && (
                                                <img 
                                                    src={event.image_url} 
                                                    alt={event.title} 
                                                    className="card-img-top rounded-top"
                                                    style={{ height: "120px", objectFit: "cover" }}
                                                />
                                            )}
                                            <div className="card-body p-2">
                                                <h6 className="card-title fw-bold mb-1 text-primary">{event.title}</h6>
                                                <p className="card-text small text-muted mb-2">
                                                    <i className="bi bi-geo-alt-fill me-1"></i>
                                                    {event.location_name || "Ubicación local"}
                                                </p>
                                                <div className="d-grid">
                                                    <button className="btn btn-sm btn-primary">Ver Detalles</button>
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Footer Informativo Bootstrap */}
            <div className="row mt-4 px-3 text-center">
                <div className="col-12 text-muted small">
                    Usa el ratón para moverte por Caracas y haz clic en los pines para ver más información.
                </div>
            </div>
        </div>
    );
};