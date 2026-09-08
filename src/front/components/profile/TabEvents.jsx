import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Edit, Trash2, Clock, CheckCircle, ExternalLink } from "lucide-react";

export const TabEvents = () => {
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${backendUrl}/api/user/events`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMyEvents(data);
            }
        } catch (error) {
            console.error("Error cargando mis eventos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${backendUrl}/api/events/${eventId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            if (response.ok) {
                // Filtramos el evento eliminado del estado para que desaparezca al instante sin recargar la página
                setMyEvents(myEvents.filter(ev => ev.id !== eventId));
                alert("Evento eliminado con éxito.");
            } else {
                alert("Hubo un error al eliminar el evento.");
            }
        } catch (error) {
            console.error("Error eliminando evento:", error);
        }
    };

    const formatShortDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Lógica para saber si el evento ya pasó
    const getEventStatus = (startTime) => {
        const eventDate = new Date(startTime);
        const now = new Date();
        if (eventDate < now) {
            return { label: "Finalizado", color: "bg-secondary" };
        }
        return { label: "Activo", color: "bg-success" };
    };

    if (loading) return <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h2 className="fw-bold m-0" style={{ color: "#2b2b2b" }}>Mis Eventos</h2>
                <Link to="/create-event" className="btn rounded-pill text-white fw-medium shadow-sm hover-scale px-4" style={{ background: orangeGradient }}>
                    + Nuevo Evento
                </Link>
            </div>
            <p className="text-muted mb-4">Gestiona los eventos que has publicado en la plataforma.</p>

            {myEvents.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-5 text-center">
                    <CalendarDays size={48} className="text-muted mx-auto mb-3 opacity-50" />
                    <h5 className="fw-bold text-dark">Aún no has creado ningún evento</h5>
                    <p className="text-secondary mb-4">Anímate a publicar tu primera experiencia y compártela con el mundo.</p>
                    <div>
                        <Link to="/create-event" className="btn btn-outline-danger rounded-pill px-4 fw-medium">Crear mi primer evento</Link>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {myEvents.map(event => {
                        const status = getEventStatus(event.start_time);
                        const isFinished = status.label === "Finalizado";

                        return (
                            <div key={event.id} className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden hover-scale-slight transition-all">
                                <div className="row g-0 align-items-center">
                                    
                                    {/* Imagen (Miniatura) */}
                                    <div className="col-12 col-md-3">
                                        <div className="position-relative h-100">
                                            <img 
                                                src={event.imgs_event && event.imgs_event.length > 0 ? event.imgs_event[0] : (event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400")} 
                                                alt={event.title}
                                                className="img-fluid w-100 object-fit-cover"
                                                style={{ height: "100%", minHeight: "140px", filter: isFinished ? "grayscale(100%)" : "none" }}
                                            />
                                            <span className={`position-absolute top-0 start-0 m-2 badge rounded-pill ${status.color} shadow-sm`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Información */}
                                    <div className="col-12 col-md-6 p-3 p-md-4">
                                        <h5 className={`fw-bold mb-2 ${isFinished ? 'text-muted' : 'text-dark'}`}>{event.title}</h5>
                                        
                                        <div className="d-flex flex-column gap-1 text-muted small">
                                            <span className="d-flex align-items-center">
                                                <Clock size={14} className="me-2" /> {formatShortDate(event.start_time)}
                                            </span>
                                            <span className="d-flex align-items-center text-truncate">
                                                <MapPin size={14} className="me-2 flex-shrink-0" /> <span className="text-truncate">{event.location_name}</span>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Botones de Acción */}
                                    <div className="col-12 col-md-3 p-3 p-md-4 d-flex flex-row flex-md-column justify-content-end gap-2 border-start">
                                        {/* Botón Editar: Te llevará a una futura ruta /edit-event/:id */}
                                        <Link 
                                            to={`/edit-event/${event.id}`} 
                                            className="btn btn-light border rounded-pill d-flex align-items-center justify-content-center fw-medium text-secondary hover-bg-light w-100"
                                            style={{ fontSize: "0.85rem" }}
                                        >
                                            <Edit size={14} className="me-2" /> Editar
                                        </Link>
                                        
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="btn btn-outline-danger rounded-pill d-flex align-items-center justify-content-center fw-medium w-100"
                                            style={{ fontSize: "0.85rem" }}
                                        >
                                            <Trash2 size={14} className="me-2" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.05); }
                .hover-scale-slight { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-scale-slight:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                .hover-bg-light:hover { background-color: #f8f9fa !important; color: #ff523b !important; border-color: #ff523b !important; }
            `}</style>
        </div>
    );
};