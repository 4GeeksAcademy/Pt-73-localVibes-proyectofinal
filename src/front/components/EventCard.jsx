import React from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export const EventCard = ({ event, onOpenModal }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    // 1. MISMA FUNCIÓN DE FECHAS QUE EN LA LISTA
    const formatDateTime = (start, end) => {
        if (!start) return "Fecha por confirmar";
        
        const startDate = new Date(start);
        const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        
        const formattedDate = startDate.toLocaleDateString('es-ES', optionsDate).replace(',', '');
        const startTimeStr = startDate.toLocaleTimeString('en-US', optionsTime);
        
        let endTimeStr = "";
        
        if (end) {
            if (end.includes("T")) {
                const endDate = new Date(end);
                endTimeStr = ` - ${endDate.toLocaleTimeString('en-US', optionsTime)}`;
            } else {
                endTimeStr = ` - ${end}`;
            }
        }

        return `${formattedDate} • ${startTimeStr}${endTimeStr}`;
    };

    // 2. MISMA LÓGICA DE IMAGEN
    const imageUrl = event.imgs_event && event.imgs_event.length > 0 
        ? event.imgs_event[0] 
        : (event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600");

    // 3. MISMA LÓGICA DE PRECIO
    const priceValue = parseFloat(event.price);
    const isFree = isNaN(priceValue) || priceValue <= 0;

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-scale" style={{ backgroundColor: "#ffffff" }}>
            
            {/* IMAGEN Y CATEGORÍA */}
            <div 
                className="position-relative" 
                style={{ cursor: "pointer" }}
                onClick={onOpenModal}
            >
                <span className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style={{ zIndex: 1, background: orangeGradient }}>
                    {event.categoryName || "Evento"}
                </span>
                <img 
                    src={imageUrl} 
                    className="card-img-top object-fit-cover" 
                    alt={event.title}
                    style={{ height: "200px" }}
                />
            </div>
            
            {/* CUERPO DE LA TARJETA */}
            <div className="card-body d-flex flex-column p-4">
                
                {/* Fecha */}
                <p className="mb-2 d-flex align-items-center fw-medium" style={{ color: "#ff523b", fontSize: "0.85rem" }}>
                    <CalendarDays size={16} className="me-2 flex-shrink-0" /> 
                    <span className="text-truncate">{formatDateTime(event.start_time, event.end_time)}</span>
                </p>
                
                {/* Título */}
                <h4 
                    className="card-title fw-bold mb-2 text-dark hover-text-orange transition-all text-truncate" 
                    style={{ cursor: "pointer" }}
                    onClick={onOpenModal}
                >
                    {event.title}
                </h4>
                
                {/* Ubicación */}
                <p className="card-text text-secondary mb-4 small d-flex align-items-center text-truncate">
                    <MapPin size={16} className="me-2 flex-shrink-0" /> 
                    <span className="text-truncate">{event.location_name || event.address || "Ubicación por confirmar"}</span>
                </p>
                
                {/* FILA INFERIOR: Precio y Botón (Alineados al fondo) */}
                <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                    
                    {/* Precio Dinámico */}
                    <div className="bg-light px-3 py-1 rounded-pill border">
                        <span className={`fw-bold fs-6 ${isFree ? 'text-success' : 'text-dark'}`}>
                            {isFree ? "Gratis" : `$${priceValue.toFixed(2)}`}
                        </span>
                    </div>

                    {/* Botón Detalles */}
                    <button 
                        onClick={onOpenModal} 
                        className="btn rounded-pill px-3 py-2 text-white fw-bold d-flex align-items-center gap-1 shadow-sm hover-scale"
                        style={{ background: orangeGradient, border: "none", fontSize: "0.9rem" }}
                    >
                        Detalles <ArrowRight size={16} />
                    </button>
                    
                </div>
            </div>

            {/* MICRO-CSS PARA EFECTOS HOVER */}
            <style>{`
                .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-scale:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important; }
                .hover-text-orange:hover { color: #ff523b !important; }
            `}</style>
        </div>
    );
};