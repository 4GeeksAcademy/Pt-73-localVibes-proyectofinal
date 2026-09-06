import React, { useState, useEffect } from "react";
import { ArrowLeft, Share2, Heart, MapPin, CalendarDays, Ticket, ExternalLink, ChevronLeft, ChevronRight, Mic } from "lucide-react";

export const EventModal = ({ event, categoryName, onClose, onFavoriteToggle }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        document.body.style.overflow = "hidden";
        
        const checkFavoriteStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${backendUrl}/api/favorites`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const favoritesList = await response.json();
                    const isAlreadySaved = favoritesList.some(fav => fav.event_id === event.id);
                    setIsFavorite(isAlreadySaved);
                }
            } catch (error) {
                console.error("Error verificando favoritos:", error);
            }
        };

        checkFavoriteStatus();
        
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [event.id]);

    if (!event) return null;

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

    const getDirectionsUrl = () => {
        if (event.latitude && event.longitude) {
            return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`;
        } else if (event.address) {
            return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.address)}`;
        } else {
            return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(event.location_name + ", Caracas, Venezuela")}`;
        }
    };

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token"); 
        if (!token) {
            alert("Debes iniciar sesión para guardar eventos en favoritos.");
            return;
        }

        setIsFavorite(!isFavorite);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const method = isFavorite ? "DELETE" : "POST";
            
            const response = await fetch(`${backendUrl}/api/favorites/${event.id}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error en servidor");
            if (onFavoriteToggle) onFavoriteToggle(event.id, !isFavorite);

        } catch (error) {
            console.error("Error:", error);
            setIsFavorite(isFavorite); 
            alert("Error de conexión.");
        }
    };

    const handleShare = async () => {
        try {
            const dummyLink = `${window.location.origin}/event/${event.id}`;
            await navigator.clipboard.writeText(dummyLink);
            alert(`¡Enlace de invitación copiado al portapapeles!\n\nLink: ${dummyLink}`);
        } catch (err) {
            alert("Oops, no se pudo copiar el enlace.");
        }
    };

    const priceValue = parseFloat(event.price);
    const isFree = isNaN(priceValue) || priceValue <= 0;
    
    const hasMultipleImages = event.imgs_event && event.imgs_event.length > 1;

    return (
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start py-4 animate__animated animate__fadeIn"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 1050, overflowY: "auto" }}
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-4 shadow-lg w-100 position-relative mb-4 animate__animated animate__zoomIn animate__faster" 
                style={{ maxWidth: "800px", cursor: "default" }}
                onClick={(e) => e.stopPropagation()} 
            >
                {/* HEADER BOTONES */}
                <div className="d-flex justify-content-between p-3 pb-0">
                    <button className="btn btn-light rounded-pill border fw-medium px-3 d-flex align-items-center hover-scale" onClick={onClose}>
                        <ArrowLeft size={18} className="me-2" /> Volver
                    </button>
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center hover-scale"
                            onClick={handleShare}
                            title="Compartir evento"
                        >
                            <Share2 size={18} />
                        </button>
                        <button 
                            className={`btn rounded-circle border p-2 d-flex align-items-center justify-content-center transition-all hover-scale ${isFavorite ? 'btn-danger text-white border-danger shadow-sm' : 'btn-light text-secondary'}`}
                            onClick={toggleFavorite}
                        >
                            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                {/* IMAGEN / CARRUSEL */}
                <div className="p-3">
                    <div className="position-relative w-100 rounded-4 overflow-hidden shadow-sm" style={{ height: "320px", backgroundColor: "#f8f9fa" }}>
                        
                        {hasMultipleImages ? (
                            <div id={`carousel-${event.id}`} className="carousel slide h-100" data-bs-ride="carousel">
                                <div className="carousel-inner h-100">
                                    {event.imgs_event.map((img, idx) => (
                                        <div key={idx} className={`carousel-item h-100 ${idx === 0 ? 'active' : ''}`}>
                                            <img src={img} className="w-100 h-100 object-fit-cover" alt={`${event.title} - ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${event.id}`} data-bs-slide="prev">
                                    <span className="bg-dark bg-opacity-50 rounded-circle p-2 d-flex justify-content-center align-items-center"><ChevronLeft size={24} color="white"/></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${event.id}`} data-bs-slide="next">
                                    <span className="bg-dark bg-opacity-50 rounded-circle p-2 d-flex justify-content-center align-items-center"><ChevronRight size={24} color="white"/></span>
                                </button>
                            </div>
                        ) : (
                            <img 
                                src={event.imgs_event && event.imgs_event.length > 0 ? event.imgs_event[0] : (event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000")} 
                                alt={event.title} 
                                className="w-100 h-100 object-fit-cover" 
                            />
                        )}

                        <span className="position-absolute bottom-0 start-0 m-3 badge rounded-pill px-3 py-2 text-uppercase shadow-sm" style={{ background: orangeGradient }}>
                            {categoryName || "Evento"}
                        </span>
                        
                        <span className="position-absolute bottom-0 end-0 m-3 badge bg-white text-dark border rounded-pill px-3 py-2 shadow-sm">
                            {event.capacity ? `Aforo: ${event.capacity} personas` : "Aforo: No especificado"}
                        </span>
                    </div>
                </div>

                <div className="px-4 pb-4 mt-2">
                    <h3 className="fw-bold mb-3 text-dark">{event.title}</h3>
                    
                    {/* INFO PRINCIPAL CON ICONOS */}
                    <div className="d-flex flex-column gap-2 text-muted mb-4">
                        <span className="d-flex align-items-center fw-medium" style={{ color: "#ff523b" }}>
                            <CalendarDays size={18} className="me-2" /> {formatDateTime(event.start_time, event.end_time)}
                        </span>
                        <span className="d-flex align-items-center text-secondary fw-medium">
                            <MapPin size={18} className="me-2" /> {event.location_name || "Caracas, Venezuela"}
                        </span>
                    </div>

                    {/* CUADRÍCULA DE DATOS PREMIUM */}
                    <div className="row row-cols-3 g-3 mb-4 text-center">
                        <div className="col">
                            <div className="card bg-light border-0 py-3 h-100 rounded-4 shadow-sm hover-scale">
                                <small className="text-secondary mb-1" style={{fontSize: "0.8rem"}}>Tipo de evento</small>
                                <strong className="small text-dark">{categoryName || "General"}</strong>
                            </div>
                        </div>
                        
                        <div className="col">
                            <div className="card bg-light border-0 py-3 h-100 rounded-4 shadow-sm hover-scale">
                                <small className="text-secondary mb-1" style={{fontSize: "0.8rem"}}>Precio</small>
                                <strong className={`small fw-bold ${isFree ? 'text-success' : 'text-dark'}`}>
                                    {isFree ? "Gratis" : `$${priceValue.toFixed(2)}`}
                                </strong>
                            </div>
                        </div>
                        
                        <div className="col">
                            <div className="card bg-light border-0 py-3 h-100 rounded-4 shadow-sm hover-scale px-1">
                                <small className="text-secondary mb-1" style={{fontSize: "0.8rem"}}>Organizador</small>
                                <strong className="small text-dark text-truncate px-2">
                                    {event.organizer?.name ? `${event.organizer.name} ${event.organizer.lastname || ''}` : "Local Vibes"}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="row g-3 mb-4">
                        {!isFree && (
                            <div className="col-12 col-md-6">
                                <button className="btn w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center text-white shadow-sm hover-scale" style={{ background: orangeGradient, border: "none" }}>
                                    <Ticket size={18} className="me-2" /> Comprar entradas
                                </button>
                            </div>
                        )}
                        
                        <div className={`col-12 ${isFree ? 'col-md-12' : 'col-md-6'}`}>
                            <button 
                                className={`btn w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center transition-all hover-scale shadow-sm ${isFavorite ? 'btn-danger text-white' : 'btn-light border text-secondary'}`}
                                onClick={toggleFavorite}
                            >
                                <Heart size={18} className="me-2" fill={isFavorite ? "currentColor" : "none"} />
                                {isFavorite ? "Guardado en favoritos" : "Guardar en favoritos"}
                            </button>
                        </div>
                    </div>

                    <hr className="text-light my-4" />

                    {/* DESCRIPCIÓN */}
                    <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                        <span style={{ width: "4px", height: "16px", background: orangeGradient, borderRadius: "2px", marginRight: "8px" }}></span>
                        Acerca del evento
                    </h6>
                    <p className="text-secondary small lh-lg" style={{ whiteSpace: "pre-line" }}>
                        {event.description || "Disfruta de una experiencia inolvidable. Este evento reúne lo mejor de la cultura y el entretenimiento local. Te esperamos para compartir momentos únicos."}
                    </p>

                    {/* 🔥 NUEVA SECCIÓN: INVITADOS ESPECIALES (CONDICIONAL) 🔥 */}
                    {event.guests && event.guests.length > 0 && (
                        <>
                            <h6 className="fw-bold mt-4 mb-3 d-flex align-items-center text-dark">
                                <span style={{ width: "4px", height: "16px", background: orangeGradient, borderRadius: "2px", marginRight: "8px" }}></span>
                                Invitados Especiales
                            </h6>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {event.guests.map((guest, index) => (
                                    <span 
                                        key={index} 
                                        className="badge bg-light text-dark border px-3 py-2 rounded-pill d-flex align-items-center shadow-sm fw-medium hover-scale"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        <Mic size={14} className="me-2 text-primary" />
                                        {guest}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}

                    {/* UBICACIÓN */}
                    <h6 className="fw-bold mt-5 mb-3 d-flex align-items-center text-dark">
                        <span style={{ width: "4px", height: "16px", background: orangeGradient, borderRadius: "2px", marginRight: "8px" }}></span>
                        Ubicación
                    </h6>
                    <div className="card bg-light border-0 rounded-4 p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center shadow-sm gap-3 hover-scale">
                        <div>
                            <div className="fw-bold text-dark">{event.location_name || "Lugar por confirmar"}</div>
                            <small className="text-secondary">{event.address || "Dirección no especificada"}</small>
                        </div>
                        <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-white border bg-white rounded-pill px-4 py-2 d-flex align-items-center flex-shrink-0 fw-medium shadow-sm text-dark text-decoration-none transition-all hover-scale">
                            Cómo llegar <ExternalLink size={16} className="ms-2 text-danger" />
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-scale:hover { transform: translateY(-2px); }
                /* Ajustes de Bootstrap Carousel */
                .carousel-control-prev, .carousel-control-next { opacity: 0.7; transition: opacity 0.2s; }
                .carousel-control-prev:hover, .carousel-control-next:hover { opacity: 1; }
            `}</style>
        </div>
    );
};