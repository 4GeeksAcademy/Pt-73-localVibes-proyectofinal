import React, { useState } from "react";
import { ImageUpload } from "../ImageUpload";

// 👇 1. Agregamos setUser a los props recibidos 👇
export const TabSettings = ({ user, setUser }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    
    const [formData, setFormData] = useState({
        name: user.name || "",
        lastname: user.lastname || "",
        avatar: user.avatar || ""
    });
    
    const [saved, setSaved] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = (imageUrl) => {
        setFormData({ ...formData, avatar: imageUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const token = localStorage.getItem("token");
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    lastname: formData.lastname,
                    image_url: formData.avatar // 👇 2. Corregido: El backend espera "image_url"
                })
            });

            // Extraemos la respuesta (que ahora trae el usuario actualizado desde el backend)
            const data = await response.json(); 

            if (response.ok) {
                setSaved(true);
                
                // 👇 3. ¡LA MAGIA! Actualizamos el componente Padre al instante 👇
                if (setUser) {
                    setUser(data.user);
                }
                
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert(data.message || "No se pudo actualizar el perfil.");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Configuración</h2>
            <p className="text-muted mb-5">Actualiza tu información personal y foto de perfil.</p>

            {saved && (
                <div className="alert alert-success border-0 shadow-sm rounded-4 mb-4 fw-medium text-center animate__animated animate__fadeInDown">
                    ¡Cambios guardados con éxito!
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <h5 className="fw-bold mb-4 border-bottom pb-2">Datos Básicos</h5>
                        
                        {/* SECCIÓN DEL AVATAR */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted">Foto de Perfil (Avatar)</label>
                            <ImageUpload 
                                currentImage={formData.avatar} 
                                onImagesUploaded={(urls) => handleAvatarUpload(urls[0])} 
                            />
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Nombre</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-3 py-2" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Apellido</label>
                                <input 
                                    type="text" 
                                    className="form-control rounded-3 py-2" 
                                    name="lastname" 
                                    value={formData.lastname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small text-muted">Correo Electrónico (Solo lectura)</label>
                                <input 
                                    type="email" 
                                    className="form-control rounded-3 py-2 bg-light text-muted" 
                                    value={user.email} 
                                    disabled 
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn px-5 py-2 rounded-pill text-white fw-bold shadow-sm hover-scale" 
                                style={{ background: isSubmitting ? "#ccc" : orangeGradient, border: "none" }}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.02); }
                .form-control:focus { border-color: #ff7a00; box-shadow: 0 0 0 0.25rem rgba(255, 122, 0, 0.25); }
            `}</style>
        </div>
    );
};