import React from "react";
import { Link } from "react-router-dom";
import { Send, Heart } from "lucide-react";
import logo from "../assets/img/Logo Local Vibes 4k.png";
import "./Footer.css";

export const Footer = () => {
    return (
        <footer className="bg-white text-dark border-top pt-5 pb-3 mt-auto">
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
                        <p className="text-muted small mb-3" style={{ maxWidth: "300px" }}>
                            Conectando a Caracas con los mejores eventos locales, conciertos, teatro y experiencias únicas cerca de ti.
                        </p>
                    </div>

                    {/* COLUMNA 2: EXPLORA */}
                    <div className="col-6 col-lg-2">
                        <h6 className="fw-bold mb-3 text-dark">Explora</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/explorar?cat=musica" className="text-muted text-decoration-none">Música</Link></li>
                            <li><Link to="/explorar?cat=gastronomia" className="text-muted text-decoration-none">Gastronomía</Link></li>
                            <li><Link to="/explorar?cat=teatro" className="text-muted text-decoration-none">Teatro</Link></li>
                            <li><Link to="/explorar?cat=deportes" className="text-muted text-decoration-none">Deportes</Link></li>
                            <li><Link to="/explorar?cat=arte" className="text-muted text-decoration-none">Arte</Link></li>
                            <li><Link to="/explorar?cat=naturaleza" className="text-muted text-decoration-none">Naturaleza</Link></li>
                        </ul>
                    </div>

                    {/* COLUMNA 3: CONECTA (Con parámetros directos para las pestañas) */}
                    <div className="col-6 col-lg-2">
                        <h6 className="fw-bold mb-3 text-dark">Conecta</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li><Link to="/" className="text-muted text-decoration-none">Inicio</Link></li>
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

                {/* BARRA INFERIOR DE COPYRIGHT */}
                <div className="row align-items-center justify-content-between small text-muted">
                    <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <p className="mb-0">© 2026 Local Vibes. Creado con <Heart size={14} className="text-danger mx-1" fill="currentColor" /> para Venezuela.</p>
                    </div>
                    <div className="col-12 col-md-6 text-center text-md-end">
                        <div className="d-flex justify-content-center justify-content-md-end gap-3">
                            <span className="text-muted" style={{ cursor: "pointer" }}>Política de Privacidad</span>
                            <span className="text-muted" style={{ cursor: "pointer" }}>Términos de Servicio</span>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};