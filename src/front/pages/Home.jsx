import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../components/EventCard";
import { EventModal } from "../components/EventModal";

// Iconos de Lucide React
import {
    MapPin,
    Music,
    Utensils,
    Drama,
    Trophy,
    Palette,
    Leaf,
    Cpu
} from "lucide-react";

export const Home = () => {
    const [categories, setCategories] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [selectedEvent, setSelectedEvent] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Degradado naranja oscuro
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        Promise.all([
            fetch(`${backendUrl}/api/categories`).then(res => res.json()),
            fetch(`${backendUrl}/api/events`).then(res => res.json())
        ])
        .then(([catsData, eventsData]) => {
            setCategories(catsData);
            setAllEvents(eventsData);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error cargando datos:", err);
            setLoading(false);
        });
    }, [backendUrl]);

    const getCategoryIcon = (catName) => {
        const name = catName?.toLowerCase() || "";
        if (name.includes("música") || name.includes("music")) return <Music size={24} />;
        if (name.includes("tecnología") || name.includes("tech")) return <Cpu size={24} />;
        if (name.includes("deporte")) return <Trophy size={24} />;
        if (name.includes("gastronomía") || name.includes("food")) return <Utensils size={24} />;
        if (name.includes("arte") || name.includes("cultura")) return <Palette size={24} />;
        if (name.includes("teatro")) return <Drama size={24} />;
        return <Leaf size={24} />;
    };

    const featuredEvents = allEvents.slice(0, 4);

    return (
        <div className="container-fluid px-0 bg-white" style={{ minHeight: "100vh" }}>
            
            {/* =================================================
                HERO
            ================================================= */}
            <section className="container mt-4 mb-5">
                <div className="row align-items-center g-4">
                    
                    {/* TEXTO */}
                    <div className="col-12 col-lg-6 pe-lg-5 d-flex flex-column justify-content-center align-items-start">
                        
                        {/* ETIQUETA "EVENTOS" */}
                        <div 
                            className="rounded-pill mb-4 d-inline-flex align-items-center shadow-sm" 
                            style={{ 
                                background: orangeGradient, 
                                color: "white", 
                                padding: "8px 20px" 
                            }}
                        >
                            <MapPin size={18} className="me-2" />
                            <span className="fs-6 fw-bold text-uppercase" style={{ letterSpacing: "1px" }}>
                                Eventos
                            </span>
                        </div>

                        {/* TÍTULO CON TEXTO EN DEGRADADO ARREGLADO */}
                        <h1 className="display-4 fw-bold mb-4" style={{ color: "#2b2b2b", lineHeight: "1.2" }}>
                            Encuentra los <br className="d-none d-lg-block" />
                            mejores <span style={{
                                backgroundImage: orangeGradient,
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                                display: "inline" 
                            }}>eventos</span> <br className="d-none d-lg-block" />
                            en Caracas
                        </h1>

                        {/* DESCRIPCIÓN */}
                        <p className="text-muted fs-5 mb-0" style={{ lineHeight: "1.6" }}>
                            Conciertos, teatro, gastronomía y experiencias... encuentra lo que justo está pasando cerca de ti.
                        </p>
                        
                    </div>

                    {/* IMAGEN HERO */}
                    <div className="col-12 col-lg-6">
                        <div
                            className="hero-image rounded-4 w-100 shadow-sm"
                            style={{
                                height: "420px",
                                backgroundImage: "url(https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80)", 
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* =================================================
                CATEGORÍAS (Ahora centradas)
            ================================================= */}
            <section className="container mb-5">
                {/* Título centrado */}
                <h4 className="fw-bold mb-4 text-center">Explora por categorías</h4>
                
                {loading ? (
                    <div className="text-center py-4"><span className="spinner-border text-danger"></span></div>
                ) : (
                    <div className="row g-3 justify-content-center">
                        {categories.map((category) => {
                            const eventCount = allEvents.filter(ev => ev.category_id === category.id).length;
                            
                            return (
                                <div key={category.id} className="col-6 col-md-4 col-lg-2">
                                    <div className="card text-center border-0 shadow-sm rounded-4 py-4 h-100">
                                        <div className="mb-3 d-flex justify-content-center">
                                            <div 
                                                className="p-3 rounded-circle d-inline-flex text-white shadow-sm"
                                                style={{ background: orangeGradient }}
                                            >
                                                {getCategoryIcon(category.name)}
                                            </div>
                                        </div>
                                        <h6 className="fw-bold mb-1">{category.name}</h6>
                                        <small className="text-muted">
                                            {eventCount} {eventCount === 1 ? "evento" : "eventos"}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* =================================================
                EVENTOS DESTACADOS
            ================================================= */}
            <section className="container mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Eventos destacados</h4>
                    <Link to="/events" className="text-danger text-decoration-none fw-semibold">
                        Ver más
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-4"><span className="spinner-border text-danger"></span></div>
                ) : (
                    <div className="row g-4">
                        {featuredEvents.map((event) => {
                            const categoryName = categories.find(c => c.id === event.category_id)?.name || "Evento";
                            
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
            </section>

            {/* RENDERIZADO DEL MODAL */}
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent} 
                    categoryName={selectedEvent.categoryName} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
};