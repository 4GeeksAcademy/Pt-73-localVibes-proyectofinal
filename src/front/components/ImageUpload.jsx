import React, { useState } from 'react';

export const ImageUpload = ({ onImageUploaded }) => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Mostrar una vista previa local de la imagen mientras carga
        setPreview(URL.createObjectURL(file));
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await `${process.env.BACKEND_URL}/api/upload`;
            const res = await fetch(response, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            
            if (res.ok) {
                // Devolvemos la URL segura al componente padre
                onImageUploaded(data.url);
            } else {
                alert(data.error || "Error al subir la imagen");
            }
        } catch (error) {
            console.error("Error de red al subir la imagen:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">Sube una imagen</label>
            <input 
                type="file" 
                className="form-control" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={loading}
            />
            {loading && <p className="text-muted mt-1">Subiendo a Cloudinary...</p>}
            {preview && (
                <div className="mt-2">
                    <img src={preview} alt="Vista previa" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
            )}
        </div>
    );
};