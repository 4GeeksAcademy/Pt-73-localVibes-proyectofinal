import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const Footer = () => {
    // El mismo gradiente que hemos usado en toda la app para mantener la coherencia
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    return (
        <footer className="bg-white border-top pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row g-4 mb-4 justify-content-between">
                    
                    {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
                    <div className="col-12 col-lg-4">
                        <Link to="/" className="d-flex align-items-center text-decoration-none mb-3">
                            <div 
                                className="d-flex align-items-center justify-content-center text-white fw-bold me-2 rounded"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    background: orangeGradient,
                                    fontSize: "1.2rem",
                                    boxShadow: "0 4px 10px rgba(255, 122, 0, 0.3)"
                                }}
                            >
                                LV
                            </div>
                            <span className="fs-4 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>
                                local<span style={{ color: "#ff523b" }}>vibes</span>.
                            </span>
                        </Link>
                        <p className="text-muted small mb-3 lh-lg" style={{ maxWidth: "320px" }}>
                            Conectando a Caracas con los mejores eventos locales, conciertos, teatro y experiencias únicas cerca de ti. Tu ciudad, a un clic de distancia.
                        </p>
                    </div>

                    {/* COLUMNA 2: EXPLORA CATEGORÍAS */}
                    <div className="col-6 col-md-4 col-lg-2">
                        <h6 className="fw-bold mb-4 text-dark text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>Explora</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small">
                            <li><Link to="/events" className="text-muted text-decoration-none transition-all hover-text-orange">Todos los eventos</Link></li>
                            <li><Link to="/events?category=musica" className="text-muted text-decoration-none transition-all hover-text-orange">Música y Conciertos</Link></li>
                            <li><Link to="/events?category=teatro" className="text-muted text-decoration-none transition-all hover-text-orange">Teatro y Arte</Link></li>
                            <li><Link to="/events?category=gastronomia" className="text-muted text-decoration-none transition-all hover-text-orange">Gastronomía</Link></li>
                            <li><Link to="/events?category=deportes" className="text-muted text-decoration-none transition-all hover-text-orange">Deportes</Link></li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: MI CUENTA */}
                    <div className="col-6 col-md-4 col-lg-2">
                        <h6 className="fw-bold mb-4 text-dark text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>Mi Cuenta</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small">
                            <li><Link to="/login" className="text-muted text-decoration-none transition-all hover-text-orange">Iniciar Sesión</Link></li>
                            <li><Link to="/profile?tab=dashboard" className="text-muted text-decoration-none transition-all hover-text-orange">Mi Panel</Link></li>
                            <li><Link to="/profile?tab=tickets" className="text-muted text-decoration-none transition-all hover-text-orange">Mis Entradas</Link></li>
                            <li><Link to="/profile?tab=events" className="text-muted text-decoration-none transition-all hover-text-orange">Gestionar Eventos</Link></li>
                            <li><Link to="/create-event" className="text-muted text-decoration-none transition-all hover-text-orange">Publicar un Evento</Link></li>
                        </ul>
                    </div>

                    {/* COLUMNA 4: SOPORTE Y LEGAL */}
                    <div className="col-12 col-md-4 col-lg-2">
                        <h6 className="fw-bold mb-4 text-dark text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px" }}>Soporte</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 small">
                            <li><span className="text-muted text-decoration-none cursor-pointer transition-all hover-text-orange">Centro de Ayuda</span></li>
                            <li><span className="text-muted text-decoration-none cursor-pointer transition-all hover-text-orange">Contacto</span></li>
                            <li><span className="text-muted text-decoration-none cursor-pointer transition-all hover-text-orange">Política de Privacidad</span></li>
                            <li><span className="text-muted text-decoration-none cursor-pointer transition-all hover-text-orange">Términos de Servicio</span></li>
                        </ul>
                    </div>

                </div>

                <hr className="text-muted opacity-25 my-4" />

                {/* BARRA INFERIOR DE COPYRIGHT CON EASTER EGG */}
                <div className="row align-items-center justify-content-between small text-muted">
                    <div className="col-12 text-center">
                        <p className="mb-0 d-flex align-items-center justify-content-center fw-medium">
                            © {new Date().getFullYear()} Local Vibes. Creado con 
                            <span 
                                className="mx-1 d-inline-block hover-scale" 
                                title="Desarrollado con pasión por Robert, María y Edgar 🚀"
                                style={{ cursor: "help" }}
                            >
                                <Heart size={16} className="text-danger" fill="currentColor" />
                            </span> 
                            para Venezuela.
                        </p>
                    </div>
                </div>

            </div>

            <style>{`
                .hover-text-orange:hover { color: #ff523b !important; padding-left: 5px; }
                .cursor-pointer { cursor: pointer; }
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.2); }
            `}</style>
        </footer>
    );
};