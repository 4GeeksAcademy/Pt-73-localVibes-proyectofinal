import React, { useEffect, useState } from "react";
import { PlusCircle, Heart, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TabDashboard = ({ user }) => {
    const navigate = useNavigate();
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    // 1. Estados para los datos dinámicos
    const [stats, setStats] = useState({
        created_events: 0,
        saved_favorites: 0,
        purchased_tickets: 0
    });
    const [loading, setLoading] = useState(true);

    // 2. Traer los datos reales desde el Backend
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/user/dashboard-stats", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="animate__animated animate__fadeIn">
            <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>¡Hola, {user.name}! 👋</h2>
            <p className="text-muted mb-5">Aquí tienes un resumen de tu actividad en Local Vibes.</p>

            {/* Tarjetas de estadísticas DInámicas */}
            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 cursor-pointer transition-transform" onClick={() => navigate("/create-event")}>
                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                            <div>
                                {/* Valores reales o spinner de carga */}
                                <h3 className="fw-bold mb-1">
                                    {loading ? <span className="spinner-border spinner-border-sm text-danger"></span> : stats.created_events}
                                </h3>
                                <p className="text-muted small mb-0">Eventos creados</p>
                            </div>
                            <div className="p-3 rounded-circle text-white shadow-sm" style={{ background: orangeGradient }}>
                                <PlusCircle size={24} />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 cursor-pointer" onClick={() => navigate("/favorites")}>
                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="fw-bold mb-1">
                                    {loading ? <span className="spinner-border spinner-border-sm text-danger"></span> : stats.saved_favorites}
                                </h3>
                                <p className="text-muted small mb-0">Eventos guardados</p>
                            </div>
                            <div className="p-3 rounded-circle bg-danger bg-opacity-10 text-danger">
                                <Heart size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100 cursor-pointer">
                        <div className="card-body p-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="fw-bold mb-1">
                                    {loading ? <span className="spinner-border spinner-border-sm text-success"></span> : stats.purchased_tickets}
                                </h3>
                                <p className="text-muted small mb-0">Entradas compradas</p>
                            </div>
                            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                                <Ticket size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner decorativo */}
            <div className="card border-0 rounded-4 overflow-hidden shadow-sm position-relative">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80" alt="Banner" className="w-100 object-fit-cover opacity-75" style={{ height: "200px", filter: "brightness(0.6)" }} />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center p-4 p-md-5 text-white">
                    <h3 className="fw-bold mb-2">¿Listo para armar un plan?</h3>
                    <p className="mb-4 opacity-75 max-w-50">Explora la cartelera y descubre los mejores conciertos, obras de teatro y eventos gastronómicos de la ciudad.</p>
                    <div>
                        <button onClick={() => navigate("/events")} className="btn btn-light rounded-pill px-4 fw-bold shadow text-dark">
                            Explorar eventos
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};