import React, { useEffect } from "react";

export const EventModal = ({ event, categoryName, onClose }) => {
    // Bloquear el scroll del fondo cuando el modal está abierto
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    if (!event) return null;

    // Formateadores de fecha
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        return `${date.toLocaleDateString('es-ES', optionsDate).replace(',', '')} • ${date.toLocaleTimeString('en-US', optionsTime)}`;
    };

    return (
        // Contenedor principal: Fondo oscuro con desenfoque (blur)
        <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start py-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)", zIndex: 1050, overflowY: "auto" }}
            onClick={onClose} // Cierra al hacer clic afuera
        >
            {/* Caja del Modal */}
            <div 
                className="bg-white rounded-4 shadow-lg w-100 position-relative mb-4" 
                style={{ maxWidth: "800px", cursor: "default" }}
                onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic adentro
            >
                
                {/* Header (Botones superiores) */}
                <div className="d-flex justify-content-between p-3 pb-0">
                    <button className="btn btn-light rounded-pill border fw-medium px-3" onClick={onClose}>
                        <i className="bi bi-arrow-left me-2"></i> Volver
                    </button>
                    <div className="d-flex gap-2">
                        <button className="btn btn-light rounded-circle border"><i className="bi bi-share"></i></button>
                        <button className="btn btn-light rounded-circle border"><i className="bi bi-heart-fill text-danger"></i></button>
                    </div>
                </div>

                {/* Imagen Hero */}
                <div className="p-3">
                    <div className="position-relative w-100 rounded-4 overflow-hidden" style={{ height: "300px" }}>
                        <img 
                            src={event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000"} 
                            alt={event.title} 
                            className="w-100 h-100" 
                            style={{ objectFit: "cover" }} 
                        />
                        {/* Etiquetas sobre la imagen */}
                        <span className="position-absolute bottom-0 start-0 m-3 badge bg-danger rounded-pill px-3 py-2 text-uppercase">
                            {categoryName || "Evento"}
                        </span>
                        <span className="position-absolute bottom-0 end-0 m-3 badge bg-white text-dark border rounded-pill px-3 py-2">
                            Aforo: 1840/2500 personas
                        </span>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    {/* Título y Subtítulo */}
                    <h3 className="fw-bold mb-2">{event.title}</h3>
                    <div className="d-flex gap-3 text-muted small mb-3">
                        <span className="text-danger fw-medium"><i className="bi bi-geo-alt-fill me-1"></i> {event.location_name || "Caracas, Venezuela"}</span>
                        <span><i className="bi bi-calendar3 me-1"></i> {formatDate(event.start_time)}</span>
                    </div>
                    <p className="text-secondary small mb-4">
                        Una noche inolvidable con lo mejor de la música en vivo. Artistas invitados, luces, sonido y una experiencia única.
                    </p>

                    {/* Grilla de Datos Rápidos */}
                    <div className="row row-cols-2 row-cols-md-4 g-2 mb-4 text-center">
                        <div className="col">
                            <div className="card bg-light border-0 py-2 h-100">
                                <small className="text-muted" style={{fontSize: "0.75rem"}}>Tipo de evento</small>
                                <strong className="small">Concierto</strong>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card bg-light border-0 py-2 h-100">
                                <small className="text-muted" style={{fontSize: "0.75rem"}}>Edad mínima</small>
                                <strong className="small">+18 años</strong>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card bg-light border-0 py-2 h-100">
                                <small className="text-muted" style={{fontSize: "0.75rem"}}>Precio</small>
                                <strong className="small text-danger">$15</strong>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card bg-light border-0 py-2 h-100">
                                <small className="text-muted" style={{fontSize: "0.75rem"}}>Organizador</small>
                                <strong className="small text-truncate px-1">Local Vibes Producci...</strong>
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                            <button className="btn btn-danger w-100 rounded-pill py-2 fw-medium" style={{ backgroundColor: "#ff523b", borderColor: "#ff523b" }}>
                                <i className="bi bi-ticket-perforated me-2"></i> Comprar entradas
                            </button>
                        </div>
                        <div className="col-12 col-md-6">
                            <button className="btn btn-outline-danger w-100 rounded-pill py-2 fw-medium">
                                Guardado en favoritos
                            </button>
                        </div>
                    </div>

                    <hr className="text-light" />

                    {/* Información del evento */}
                    <h6 className="fw-bold mt-4">Información del evento</h6>
                    <p className="text-secondary small lh-lg">
                        {event.description || "Disfruta de una noche llena de buena música, energía y sorpresas bajo las estrellas caraqueñas. Contaremos con bandas de renombre nacional, barra de coctelería de autor, zona gastronómica y un show audiovisual de última generación."}
                    </p>

                    {/* Artistas (Datos Mockup para simular el diseño) */}
                    <h6 className="fw-bold mt-4 mb-3">Artistas y participantes invitados</h6>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        <div className="card border rounded-pill p-1 pe-3 d-flex flex-row align-items-center gap-2">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="rounded-circle" style={{width: "40px", height: "40px", objectFit: "cover"}}/>
                            <div className="lh-1">
                                <div className="fw-bold small">DJ Sam</div>
                                <small className="text-muted" style={{fontSize: "0.7rem"}}>Electronic / Opening</small>
                            </div>
                        </div>
                        <div className="card border rounded-pill p-1 pe-3 d-flex flex-row align-items-center gap-2">
                            <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="rounded-circle" style={{width: "40px", height: "40px", objectFit: "cover"}}/>
                            <div className="lh-1">
                                <div className="fw-bold small">Los Caracas Band</div>
                                <small className="text-muted" style={{fontSize: "0.7rem"}}>Banda Principal</small>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <h6 className="fw-bold mt-4 mb-3">Ubicación</h6>
                    <div className="card border rounded-4 p-3 d-flex flex-row justify-content-between align-items-center">
                        <div>
                            <div className="fw-bold">{event.location_name || "Terraza CCCT"}</div>
                            <small className="text-muted">{event.address || "Terraza del CCCT, Nivel C2, Chacao, Caracas"}</small>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                            Cómo llegar <i className="bi bi-box-arrow-up-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};