import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

import logo from "../assets/img/Logo Local Vibes 4k.png";

export const Navbar = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [favoritesCount, setFavoritesCount] = useState(0);

    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    const brandColor = "#ff523b"; 

    const loadUserData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            setFavoritesCount(0);
            return;
        }

        try {
            const profileRes = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });
            
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                setUser(profileData);
            } else {
                throw new Error("Token inválido");
            }

            const statsRes = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/dashboard-stats", {
                method: "GET",
                headers: { Authorization: "Bearer " + token }
            });
            
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setFavoritesCount(statsData.saved_favorites || 0);
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
            localStorage.removeItem("token");
            setUser(null);
            setFavoritesCount(0);
        }
    };

    useEffect(() => {
        loadUserData();
        const handleAuthChange = () => loadUserData();
        window.addEventListener("loginStatusChanged", handleAuthChange);
        return () => window.removeEventListener("loginStatusChanged", handleAuthChange);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <nav 
            className="navbar navbar-expand-lg bg-white position-fixed top-0 w-100" 
            style={{ 
                zIndex: 1050, 
                height: "80px",
                borderBottom: "1px solid #f1f5f9",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
            }}
        >
            <div className="container px-4 h-100 position-relative d-flex align-items-center justify-content-between">
                
                {/* LOGO (Izquierda) */}
                <Link to="/" className="navbar-brand d-flex align-items-center me-0 h-100">
                    <img
                        src={logo}
                        alt="Local Vibes"
                        style={{ width: "150px", objectFit: "contain" }}
                    />
                </Link>

                {/* BOTÓN MÓVIL */}
                <button 
                    className="navbar-toggler border-0 shadow-none" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse h-100 w-100" id="navbarContent">
                    
                    {/* ENLACES CENTRALES (Perfectamente centrados en pantalla) */}
                    <ul className="navbar-nav navbar-center-links h-100 align-items-center gap-2 gap-lg-4 text-center mt-3 mt-lg-0 bg-white">
                        
                        <li className="nav-item h-100 d-flex align-items-center">
                            <Link to="/" className={`nav-link custom-nav-link ${isActive('/') ? 'active' : ''}`}>
                                Inicio
                            </Link>
                        </li>
                        
                        <li className="nav-item h-100 d-flex align-items-center">
                            <Link to="/events" className={`nav-link custom-nav-link ${isActive('/events') ? 'active' : ''}`}>
                                Explorar
                            </Link>
                        </li>
                        
                        <li className="nav-item h-100 d-flex align-items-center position-relative">
                            <Link to="/map" className={`nav-link custom-nav-link ${isActive('/map') ? 'active' : ''}`}>
                                Mapa
                            </Link>
                        </li>

                        {/* FAVORITOS */}
                        {user && (
                            <li className="nav-item h-100 d-flex align-items-center position-relative">
                                <Link to="/favorites" className={`nav-link custom-nav-link ${isActive('/favorites') ? 'active' : ''} d-flex align-items-center gap-2`}>
                                    Favoritos
                                    {favoritesCount > 0 && (
                                        <span className="badge rounded-pill text-white" style={{ background: orangeGradient, fontSize: "0.65rem", padding: "3px 7px" }}>
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* PERFIL (Derecha) */}
                    <div className="d-flex justify-content-center align-items-center ms-lg-auto mt-3 mt-lg-0 pb-3 pb-lg-0">
                        {user ? (
                            <Link 
                                to="/profile" 
                                className="d-flex align-items-center gap-2 p-1 pe-4 rounded-pill text-decoration-none transition-transform hover-scale bg-white"
                                style={{ border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}
                            >
                                {/* 🌟 AVATAR CON EFECTO GLOW PREMIUM 🌟 */}
                                <img
                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt={user.name}
                                    className="rounded-circle object-fit-cover avatar-glow bg-white"
                                    style={{ width: "40px", height: "40px" }}
                                />
                                {/* NOMBRE COMPLETO */}
                                <span className="fw-bold text-dark fs-6 text-truncate" style={{ maxWidth: "160px" }}>
                                    {user.name} {user.lastname}
                                </span>
                            </Link>
                        ) : (
                            <Link 
                                to="/login" 
                                className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 text-white fw-bold shadow-sm hover-scale"
                                style={{ background: orangeGradient, border: "none" }}
                            >
                                <LogIn size={18} /> Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            
            <style>{`
                body { padding-top: 80px; } 

                /* Centrado perfecto y absoluto de los botones solo en pantallas grandes */
                @media (min-width: 992px) {
                    .navbar-center-links {
                        position: absolute !important;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }

                /* Efecto Glow (Brillo) del Avatar estilo Premium */
                .avatar-glow {
                    border: 2px solid ${brandColor};
                    padding: 2px; /* Espacio blanco entre la foto y el borde */
                    box-shadow: 0px 0px 10px rgba(255, 82, 59, 0.4);
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                }

                .hover-scale:hover .avatar-glow {
                    box-shadow: 0px 0px 15px rgba(255, 82, 59, 0.7);
                }

                /* Estilo de los Enlaces (Animación) */
                .custom-nav-link {
                    position: relative;
                    color: #64748b !important;
                    font-weight: 500;
                    font-size: 1.05rem;
                    padding: 0.5rem 0.5rem !important;
                    transition: color 0.3s ease;
                }

                .custom-nav-link:hover {
                    color: #0f172a !important;
                }

                .custom-nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -5px; 
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 3px; 
                    background-color: ${brandColor};
                    border-radius: 4px;
                    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    opacity: 0;
                }

                .custom-nav-link.active {
                    color: ${brandColor} !important;
                    font-weight: 700;
                }

                .custom-nav-link.active::after {
                    width: 80%; 
                    opacity: 1;
                    box-shadow: 0px 2px 8px rgba(255, 82, 59, 0.4); 
                }

                .custom-nav-link:hover::after {
                    width: 50%;
                    opacity: 0.5;
                    background-color: #cbd5e1; 
                    box-shadow: none;
                }

                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.03); }

                @media (max-width: 991px) {
                    .navbar-collapse {
                        background-color: white;
                        position: absolute;
                        top: 80px;
                        left: 0;
                        width: 100%;
                        padding: 1rem;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                        border-top: 1px solid #f1f5f9;
                    }
                    .custom-nav-link::after {
                        bottom: 0px; 
                    }
                }
            `}</style>
        </nav>
    );
};