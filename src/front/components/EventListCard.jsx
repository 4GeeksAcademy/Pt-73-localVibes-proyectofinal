import React from "react";

// Agregamos la prop onOpenModal
export const EventListCard = ({ event, categoryName, onOpenModal }) => {
    
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha por confirmar";
        const date = new Date(dateString);
        const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('es-ES', optionsDate).replace(',', '')} • ${date.toLocaleTimeString('en-US', optionsTime)}`;
    };

    return (
        <div className="card flex-row border border-light shadow-sm mb-3 overflow-hidden" style={{ height: "180px", borderRadius: "12px" }}>
            
            {/* Imagen superpuesta clickeable */}
            <div 
                className="position-relative h-100" 
                style={{ width: "280px", minWidth: "280px", cursor: "pointer" }}
                onClick={() => onOpenModal(event)}
            >
                <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill" style={{ zIndex: 1 }}>
                    {categoryName || "Evento"}
                </span>
                <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400"} 
                    alt={event.title}
                    className="h-100 w-100"
                    style={{ objectFit: "cover" }}
                />
            </div>

            <div className="card-body d-flex justify-content-between p-3">
                <div className="d-flex flex-column justify-content-center">
                    <p className="mb-1" style={{ color: "#e74c3c", fontSize: "0.85rem", fontWeight: "500" }}>
                        <i className="bi bi-calendar3 me-1"></i> 
                        {formatDate(event.start_time)}
                    </p>
                    <h5 
                        className="fw-bold mb-1 text-dark text-decoration-none" 
                        style={{ cursor: "pointer" }}
                        onClick={() => onOpenModal(event)}
                    >
                        {event.title}
                    </h5>
                    <p className="text-muted mb-auto" style={{ fontSize: "0.9rem" }}>
                        <i className="bi bi-geo-alt me-1"></i> 
                        {event.location_name || event.address || "Ubicación por confirmar"}
                    </p>
                    <span className="text-danger fw-bold fs-5 mt-2">$15</span>
                </div>

                <div className="d-flex flex-column justify-content-between align-items-end">
                    <i className="bi bi-heart-fill text-danger fs-5" role="button" title="Guardar favorito"></i>
                    {/* Botón que acciona el modal */}
                    <button 
                        className="btn btn-outline-danger rounded-pill px-4" 
                        style={{ fontWeight: "500" }}
                        onClick={() => onOpenModal(event)}
                    >
                        Ver detalles
                    </button>
                </div>
            </div>
        </div>
    );
};