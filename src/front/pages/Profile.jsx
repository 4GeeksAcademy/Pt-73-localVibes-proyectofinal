import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Ticket, Settings, LogOut, PlusCircle, Heart, ShieldCheck, CalendarDays } from "lucide-react"; 

// Importación de los sub-componentes
import { TabDashboard } from "../components/profile/TabDashboard";
import { TabTickets } from "../components/profile/TabTickets";
import { TabSettings } from "../components/profile/TabSettings";
import { TabEvents } from "../components/profile/TabEvents"; 

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    // Sincronizar pestaña con la URL
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) setActiveTab(tabParam);
    }, [searchParams]);

    // Cargar datos del usuario
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

    // Renderizado dinámico de contenido
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <TabDashboard user={user} />;
            case "tickets": return <TabTickets />;
            case "events": return <TabEvents />; 
            // 👇 AQUÍ ESTÁ LA MAGIA: Le pasamos setUser a TabSettings 👇
            case "settings": return <TabSettings user={user} setUser={setUser} />;
            default: return <TabDashboard user={user} />;
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 p-0 d-flex flex-column flex-md-row">
            
            {/* =======================================
                SIDEBAR
            ======================================= */}
            <aside 
                className="bg-white border-end shadow-sm" 
                style={{ 
                    width: "100%", 
                    maxWidth: "100%", 
                    flexBasis: "280px", 
                    flexShrink: 0 
                }}
            >
                <div className="d-flex flex-column position-sticky top-0 p-4 p-xl-5 min-vh-100">
                    
                    {/* Perfil Info */}
                    <div className="text-center mb-4 mt-2">
                        <div className="position-relative d-inline-block mb-3">
                            <img
                                src={user.avatar || "https://picsum.photos/seed/profile/150/150"}
                                alt="Avatar"
                                className="rounded-circle object-fit-cover border"
                                width="100" height="100"
                            />
                            {user.is_verified && (
                                <span className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 border border-2 border-white shadow-sm">
                                    <ShieldCheck size={16} />
                                </span>
                            )}
                        </div>
                        <h5 className="fw-bold mb-1 text-truncate" style={{ color: "#2b2b2b", whiteSpace: "nowrap" }}>
                            {user.name} {user.lastname}
                        </h5>
                        <span className="badge bg-light text-secondary border rounded-pill mt-1 px-3 py-1 fw-medium">
                            {user.account_type === 'Empresa' ? 'Organizador' : 'Usuario'}
                        </span>
                    </div>

                    {/* Navegación */}
                    <nav className="d-flex flex-column gap-2 flex-grow-1">
                        <MenuItem icon={<User size={20} />} text="Dashboard" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                        <MenuItem icon={<Ticket size={20} />} text="Mis Entradas" isActive={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
                        
                        <MenuItem icon={<CalendarDays size={20} />} text="Mis Eventos" isActive={activeTab === "events"} onClick={() => setActiveTab("events")} />
                        
                        <MenuItem icon={<Heart size={20} />} text="Favoritos" onClick={() => navigate("/favorites")} />
                        <MenuItem icon={<PlusCircle size={20} />} text="Crear Evento" onClick={() => navigate("/create-event")} />
                        
                        <hr className="text-light my-3"/>
                        
                        <MenuItem icon={<Settings size={20} />} text="Configuración" isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
                    </nav>

                    {/* Botón Salir */}
                    <button onClick={handleLogout} className="btn w-100 d-flex align-items-center justify-content-center gap-3 p-3 rounded-4 bg-light text-danger fw-bold mt-auto border-0">
                        <LogOut size={20} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-grow-1 p-4 p-md-5 overflow-auto">
                {renderContent()}
            </main>
        </div>
    );
};

// Componente visual para los botones del menú 
const MenuItem = ({ icon, text, isActive, onClick }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    return (
        <button
            onClick={onClick}
            className={`btn text-start d-flex flex-row align-items-center gap-3 w-100 rounded-4 p-3 border-0 transition-all ${isActive ? "text-white fw-bold shadow-sm" : "bg-transparent text-secondary fw-medium"}`}
            style={isActive ? { background: orangeGradient } : {}}
        >
            {icon} <span>{text}</span>
        </button>
    );
};