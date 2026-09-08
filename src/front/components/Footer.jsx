import React from "react";
import { Link } from "react-router-dom";
import { Send, Heart } from "lucide-react";
import logo from "../assets/img/Logo Local Vibes 4k.png";
import "./Footer.css";

export const Footer = () => {
    // El mismo gradiente que hemos usado en toda la app para mantener la coherencia
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    return (
        <footer className="bg-white border-top pt-5 pb-4 mt-auto">
            <div className="container">
                <div className="row g-4 mb-4">

                    {/* COLUMNA 1: LOGO Y DESCRIPCIÓN */}
                    <div className="col-12 col-lg-4">
                        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
                            <img
                                src={logo}
                                alt="Local Vibes"
                                className="footer-logo"
                            />
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

                    {/* COLUMNA 3: CONECTA (Con parámetros directos para las pestañas) */}
                    <div className="col-6 col-lg-2">
                        <h6 className="fw-bold mb-3 text-dark">Conecta</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/mapa" className="text-muted text-decoration-none">Mapa Interactivo</Link></li>
                            <li><Link to="/profile" className="text-muted text-decoration-none">Mi Perfil</Link></li>
                            <li><Link to="/profile?tab=entradas" className="text-muted text-decoration-none">Mis Entradas</Link></li>
                            <li><Link to="/profile?tab=crear-evento" className="text-muted text-decoration-none">Crear Evento</Link></li>
                        </ul>
                    </div>

                    {/* COLUMNA 4: NEWSLETTER */}
                    <div className="col-12 col-lg-4">
                        <h6 className="fw-bold mb-3 text-dark">Suscríbete al boletín</h6>
                        <p className="text-muted small mb-3">Recibe las mejores recomendaciones de planes en Caracas cada fin de semana.</p>
                        <form onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte!"); }} className="d-flex gap-2">
                            <input
                                type="email"
                                className="form-control rounded-pill bg-light border-0 px-3 shadow-none"
                                placeholder="Tu correo electrónico..."
                                required
                            />
                            <button type="submit" className="btn btn-danger rounded-pill px-4 d-flex align-items-center justify-content-center">
                                <Send size={16} />
                            </button>
                        </form>
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