import React, { useState } from 'react';

export const ImageUpload = ({ onImagesUploaded }) => {
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // 1. Generar vistas previas locales para todas las imágenes seleccionadas
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
        setLoading(true);

        const formData = new FormData();
        // 2. Adjuntar cada archivo con la clave 'images' (en plural)
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            // Corregido: Llamada directa con fetch usando la variable de entorno correcta
            const res = await fetch(`${backendUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            
            if (res.ok) {
                // Devolvemos el array de URLs seguras al componente padre
                onImagesUploaded(data.urls);
            } else {
                alert(data.error || "Error al subir las imágenes");
            }
        } catch (error) {
            console.error("Error de red al subir las imágenes:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">Sube las fotos del evento</label>
            <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                multiple // <--- AQUÍ HACES EL PASO 1: Habilita la selección múltiple
                onChange={handleFileChange} 
                disabled={loading}
            />
            {loading && <p className="text-muted mt-1">Subiendo imágenes a Cloudinary...</p>}
            
            {/* Contenedor para mostrar múltiples vistas previas */}
            {previews.length > 0 && (
                <div className="mt-2 d-flex gap-2 flex-wrap">
                    {previews.map((src, index) => (
                        <img 
                            key={index} 
                            src={src} 
                            alt={`Vista previa ${index}`} 
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};