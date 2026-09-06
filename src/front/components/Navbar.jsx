import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/img/Logo Local Vibes 4k.png";

export const Navbar = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);

    // Cantidades sincronizadas
    const favoritesCount = 2;
    const ticketsCount = 3;

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token
                }
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Error en token");
                    return res.json();
                })
                .then((data) => setUser(data))
                .catch((err) => console.error("Error cargando perfil en Navbar:", err));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <nav className="custom-navbar" style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, background: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            {/* LOGO */}
            <Link to="/" className="navbar-logo" style={{ textDecoration: "none" }}>
                <img
                    src={logo}
                    alt="Local Vibes"
                    className="navbar-logo-img"
                />
            </Link>

            {/* ENLACES CENTRALES */}
            <div className="navbar-links">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <span className="nav-text">Inicio</span>
                    {location.pathname === '/' && <div className="active-line"></div>}
                </Link>
                <Link to="/explorar" className={`nav-item ${location.pathname === '/explorar' ? 'active' : ''}`}>
                    <span className="nav-text">Explorar</span>
                    {location.pathname === '/explorar' && <div className="active-line"></div>}
                </Link>
                <Link to="/map" className="nav-item" style={{ textDecoration: 'none' }}>
                    <span className="nav-text">Mapa</span>
                    <span className="badge badge-orange">Interactivo</span>
                </Link>

                {/* FAVORITOS CONTEO SINCRONIZADO */}
                <Link to="/profile?tab=favoritos" className="nav-item" style={{ textDecoration: 'none' }}>
                    <span className="nav-text">Favoritos</span>
                    <span className="badge badge-pink">{favoritesCount}</span>
                </Link>

                {/* MIS ENTRADAS CONTEO SINCRONIZADO */}
                <Link to="/profile?tab=entradas" className="nav-item" style={{ textDecoration: 'none' }}>
                    <span className="nav-text">Mis entradas</span>
                    <span className="badge badge-pink">{ticketsCount}</span>
                </Link>
            </div>

            {/* ACCIONES Y PERFIL */}
            <div className="navbar-actions">
                <button className="action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
                <button className="action-btn bell-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                    <span className="notification-dot"></span>
                </button>

                {/* PERFIL DE USUARIO DINÁMICO */}
                {user ? (
                    <Link to="/profile" className="user-profile" style={{ textDecoration: 'none' }}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Invitado'}&background=random`}
                            alt={user?.name || "Usuario"}
                            className="user-avatar"
                        />
                        <span className="user-name">
                            {user ? `${user.name} ${user.lastname || ''}`.trim() : ""}
                        </span>
                    </Link>
                ) : (
                    <div className="d-flex align-items-center gap-2">
                        <Link to="/login" className="btn btn-outline-dark btn-sm rounded-pill px-3">Iniciar sesión</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};