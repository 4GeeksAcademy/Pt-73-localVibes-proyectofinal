import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { renderToString } from "react-dom/server"; 
import { Music, Cpu, Trophy, Utensils, Palette, MapPin } from "lucide-react";
// Eliminamos Link de react-router-dom porque ya no cambiaremos de ruta

const getCategoryConfig = (catName) => {
    const name = catName?.toLowerCase() || "";
    if (name.includes("música") || name.includes("music")) return { color: "#3b82f6", icon: <Music size={22} color="white" /> }; 
    if (name.includes("tecnología") || name.includes("tech")) return { color: "#10b981", icon: <Cpu size={22} color="white" /> }; 
    if (name.includes("deporte")) return { color: "#8b5cf6", icon: <Trophy size={22} color="white" /> }; 
    if (name.includes("gastronomía") || name.includes("food")) return { color: "#f97316", icon: <Utensils size={22} color="white" /> }; 
    if (name.includes("arte") || name.includes("cultura")) return { color: "#ec4899", icon: <Palette size={22} color="white" /> }; 
    return { color: "#ef4444", icon: <MapPin size={22} color="white" /> }; 
};

const createCustomIcon = (categoryName) => {
    const { color, icon } = getCategoryConfig(categoryName);
    const iconHtml = renderToString(icon);
    
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 46px; height: 46px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4); transition: transform 0.2s;">${iconHtml}</div>`,
        className: "custom-leaflet-icon",
        iconSize: [46, 46],
        iconAnchor: [23, 23], 
        popupAnchor: [0, -23] 
    });
};

// 1. Agregamos la prop onOpenModal
export const EventsMap = ({ events, height = "100vh", onOpenModal }) => {
    const centerPosition = [10.4806, -66.9036]; 

    return (
        <MapContainer center={centerPosition} zoom={12} style={{ height: height, width: "100%", zIndex: 0 }} zoomControl={false}>
            
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {events.map((event) => {
                if (event.latitude && event.longitude) {
                    return (
                        <Marker 
                            key={event.id} 
                            position={[event.latitude, event.longitude]}
                            icon={createCustomIcon(event.categoryName)}
                        >
                            <Popup className="rounded-4 shadow-lg border-0">
                                <div style={{ minWidth: "180px" }}>
                                    <img 
                                        src={event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a"} 
                                        alt={event.title} 
                                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }} 
                                    />
                                    <span className="badge rounded-pill mb-2 shadow-sm" style={{ backgroundColor: getCategoryConfig(event.categoryName).color }}>
                                        {event.categoryName || "Evento"}
                                    </span>
                                    <h6 className="fw-bold mb-1" style={{ fontSize: "0.95rem" }}>{event.title}</h6>
                                    <p className="text-muted mb-3" style={{ fontSize: "0.8rem", margin: 0 }}>
                                        <MapPin size={12} className="me-1"/> {event.location_name}
                                    </p>
                                    
                                    {/* 2. Cambiamos el <Link> por un <button> que ejecuta onOpenModal */}
                                    <button 
                                        onClick={() => onOpenModal(event)} 
                                        className="btn btn-dark btn-sm w-100 rounded-pill fw-medium shadow-sm"
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}
        </MapContainer>
    );
};