import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Ticket, Settings, LogOut, PlusCircle, Heart, ShieldCheck } from "lucide-react";

// Importación de los sub-componentes 
import { TabDashboard } from "../components/profile/TabDashboard";
import { TabTickets } from "../components/profile/TabTickets";
import { TabSettings } from "../components/profile/TabSettings";

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) setActiveTab(tabParam);
    }, [searchParams]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/profile", {
            method: "GET",
            headers: { Authorization: "Bearer " + token }
        })
        .then(res => {
            if (!res.ok) throw new Error("Sesión expirada");
            return res.json();
        })
        .then(data => setUser(data))
        .catch(err => {
            setError(err.message);
            localStorage.removeItem("token");
            navigate("/login");
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
                <div className="spinner-border" style={{ color: "#ff7a00" }} role="status"></div>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <TabDashboard user={user} />;
            case "tickets": return <TabTickets />;
            case "settings": return <TabSettings user={user} />;
            default: return <TabDashboard user={user} />;
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 p-0 d-flex flex-column flex-md-row">
            
            {/* =======================================
                SIDEBAR (Ancho mínimo garantizado y Flex-Row en botones)
            ======================================= */}
            <aside 
                className="bg-white border-end shadow-sm" 
                style={{ 
                    width: "100%", 
                    maxWidth: "100%", 
                    // En pantallas medianas en adelante, la barra tendrá entre 280px y 300px
                    flexBasis: "280px", 
                    flexShrink: 0 
                }}
            >
                <div className="d-flex flex-column position-sticky top-0 p-4 p-xl-5 min-vh-100">
                    
                    {/* Avatar Info */}
                    <div className="text-center mb-5 mt-3 flex-shrink-0">
                        <div className="position-relative d-inline-block mb-3">
                            <img
                                src={user.avatar || "https://picsum.photos/seed/profile/150/150"}
                                alt="Avatar"
                                className="rounded-circle object-fit-cover shadow-sm"
                                width="110" height="110"
                                style={{ border: "4px solid white" }}
                            />
                            {user.is_verified && (
                                <span className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 border border-2 border-white shadow-sm" title="Cuenta verificada">
                                    <ShieldCheck size={18} />
                                </span>
                            )}
                        </div>
                        {/* whiteSpace: "nowrap" obliga al nombre a quedarse en una sola línea */}
                        <h5 className="fw-bold mb-1 text-truncate" style={{ color: "#2b2b2b", whiteSpace: "nowrap" }}>
                            {user.name} {user.lastname}
                        </h5>
                        <span className="badge bg-light text-secondary border rounded-pill mt-1 px-3 py-1 fw-medium">
                            {user.account_type === 'Empresa' ? 'Organizador' : 'Usuario'}
                        </span>
                    </div>

                    {error && <div className="alert alert-danger small py-2">{error}</div>}

                    {/* =======================================
                        ZONA NAVEGABLE
                    ======================================= */}
                    <nav className="d-flex flex-column gap-2 mb-5 w-100">
                        <MenuItem icon={<User size={20} />} text="Mi Dashboard" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                        <MenuItem icon={<Ticket size={20} />} text="Mis Entradas" isActive={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
                        
                        <MenuItem icon={<Heart size={20} />} text="Favoritos" onClick={() => navigate("/favorites")} />
                        <MenuItem icon={<PlusCircle size={20} />} text="Crear Evento" onClick={() => navigate("/create-event")} />
                        
                        <hr className="text-light my-3"/>
                        
                        <MenuItem icon={<Settings size={20} />} text="Configuración" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
                    </nav>

                    {/* Botón Salir */}
                    <div className="mt-auto pt-3 flex-shrink-0">
                        <button 
                            onClick={handleLogout} 
                            className="btn w-100 d-flex flex-row align-items-center justify-content-center gap-3 p-3 rounded-4 bg-light text-danger fw-bold transition-all hover-shadow"
                        >
                            <LogOut size={20} /> 
                            <span style={{ whiteSpace: "nowrap" }}>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* =======================================
                CONTENIDO PRINCIPAL
            ======================================= */}
            <main className="bg-light flex-grow-1" style={{ minWidth: 0 }}>
                <div className="p-4 p-md-5">
                    {renderContent()}
                </div>
            </main>
            
        </div>
    );
};

// Componente visual para los botones del menú (Arreglado para asegurar Flex-Row)
const MenuItem = ({ icon, text, isActive, onClick }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    return (
        <button
            onClick={onClick}
            // flex-row fuerza a que el ícono y el texto estén siempre al lado del otro
            className={`btn text-start d-flex flex-row align-items-center gap-3 w-100 rounded-4 p-3 border-0 transition-all ${isActive ? "text-white fw-bold shadow-sm" : "bg-transparent text-secondary fw-medium"}`}
            style={isActive ? { background: orangeGradient } : {}}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
        >
            <div className="d-flex align-items-center flex-shrink-0">{icon}</div> 
            <span className="fs-6 text-truncate" style={{ whiteSpace: "nowrap" }}>{text}</span>
        </button>
    );
};