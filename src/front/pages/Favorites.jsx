import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { EventModal } from "../components/EventModal";

// Iconos de Lucide
import { Heart, Compass, AlertCircle } from "lucide-react";

export const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para el Modal
    const [selectedEvent, setSelectedEvent] = useState(null);

    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Degradado premium 
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            setError("Debes iniciar sesión para ver tus favoritos.");
            setLoading(false);
            return;
        }

        // Hacemos fetch a las categorías y a los favoritos al mismo tiempo
        Promise.all([
            fetch(`${backendUrl}/api/categories`).then(res => res.json()),
            fetch(`${backendUrl}/api/favorites`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (!res.ok) throw new Error("Error al cargar favoritos");
                return res.json();
            })
        ])
        .then(([catsData, favsData]) => {
            setCategories(catsData);
            
            // Extraemos los datos del evento anidado
            const formattedFavorites = favsData.map(fav => fav.event ? fav.event : fav);
            
            setFavorites(formattedFavorites);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError("Hubo un problema al cargar tu lista de favoritos.");
            setLoading(false);
        });
    }, [backendUrl]);

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id.toString() === id.toString());
        return cat ? cat.name : "Evento";
    };

    return (
        <div className="container-fluid px-0 bg-white" style={{ minHeight: "100vh" }}>
            <div className="container py-5">
                
                {/* HEADER DE LA PÁGINA */}
                <div className="d-flex flex-column flex-md-row align-items-md-center mb-5 gap-3">
                    <div 
                        className="p-3 rounded-circle d-inline-flex text-white shadow-sm flex-shrink-0"
                        style={{ background: orangeGradient, width: "60px", height: "60px", justifyContent: "center", alignItems: "center" }}
                    >
                        <Heart size={28} fill="currentColor" />
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Mis Favoritos</h2>
                        <p className="text-muted mb-0">
                            Aquí están todos los eventos que has guardado. ¡No te quedes sin tu entrada!
                        </p>
                    </div>
                </div>

                {/* ESTADOS: Cargando, Error, Vacío */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status"></div>
                        <p className="text-muted mt-3">Cargando tus eventos...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-5 bg-light rounded-4 border shadow-sm">
                        <AlertCircle size={48} className="text-danger mb-3" />
                        <h4 className="fw-bold">¡Ups!</h4>
                        <p className="text-secondary mb-4">{error}</p>
                        <button onClick={() => navigate("/login")} className="btn btn-danger rounded-pill px-4 fw-medium">
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                ) : favorites.length === 0 ? (
                    /* ESTADO VACÍO (Empty State) */
                    <div className="text-center py-5 bg-light rounded-4 border border-light shadow-sm">
                        <Heart size={56} className="text-muted mb-3 opacity-50" />
                        <h4 className="fw-bold text-dark">Aún no tienes favoritos</h4>
                        <p className="text-secondary mb-4">
                            Explora nuestra cartelera y dale al corazón en los eventos que más te gusten.
                        </p>
                        <Link to="/events" className="btn text-white rounded-pill px-4 py-2 fw-medium shadow-sm d-inline-flex align-items-center" style={{ background: orangeGradient }}>
                            <Compass size={18} className="me-2" /> Explorar eventos
                        </Link>
                    </div>
                ) : (
                    /* CUADRÍCULA DE EVENTOS FAVORITOS */
                    <div className="row g-4">
                        {favorites.map((event) => {
                            const categoryName = getCategoryName(event.category_id);
                            
                            return (
                                <div key={event.id} className="col-12 col-md-6 col-lg-3">
                                    <EventCard 
                                        event={{...event, categoryName}} 
                                        onOpenModal={() => setSelectedEvent({...event, categoryName})}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* RENDERIZADO DEL MODAL CON COMUNICACIÓN EN TIEMPO REAL */}
                {selectedEvent && (
                    <EventModal 
                        event={selectedEvent} 
                        categoryName={selectedEvent.categoryName || getCategoryName(selectedEvent.category_id)} 
                        onClose={() => setSelectedEvent(null)} 
                        
                        // Esta es la función que borra la tarjeta si desmarcas el corazón
                        onFavoriteToggle={(eventId, isNowFavorite) => {
                            if (!isNowFavorite) {
                                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== eventId));
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};