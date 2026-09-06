import React from "react";
import { Ticket, Calendar, MapPin, Download } from "lucide-react";

export const TabTickets = () => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    // Mockup de entradas (Luego lo conectarás a tu backend)
    const myTickets = [
        { id: 1, title: "Festival Rock Urbano", date: "15 de Oct, 2026", time: "8:00 PM", location: "Concha Acústica", type: "VIP", code: "LV-9921-X" },
        { id: 2, title: "Cata de Vinos & Tapas", date: "02 de Nov, 2026", time: "5:30 PM", location: "Hotel Cayena", type: "General", code: "LV-4432-A" }
    ];

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Mis Entradas</h2>
            <p className="text-muted mb-5">Muestra tu código QR en la puerta del evento para ingresar.</p>

            <div className="d-flex flex-column gap-4">
                {myTickets.map(ticket => (
                    <div key={ticket.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="row g-0">
                            {/* Diseño visual del ticket (Lado Izquierdo) */}
                            <div className="col-12 col-md-3 text-white p-4 d-flex flex-column justify-content-center align-items-center text-center position-relative" style={{ background: orangeGradient }}>
                                {/* Detalles decorativos (Círculos simulando corte de ticket) */}
                                <div className="position-absolute top-50 start-100 translate-middle rounded-circle bg-white" style={{ width: "30px", height: "30px", zIndex: 2 }}></div>
                                <div className="position-absolute top-50 start-0 translate-middle rounded-circle bg-white" style={{ width: "30px", height: "30px", zIndex: 2 }}></div>
                                
                                <Ticket size={40} className="mb-3 opacity-75" />
                                <span className="badge bg-white text-dark rounded-pill px-3 py-2 fw-bold fs-6 mb-2 shadow-sm">{ticket.type}</span>
                                <small className="opacity-75 font-monospace">Ref: {ticket.code}</small>
                            </div>

                            {/* Info del evento (Centro) */}
                            <div className="col-12 col-md-6 p-4">
                                <h4 className="fw-bold mb-3">{ticket.title}</h4>
                                <div className="text-secondary small d-flex flex-column gap-2 mb-3">
                                    <div className="d-flex align-items-center"><Calendar size={16} className="me-2 text-muted"/> {ticket.date} - {ticket.time}</div>
                                    <div className="d-flex align-items-center"><MapPin size={16} className="me-2 text-muted"/> {ticket.location}</div>
                                </div>
                                <span className="text-success small fw-bold bg-success bg-opacity-10 px-3 py-1 rounded-pill">✔ Entrada válida</span>
                            </div>

                            {/* Zona del QR (Derecha) */}
                            <div className="col-12 col-md-3 p-4 border-start d-flex flex-column align-items-center justify-content-center bg-light">
                                <div className="bg-white p-2 rounded-3 shadow-sm mb-3 border">
                                    {/* Simulación visual de QR */}
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${ticket.code}`} alt="QR" width="90" height="90" />
                                </div>
                                <button className="btn btn-outline-dark btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
                                    <Download size={14} /> Descargar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};