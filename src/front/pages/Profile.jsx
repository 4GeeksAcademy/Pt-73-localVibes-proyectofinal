import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    User, Ticket, Settings, LogOut, PlusCircle, Heart, ShieldCheck,
    CheckCircle, Mic, CalendarDays, MapPin, Clock, ArrowRight, Star, Trash2, Shield, AlertTriangle
} from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";

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
            case "favoritos": return <TabFavoritos />;
            case "crear-evento": return <TabCrearEvento isVerified={user.is_verified || false} />;
            case "configuracion": return <TabConfiguracion user={user} setUser={setUser} />;
            case "verificaciones": return <TabVerificaciones />;
            default: return <TabDashboard user={user} />;
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 p-0 d-flex flex-column flex-md-row">
            
            {/* SIDEBAR */}
            <aside className="bg-white border-end shadow-sm flex-shrink-0" style={{ width: "100%", mdWidth: "280px", flexBasis: "280px" }}>
                <div className="d-flex flex-column p-4 min-vh-100 position-sticky top-0">
                    
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
                        <h5 className="fw-bold mb-1 text-truncate">{user.name} {user.lastname}</h5>
                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-1">
                            {user.role === 'admin' ? 'Organizador' : 'Usuario'}
                        </span>
                    </div>

                    {/* Navegación */}
                    <nav className="d-flex flex-column gap-2 flex-grow-1">
                        <MenuItem icon={<User size={20} />} text="Dashboard" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
                        <MenuItem icon={<Ticket size={20} />} text="Mis Entradas" isActive={activeTab === "tickets"} onClick={() => setActiveTab("tickets")} />
                        <MenuItem icon={<Heart size={20} />} text="Favoritos" isActive={activeTab === "favoritos"} onClick={() => setActiveTab("favoritos")} />
                        <MenuItem icon={<PlusCircle size={20} />} text="Crear Evento" isActive={activeTab === "crear-evento"} onClick={() => setActiveTab("crear-evento")} />
                        <hr className="my-3 opacity-25" />
                        <MenuItem icon={<Settings size={20} />} text="Configuración" isActive={activeTab === "configuracion"} onClick={() => setActiveTab("configuracion")} />
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

// Componente Auxiliar para los Items del Menú
const MenuItem = ({ icon, text, isActive, onClick }) => {
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    return (
        <button
            onClick={onClick}
            className={`btn text-start d-flex align-items-center gap-3 w-100 rounded-4 p-3 border-0 transition-all ${isActive ? "text-white fw-bold shadow-sm" : "bg-transparent text-secondary fw-medium"}`}
            style={isActive ? { background: orangeGradient } : {}}
        >
            {icon} <span>{text}</span>
        </button>
    );
};

// ============================================================
// PESTAÑAS (SUB-COMPONENTES)
// ============================================================

const TabDashboard = ({ user }) => (
    <div className="animate__animated animate__fadeIn">
        <h2 className="fw-bold mb-4">¡Hola, {user.name}! 👋</h2>
        <div className="row g-4">
            <div className="col-md-4"><div className="card p-4 border-0 shadow-sm rounded-4"><h5>Favoritos</h5><h3>2</h3></div></div>
            <div className="col-md-4"><div className="card p-4 border-0 shadow-sm rounded-4"><h5>Entradas</h5><h3>3</h3></div></div>
            <div className="col-md-4"><div className="card p-4 border-0 shadow-sm rounded-4 text-white" style={{background: "#ff7a00"}}><h5>Saldo</h5><h3>$0.00</h3></div></div>
        </div>
    </div>
);

const TabConfiguracion = ({ user, setUser }) => {
    const [name, setName] = useState(user.name || "");
    const [lastname, setLastname] = useState(user.lastname || "");
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ image_url: avatar, name, lastname })
            });
            if (res.ok) {
                setUser({...user, avatar, name, lastname});
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally { setLoading(false); }
    };

    return (
        <div className="animate__animated animate__fadeIn card border-0 shadow-sm rounded-4 p-4">
            <h3 className="fw-bold mb-4">Configuración</h3>
            {saved && <div className="alert alert-success">Cambios guardados</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4 d-flex align-items-center gap-4">
                    <img src={avatar || "https://picsum.photos/seed/profile/150/150"} className="rounded-circle border" width="80" height="80" />
                    <ImageUpload onImagesUploaded={(urls) => setAvatar(urls[0])} />
                </div>
                <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">Nombre</label><input className="form-control" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="col-md-6"><label className="form-label">Apellido</label><input className="form-control" value={lastname} onChange={e => setLastname(e.target.value)} /></div>
                </div>
                <button className="btn btn-danger mt-4 rounded-pill px-5" disabled={loading}>Guardar Cambios</button>
            </form>
        </div>
    );
};

const TabCrearEvento = ({ isVerified }) => {
    const [imageUrl, setImageUrl] = useState("");
    if (!isVerified) return <div className="alert alert-warning p-4 rounded-4">Necesitas verificar tu cuenta para crear eventos.</div>;

    return (
        <div className="animate__animated animate__fadeIn card border-0 shadow-sm rounded-4 p-4">
            <h3 className="fw-bold mb-4">Publicar Evento</h3>
            <div className="mb-3">
                <label className="form-label">Foto del evento</label>
                {imageUrl && <img src={imageUrl} className="d-block mb-2 rounded" style={{width: "200px"}} />}
                <ImageUpload onImagesUploaded={(urls) => setImageUrl(urls[0])} />
            </div>
            <button className="btn btn-primary">Publicar</button>
        </div>
    );
};

const TabTickets = () => <div className="animate__animated animate__fadeIn"><h3>Mis Entradas</h3><p className="text-muted">No tienes entradas compradas.</p></div>;
const TabFavoritos = () => <div className="animate__animated animate__fadeIn"><h3>Mis Favoritos</h3><p className="text-muted">Aún no tienes favoritos.</p></div>;
const TabVerificaciones = () => <div className="animate__animated animate__fadeIn"><h3>Verificaciones</h3><p className="text-muted">Cuenta en proceso de verificación.</p></div>;