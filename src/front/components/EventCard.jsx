import React from "react";
import { Link } from "react-router-dom";

export const EventCard = ({ event }) => {
    return (
        <div className="card h-100 shadow-sm border-0">
            <img 
                src={event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600"} 
                className="card-img-top" 
                alt={event.title}
                style={{ height: "180px", objectFit: "cover" }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{event.title}</h5>
                <p className="card-text text-muted mb-2 small">
                    📍 {event.location_name || event.address || "Ubicación por confirmar"}
                </p>
                <p className="card-text flex-grow-1 small text-secondary">
                    {event.description ? event.description.substring(0, 80) + "..." : "Sin descripción disponible."}
                </p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary">Activo</span>
                    <Link to={`/events/${event.id}`} className="btn btn-outline-primary btn-sm">
                        Ver Detalles
                    </Link>
                </div>
            </div>
        </div>
    );
};