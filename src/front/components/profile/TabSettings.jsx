import React, { useState } from "react";
// 👇 Importa el componente de tu compañero (ajusta la ruta según la estructura de tu proyecto)
import { ImageUpload } from "../ImageUpload";

export const TabSettings = ({ user }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    
    const [formData, setFormData] = useState({
        name: user.name || "",
        lastname: user.lastname || "",
        phone: "+58 ",
        avatar: user.avatar || ""
    });
    
    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 👇 Función específica para manejar lo que devuelve el componente ImageUpload
    const handleAvatarUpload = (imageUrl) => {
        setFormData({ ...formData, avatar: imageUrl });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría tu fetch al endpoint de editar perfil (PUT)
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Configuración</h2>
            <p className="text-muted mb-5">Actualiza tu información personal y foto de perfil.</p>

            {saved && (
                <div className="alert alert-success border-0 shadow-sm rounded-4 mb-4 fw-medium text-center">
                    ¡Cambios guardados con éxito!
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <h5 className="fw-bold mb-4 border-bottom pb-2">Datos Básicos</h5>
                        
                        {/* SECCIÓN DEL AVATAR (Movida arriba para mejor UX) */}
                        <div className="mb-4">
                            <label className="form-label fw-bold small text-muted">Foto de Perfil (Avatar)</label>
                            {/* 
                              Aquí insertamos el componente de tu compañero.
                              NOTA: Pregúntale a tu compañero cómo se llaman exactamente las props 
                              para pasarle el URL y para recibir el nuevo URL (aquí usé onUpload)
                            */}
                            <ImageUpload 
                                currentImage={formData.avatar} 
                                onUpload={handleAvatarUpload} 
                            />
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Nombre</label>
                                <input type="text" className="form-control rounded-3 py-2" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Apellido</label>
                                <input type="text" className="form-control rounded-3 py-2" name="lastname" value={formData.lastname} onChange={handleChange} required />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Correo Electrónico (Solo lectura)</label>
                                <input type="email" className="form-control rounded-3 py-2 bg-light text-muted" value={user.email} disabled />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small text-muted">Teléfono de contacto</label>
                                <input type="tel" className="form-control rounded-3 py-2" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn px-5 py-2 rounded-pill text-white fw-bold shadow-sm hover-scale" style={{ background: orangeGradient, border: "none" }}>
                                Guardar Cambios
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