import React from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

export const EventListCard = ({ event, categoryName, onOpenModal }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    // Función actualizada para manejar Fecha, Hora de inicio y Hora de fin
    const formatDateTime = (start, end) => {
        if (!start) return "Fecha por confirmar";
        
        const startDate = new Date(start);
        const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        
        const formattedDate = startDate.toLocaleDateString('es-ES', optionsDate).replace(',', '');
        const startTimeStr = startDate.toLocaleTimeString('en-US', optionsTime);
        
        let endTimeStr = "";
        
        if (end) {
            // Si el backend envía el end_time como un formato completo de fecha (ISO):
            if (end.includes("T")) {
                const endDate = new Date(end);
                endTimeStr = ` - ${endDate.toLocaleTimeString('en-US', optionsTime)}`;
            } else {
                // Si el backend lo envía simplemente como hora "20:00" o "8:00 PM":
                endTimeStr = ` - ${end}`;
            }
        }

        return `${formattedDate} • ${startTimeStr}${endTimeStr}`;
    };

    const imageUrl = event.imgs_event && event.imgs_event.length > 0 
        ? event.imgs_event[0] 
        : (event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600");

    // Lógica BLINDADA para el precio: Forzamos la conversión a número
    const priceValue = parseFloat(event.price);
    const isFree = isNaN(priceValue) || priceValue <= 0;

    return (
        <div className="card flex-column flex-md-row border-0 shadow-sm mb-3 overflow-hidden transition-all hover-scale rounded-4" style={{ minHeight: "180px", backgroundColor: "#ffffff" }}>
            
            {/* IMAGEN */}
            <div 
                className="position-relative h-100" 
                style={{ width: "100%", flexBasis: "280px", flexShrink: 0, cursor: "pointer" }}
                onClick={() => onOpenModal(event)}
            >
                <span className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm" style={{ zIndex: 1, background: orangeGradient }}>
                    {categoryName || "Evento"}
                </span>
                <img 
                    src={imageUrl} 
                    alt={event.title}
                    className="h-100 w-100 object-fit-cover"
                    style={{ minHeight: "180px" }}
                />
            </div>

            {/* CUERPO DE LA TARJETA */}
            <div className="card-body d-flex flex-column justify-content-between p-4">
                
                {/* Fila Superior: Fecha y hora, Título, Ubicación */}
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                        <p className="mb-2 d-flex align-items-center fw-medium" style={{ color: "#ff523b", fontSize: "0.85rem" }}>
                            <CalendarDays size={16} className="me-2 flex-shrink-0" /> 
                            {formatDateTime(event.start_time, event.end_time)}
                        </p>
                        <h4 
                            className="fw-bold mb-2 text-dark text-decoration-none hover-text-orange transition-all" 
                            style={{ cursor: "pointer" }}
                            onClick={() => onOpenModal(event)}
                        >
                            {event.title}
                        </h4>
                        <p className="text-secondary mb-0 d-flex align-items-center" style={{ fontSize: "0.9rem" }}>
                            <MapPin size={16} className="me-2 flex-shrink-0" /> 
                            <span className="text-truncate">{event.location_name || event.address || "Ubicación por confirmar"}</span>
                        </p>
                    </div>
                </div>

                {/* Fila Inferior: Precio y Botón Detalles */}
                <div className="d-flex justify-content-between align-items-end mt-4">
                    
                    {/* PRECIO DINÁMICO */}
                    <div className="bg-light px-3 py-1 rounded-pill border">
                        <span className={`fw-bold fs-5 ${isFree ? 'text-success' : 'text-dark'}`}>
                            {isFree ? "Gratis" : `$${priceValue.toFixed(2)}`}
                        </span>
                    </div>

                    {/* Botón Detalles */}
                    <button 
                        className="btn rounded-pill px-4 py-2 text-white fw-bold d-flex align-items-center gap-2 shadow-sm" 
                        style={{ background: orangeGradient, border: "none" }}
                        onClick={() => onOpenModal(event)}
                    >
                        Ver detalles <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-scale:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important; }
                .hover-text-orange:hover { color: #ff523b !important; }
            `}</style>
        </div>
    );
};