import React, { useState } from 'react';

export const ImageUpload = ({ onImagesUploaded }) => {
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // 1. Mostrar vistas previas locales inmediatamente
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        setLoading(true);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            // 2. Subida a Cloudinary a través de tu API de Python
            const res = await fetch(`${backendUrl}/api/upload`, {
                method: 'POST',
                body: formData,
                // Nota: No enviamos Authorization aquí porque la ruta /api/upload 
                // en tu routes.py no tiene @jwt_required (está abierta)
            });

            const data = await res.json();
            
            if (res.ok) {
                // 3. ENVIAR LAS URLS AL COMPONENTE PADRE
                // Aquí es donde "onImagesUploaded" hace su magia
                onImagesUploaded(data.urls); 
                
                // Opcional: Limpiar vistas previas tras éxito
                // setPreviews([]); 
            } else {
                alert(data.error || "Error al subir las imágenes");
            }
        } catch (error) {
            console.error("Error de red al subir las imágenes:", error);
            alert("Error de conexión al servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-3 shadow-sm mb-3">
            <label className="form-label fw-bold">Gestionar Imágenes</label>
            <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange} 
                disabled={loading}
            />
            
            {loading && (
                <div className="mt-2 text-primary">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Subiendo a Cloudinary...
                </div>
            )}
            
            {/* Vistas previas */}
            <div className="mt-3 d-flex gap-2 flex-wrap">
                {previews.map((src, index) => (
                    <div key={index} className="position-relative">
                        <img 
                            src={src} 
                            alt={`Preview ${index}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #ddd' }} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};