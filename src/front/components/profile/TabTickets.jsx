import React, { useState, useEffect } from "react";
import { Ticket, CalendarDays, MapPin, Download } from "lucide-react";
import { Link } from "react-router-dom";

export const TabTickets = () => {
    const [myTickets, setMyTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        const fetchMyTickets = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch(`${backendUrl}/api/user/tickets`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setMyTickets(data);
                }
            } catch (error) {
                console.error("Error cargando tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTickets();
    }, [backendUrl]);

    // Función para dar formato a la fecha (igual que en los otros componentes)
    const formatDateTime = (start) => {
        if (!start) return "Fecha por confirmar";
        const startDate = new Date(start);
        const optionsDate = { day: 'numeric', month: 'short', year: 'numeric' };
        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        
        const formattedDate = startDate.toLocaleDateString('es-ES', optionsDate).replace(',', '');
        const startTimeStr = startDate.toLocaleTimeString('en-US', optionsTime);
        
        return `${formattedDate} - ${startTimeStr}`;
    };

    if (loading) return <div className="text-center py-5"><span className="spinner-border text-danger"></span></div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Mis Entradas</h2>
            <p className="text-muted mb-5">Muestra tu código QR en la puerta del evento para ingresar.</p>

            {myTickets.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 bg-white p-5 text-center">
                    <Ticket size={48} className="text-muted mx-auto mb-3 opacity-50" />
                    <h5 className="fw-bold text-dark">Aún no has comprado entradas</h5>
                    <p className="text-secondary mb-4">Descubre eventos increíbles y asegura tu lugar.</p>
                    <div>
                        <Link to="/events" className="btn text-white rounded-pill px-4 fw-medium shadow-sm hover-scale" style={{ background: orangeGradient }}>
                            Explorar Eventos
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {myTickets.map(ticket => (
                        <div key={ticket.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white hover-scale-slight transition-all">
                            <div className="row g-0">
                                
                                {/* Diseño visual del ticket (Lado Izquierdo) */}
                                <div className="col-12 col-md-3 text-white p-4 d-flex flex-column justify-content-center align-items-center text-center position-relative" style={{ background: orangeGradient }}>
                                    {/* Detalles decorativos (Círculos simulando corte de ticket) */}
                                    <div className="position-absolute top-50 start-100 translate-middle rounded-circle bg-white d-none d-md-block" style={{ width: "30px", height: "30px", zIndex: 2 }}></div>
                                    
                                    <Ticket size={40} className="mb-3 opacity-75" />
                                    <span className="badge bg-white text-dark rounded-pill px-3 py-2 fw-bold fs-6 mb-2 shadow-sm">{ticket.ticket_type}</span>
                                    <small className="opacity-75 font-monospace">Ref: {ticket.reference}</small>
                                </div>

                                {/* Info del evento (Centro) */}
                                <div className="col-12 col-md-6 p-4">
                                    <h5 className="fw-bold mb-3">{ticket.event.title}</h5>
                                    <div className="text-secondary small d-flex flex-column gap-2 mb-3">
                                        <div className="d-flex align-items-center">
                                            <CalendarDays size={16} className="me-2 text-muted"/> 
                                            {formatDateTime(ticket.event.start_time)}
                                        </div>
                                        <div className="d-flex align-items-center text-truncate">
                                            <MapPin size={16} className="me-2 text-muted flex-shrink-0"/> 
                                            <span className="text-truncate">{ticket.event.location_name || ticket.event.address}</span>
                                        </div>
                                    </div>
                                    <span className="text-success small fw-bold bg-success bg-opacity-10 px-3 py-1 rounded-pill">
                                        ✔ Entrada válida
                                    </span>
                                </div>

                                {/* Zona del QR (Derecha) */}
                                <div className="col-12 col-md-3 p-4 border-start d-flex flex-column align-items-center justify-content-center bg-light">
                                    <div className="bg-white p-2 rounded-3 shadow-sm mb-3 border hover-scale">
                                        {/* API Gratuita que genera un QR real a partir del código de referencia */}
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.reference}`} alt="QR" width="90" height="90" />
                                    </div>
                                    <button 
                                        className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2 hover-bg-dark"
                                        onClick={() => alert("Simulando descarga de entrada PDF...")}
                                    >
                                        <Download size={14} /> Descargar
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <style>{`
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.05); }
                .hover-scale-slight { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-scale-slight:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                .hover-bg-dark:hover { background-color: #212529 !important; color: white !important; }
            `}</style>
        </div>
    );
};