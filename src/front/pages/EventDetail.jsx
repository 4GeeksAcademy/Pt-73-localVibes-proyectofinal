import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/api/events/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Evento no encontrado");
                return res.json();
            })
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleAddFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para guardar este evento.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/favorites/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("¡Evento añadido a tus favoritos!");
            } else {
                setMessage(data.message || "Error al agregar a favoritos.");
            }
        } catch (error) {
            setMessage("Error al conectar con el servidor.");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container text-center py-5">
                <h3>El evento solicitado no existe.</h3>
                <Link to="/events" className="btn btn-primary mt-3">Volver a eventos</Link>
            </div>
        );
    }

    return (
        <div className="container py-4" style={{ maxWidth: "850px" }}>
            <Link to="/events" className="btn btn-outline-secondary btn-sm mb-3">
                ← Volver a Eventos
            </Link>

            {message && <div className="alert alert-info">{message}</div>}

            <div className="card shadow-sm border-0 overflow-hidden">
                <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000"} 
                    className="w-100" 
                    alt={event.title}
                    style={{ maxHeight: "380px", objectFit: "cover" }}
                />
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="fw-bold mb-0">{event.title}</h2>
                        <button onClick={handleAddFavorite} className="btn btn-outline-danger btn-sm">
                            ❤️ Guardar en Favoritos
                        </button>
                    </div>

                    <p className="text-muted mb-3">
                        📍 <strong>Lugar:</strong> {event.location_name || "Por confirmar"} — {event.address || ""}
                    </p>

                    {event.start_time && (
                        <p className="text-muted mb-3">
                            📅 <strong>Fecha:</strong> {new Date(event.start_time).toLocaleDateString()} a las {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}

                    <hr />
                    <h5 className="fw-bold">Descripción del Evento</h5>
                    <p className="text-secondary" style={{ lineHeight: "1.7" }}>
                        {event.description || "No hay descripción adicional para este evento."}
                    </p>

                    {event.latitude && event.longitude && (
                        <div className="alert alert-light border mt-4">
                            <strong>Coordenadas GPS:</strong> Latitud: {event.latitude}, Longitud: {event.longitude}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};