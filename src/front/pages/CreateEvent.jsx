import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LocationPicker } from "../components/LocationPicker";
import { ImageUpload } from "../components/ImageUpload";
import { ImagePlus, Calendar, Info, MapPin, Phone } from "lucide-react";

export const CreateEvent = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Verificar si hay sesión iniciada
    const isAuthenticated = !!localStorage.getItem("token");

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);

    // 1. CAMBIO AQUÍ: Cambiamos image_url por image_urls como un arreglo vacío []
    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        start_time: "",
        end_time: "",
        description: "",
        image_urls: [], 
        location_name: "", 
        address: "",       
        latitude: null,
        longitude: null,
        contact_phone: "" 
    });

    // Bloquear el scroll de la página si no está logueado
    useEffect(() => {
        if (!isAuthenticated) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isAuthenticated]);

    useEffect(() => {
        fetch(`${backendUrl}/api/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error cargando categorías:", err));
    }, [backendUrl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLocationSelect = (locationData) => {
        setFormData({
            ...formData,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            address: locationData.address
        });
    };

    // 2. CAMBIO AQUÍ: Actualizamos la función para que reciba el array de URLs y actualice image_urls
    const handleImagesUploaded = (urls) => {
        setFormData({ ...formData, image_urls: urls });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        // Verificación visual de Bootstrap
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setError("Por favor, revisa los campos en rojo y completa la información correctamente.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        
        // Verificación de ubicación en el mapa
        if (!formData.latitude || !formData.longitude) {
            setValidated(true);
            setError("Debes seleccionar la ubicación del evento en el mapa.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setValidated(true);
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${backendUrl}/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Evento creado con éxito!");
                navigate("/events");
            } else {
                setError(data.message || "Error al crear el evento");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-relative w-100 bg-light min-vh-100 py-5">
            
            {!isAuthenticated && (
                <div 
                    className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column justify-content-center align-items-center" 
                    style={{ zIndex: 1050, backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}
                >
                    <div className="bg-white p-5 rounded-4 shadow-lg text-center mx-3 border" style={{ maxWidth: "450px" }}>
                        <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 shadow" style={{ width: "80px", height: "80px" }}>
                            <Calendar size={40} />
                        </div>
                        <h3 className="fw-bold mb-3">¡Comparte tu evento!</h3>
                        <p className="text-muted mb-4">
                            Para mantener nuestra comunidad segura, necesitas tener una cuenta para poder publicar eventos en el mapa.
                        </p>
                        <div className="d-flex flex-column gap-3">
                            <Link to="/signup" className="btn btn-danger btn-lg rounded-pill fw-medium shadow-sm">
                                Registrarse gratis
                            </Link>
                            <Link to="/login" className="btn btn-light border btn-lg rounded-pill fw-medium text-dark">
                                Ya tengo una cuenta
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div 
                className="container" 
                style={{ 
                    maxWidth: "900px", 
                    filter: !isAuthenticated ? "blur(4px)" : "none",
                    pointerEvents: !isAuthenticated ? "none" : "auto",
                    userSelect: !isAuthenticated ? "none" : "auto"
                }}
            >
                <div className="mb-4 text-center">
                    <h2 className="fw-bold">Publicar Nuevo Evento</h2>
                    <p className="text-muted">Completa los detalles para que la comunidad descubra tu evento.</p>
                </div>

                {error && <div className="alert alert-danger rounded-4 shadow-sm border-0"><Info size={18} className="me-2"/>{error}</div>}

                <form onSubmit={handleSubmit} className={`row g-4 needs-validation ${validated ? 'was-validated' : ''}`} noValidate>
                    
                    <div className="col-12 col-lg-7">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h5 className="fw-bold d-flex align-items-center mb-4">
                                <Info size={20} className="me-2 text-danger" /> Información Básica
                            </h5>
                            
                            <div className="mb-3">
                                <label className="form-label fw-medium">Nombre del Evento <span className="text-danger">*</span></label>
                                <input type="text" name="title" className="form-control bg-light border-0 py-2" value={formData.title} onChange={handleChange} required placeholder="Ej: Concierto Sinfónico, Torneo de Pádel..." />
                                <div className="invalid-feedback">El nombre del evento es obligatorio.</div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Categoría <span className="text-danger">*</span></label>
                                    <select name="category_id" className="form-select bg-light border-0 py-2" value={formData.category_id} onChange={handleChange} required>
                                        <option value="">Selecciona una...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                    <div className="invalid-feedback">Selecciona una categoría.</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Lugar de referencia <span className="text-danger">*</span></label>
                                    <input type="text" name="location_name" className="form-control bg-light border-0 py-2" value={formData.location_name} onChange={handleChange} required placeholder="Ej: Plaza Altamira" />
                                    <div className="invalid-feedback">Indica el nombre del lugar.</div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Descripción del Evento <span className="text-danger">*</span></label>
                                <textarea 
                                    name="description" 
                                    className="form-control bg-light border-0 py-2" 
                                    rows="4" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                    minLength="50"
                                    placeholder="Detalla de qué trata el evento... (Mínimo 50 caracteres)"
                                ></textarea>
                                <div className={`mt-1 small fw-medium text-end ${formData.description.length > 0 && formData.description.length < 50 ? 'text-danger' : 'text-muted'}`}>
                                    {formData.description.length} / 50 caracteres mínimos
                                </div>
                                <div className="invalid-feedback">La descripción debe tener al menos 50 caracteres.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Número de Contacto (Opcional)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light border-0"><Phone size={18} className="text-muted"/></span>
                                    <input type="tel" name="contact_phone" className="form-control bg-light border-0 py-2" value={formData.contact_phone} onChange={handleChange} placeholder="Ej: +58 412 123 4567" />
                                </div>
                            </div>

                            {/* 3. CAMBIO AQUÍ: Cambiamos onImageUploaded por onImagesUploaded */}
                            <div className="mb-0">
                                <label className="form-label fw-medium d-flex align-items-center">
                                    <ImagePlus size={18} className="me-2 text-danger"/>
                                    Sube las fotos del evento (Opcional)
                                </label>
                                <div className="bg-light p-3 rounded-3 border-0">
                                    <ImageUpload onImagesUploaded={handleImagesUploaded} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h5 className="fw-bold d-flex align-items-center mb-4">
                                <Calendar size={20} className="me-2 text-danger" /> Cronograma
                            </h5>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-muted small">Fecha y Hora de Inicio <span className="text-danger">*</span></label>
                                <input type="datetime-local" name="start_time" className="form-control bg-light border-0 py-2" value={formData.start_time} onChange={handleChange} required />
                                <div className="invalid-feedback">Ingresa la fecha de inicio.</div>
                            </div>
                            <div className="mb-0">
                                <label className="form-label fw-medium text-muted small">Fecha y Hora de Fin <span className="text-danger">*</span></label>
                                <input type="datetime-local" name="end_time" className="form-control bg-light border-0 py-2" value={formData.end_time} onChange={handleChange} required />
                                <div className="invalid-feedback">Ingresa la fecha de fin.</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-5">
                        <h5 className="fw-bold d-flex align-items-center mb-3 px-2">
                            <MapPin size={22} className="me-2 text-danger" /> Ubicación en el Mapa <span className="text-danger ms-1">*</span>
                        </h5>
                        <LocationPicker onLocationSelect={handleLocationSelect} />
                    </div>

                    <div className="col-12 text-end mt-2 mb-5">
                        <button type="submit" className="btn btn-danger btn-lg rounded-pill px-5 fw-bold shadow-sm" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Publicar Evento"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};