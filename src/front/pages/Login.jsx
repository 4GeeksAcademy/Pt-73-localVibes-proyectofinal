import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../../images/login.jpg"; // Renombrado para evitar conflicto con el componente
import fondo from "../../images/fondo_completo.jpg";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/profile");
            } else {
                setError(data.message || "Credenciales inválidas");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-3 p-md-5">
            
            {/* CAPA 1: Imagen de fondo total (FIXED) */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundImage: `url(${fondo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: -2,
                }}
            ></div>

            {/* CAPA 2: Filtro Blur y Degradado total (FIXED) */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 100%)",
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    zIndex: -1,
                }}
            ></div>

            {/* CAPA 3: Tarjeta de Iniciar Sesión */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "900px", width: "100%", zIndex: 1 }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-sm-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4">
                            <h3 className="fw-bold mb-2 text-dark">Iniciar sesión</h3>
                            <p className="text-muted small">Descubre y conecta con los mejores eventos de la ciudad.</p>
                        </div>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Input Correo */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control form-control-lg bg-light border-0 fs-6 shadow-sm"
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Input Contraseña */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-dark">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg bg-light border-0 fs-6 shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Opciones de cuenta */}
                            <div className="d-flex justify-content-between align-items-center mb-4 small">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input shadow-none" id="rememberMe" />
                                    <label className="form-check-label text-muted" htmlFor="rememberMe">Recuérdame</label>
                                </div>
                                <a href="#" className="text-decoration-none fw-bold" style={{ color: "#ef4444" }}>¿Olvidaste tu contraseña?</a>
                            </div>

                            {/* Botón Principal */}
                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-4 fs-6 fw-bold shadow-sm"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                            >
                                Iniciar sesión
                            </button>

                            {/* Enlace de Registro */}
                            <div className="text-center">
                                <p className="text-muted small mb-0">
                                    ¿No tienes cuenta? <Link to="/signup" style={{ color: "#ef4444", fontWeight: "700", textDecoration: "none" }}>Regístrate</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen secundaria decorativa */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${loginImg})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                minHeight: "100%"
                            }}
                        >
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};