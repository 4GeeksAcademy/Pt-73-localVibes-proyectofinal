import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import register from "../../images/register.jpg";
import fondo from "../../images/fondo_completo.jpg";

export const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        lastname: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                alert("Usuario registrado con éxito.");
                navigate("/login");
            } else {
                setError(data.message || "Error al registrar");
            }
        } catch (err) {
            setError("Error de conexión");
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

            {/* CAPA 3: Contenedor del Formulario (Tarjeta) */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden shadow-2xl" style={{ maxWidth: "1000px", width: "100%", zIndex: 1 }}>
                <div className="row g-0 align-items-stretch">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="col-md-6 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        <div className="mb-4 text-center text-md-start">
                            <h2 className="fw-bold mb-1 text-dark">Crear cuenta</h2>
                            <p className="text-muted small">Únete a LocalVibes y descubre lo mejor de tu ciudad.</p>
                        </div>

                        {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label fw-semibold small">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="Tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <label className="form-label fw-semibold small">Apellido</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        className="form-control form-control-lg bg-light border-0 fs-6"
                                        placeholder="Tu apellido"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Nombre de usuario</label>
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="usuario_vibes"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold small">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="correo@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold small">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control form-control-lg bg-light border-0 fs-6"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-check mb-4 small">
                                <input type="checkbox" className="form-check-input" id="termsCheck" required />
                                <label className="form-check-label text-muted" htmlFor="termsCheck">
                                    Acepto los <a href="#" className="text-decoration-none fw-bold" style={{ color: "#ef4444" }} data-bs-toggle="modal" data-bs-target="#termsModal">Términos y Condiciones</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-lg w-100 text-white rounded-3 mb-4 fs-6 fw-bold shadow-sm"
                                style={{ backgroundColor: "#ef4444", border: "none" }}
                            >
                                Registrarse
                            </button>

                            <div className="text-center">
                                <p className="text-muted small mb-0">
                                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#ef4444", fontWeight: "700", textDecoration: "none" }}>Inicia sesión</Link>
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Imagen decorativa */}
                    <div className="col-md-6 d-none d-md-block">
                        <div
                            className="h-100 w-100"
                            style={{
                                backgroundImage: `url(${register})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* MODAL DE TÉRMINOS */}
            <div className="modal fade" id="termsModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 bg-light">
                            <h5 className="modal-title fw-bold">Términos y Condiciones</h5>
                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body text-muted small px-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            <p className="fw-bold text-dark fs-6 mb-3">Términos y Condiciones de Uso - Local Vibes</p>

                            <p className="mb-3">
                                Bienvenid@ a <strong>Local Vibes</strong>. Al registrarte y utilizar nuestra plataforma digital, aceptas cumplir y quedar vinculado por los presentes Términos y Condiciones. Si no estás de acuerdo con alguna parte de estas normativas, te solicitamos que no completes tu registro.
                            </p>

                            <h6 className="fw-bold text-dark mt-3">1. Uso Correcto de la Plataforma</h6>
                            <p className="mb-2">
                                Te comprometes a utilizar Local Vibes de manera responsable, ética y exclusivamente para descubrir eventos, locales y experiencias culturales y de entretenimiento locales (con especial enfoque en Caracas y Venezuela). Queda terminantemente prohibido:
                            </p>
                            <ul className="mb-3">
                                <li>Publicar reseñas falsas, ofensivas, discriminatorias, violentas o que inciten al odio.</li>
                                <li>Suplantar la identidad de otra persona o entidad.</li>
                                <li>Intentar vulnerar la seguridad del sitio, realizar ataques informáticos o extraer información automatizada de forma masiva (scraping).</li>
                                <li>Utilizar la plataforma para promocionar actividades ilegales o estafas bajo la fachada de eventos públicos.</li>
                            </ul>

                            <h6 className="fw-bold text-dark mt-3">2. Cuentas de Usuario y Seguridad</h6>
                            <p className="mb-3">
                                Eres el único responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades que ocurran bajo tu cuenta. Nos reservamos el derecho de suspender o cancelar cuentas que infrinjan las normas de convivencia o utilicen datos falsos.
                            </p>

                            <h6 className="fw-bold text-dark mt-3">3. Limitación de Responsabilidad</h6>
                            <p className="mb-3">
                                Local Vibes actúa como un canal de difusión y facilitador de experiencias comunitarias. <strong>No nos hacemos responsables por cancelaciones, reprogramaciones, cambios de última hora en la programación, ni por las normativas internas o incidencias ocurridas en los locales o eventos registrados por terceros</strong> en la plataforma. Recomendamos verificar siempre directamente con los organizadores.
                            </p>

                            <h6 className="fw-bold text-dark mt-3">4. Propiedad Intelectual</h6>
                            <p className="mb-3">
                                Todos los elementos visuales, logotipos, diseño de interfaz, bases de datos y textos que componen Local Vibes son propiedad exclusiva de la plataforma o de sus colaboradores. Su reproducción total o parcial sin autorización previa está prohibida.
                            </p>

                            <h6 className="fw-bold text-dark mt-3">5. Modificaciones</h6>
                            <p className="mb-2">
                                Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento para adaptarlos a mejoras del servicio o cambios legales. El uso continuo de la plataforma constituirá tu aceptación de las normativas actualizadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};