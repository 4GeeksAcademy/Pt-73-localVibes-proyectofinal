import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Ticket, Settings, LogOut, PlusCircle, Heart, ShieldCheck } from "lucide-react";
import {
    User, Heart, Ticket, CheckCircle, Settings,
    Mic, LogOut, CalendarDays, MapPin, Clock, ArrowRight, Star, PlusCircle, Trash2, Shield, AlertTriangle
} from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";

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
            case "perfil": return <TabPerfil user={user} navigate={navigate} setActiveTab={setActiveTab} />;
            case "historial": return <TabHistorial />;
            case "entradas": return <TabEntradas />;
            case "favoritos": return <TabFavoritos />;
            case "configuracion": return <TabConfiguracion user={user} setUser={setUser} />;
            case "crear-evento": return <TabCrearEvento isVerified={user.is_verified || false} setActiveTab={setActiveTab} />;
            case "verificaciones": return <TabVerificaciones />;
            case "comunicaciones": return <TabComunicaciones />;
            default: return <TabPerfil user={user} navigate={navigate} setActiveTab={setActiveTab} />;
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
        <div className="container-fluid bg-light min-vh-100 p-0">
            <div className="row g-0 min-vh-100">

                {/* SIDEBAR */}
                <aside className="col-12 col-md-3 col-lg-2 bg-white border-end">
                    <div className="d-flex flex-column h-100 p-3 p-lg-4">

                        {/* PERFIL DEL USUARIO */}
                        <div className="text-center py-3 py-lg-4 mb-3" style={{ overflow: 'hidden' }}>
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
    const removeFavorite = (id) => {
        setFavorites(favorites.filter(item => item.id !== id));
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Tus eventos favoritos</h1>
                <p className="text-muted mb-0">Eventos que has guardado para no perderte las novedades.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-muted">No tienes ningún evento guardado en favoritos todavía.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                                <img src={fav.image} alt={fav.title} className="w-100 object-fit-cover" style={{ height: "160px" }} />
                                <div className="card-body p-3 d-flex flex-column justify-content-between">
                                    <div>
                                        <span className="badge bg-danger bg-opacity-10 text-danger mb-2 px-2 py-1">{fav.category}</span>
                                        <h5 className="fw-bold text-dark">{fav.title}</h5>
                                        <p className="text-muted small">📅 {fav.date}</p>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                        <button className="btn btn-outline-danger btn-sm rounded-pill">Ver detalles</button>
                                        <button onClick={() => removeFavorite(fav.id)} className="btn btn-link text-danger p-0" title="Eliminar de favoritos">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// ============================================================
// 4. PESTAÑA: CONFIGURACIÓN
// ============================================================
    const TabConfiguracion = ({ user, setUser }) => {
    const [name, setName] = useState(user.name || "");
    const [lastname, setLastname] = useState(user.lastname || "");
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAvatarUploaded = (urls) => {
        if (urls && urls.length > 0) {
            setAvatar(urls[0]); // Esto actualiza la vista previa en el círculo
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            // 1. Llamada al backend para guardar en la Base de Datos
            const response = await fetch(`${backendUrl}/api/profile/avatar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // <--- ESTO QUITA EL ERROR 401
                },
                body: JSON.stringify({
                    image_url: avatar,
                    name: name,
                    lastname: lastname
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // 2. Actualizamos el estado global para que el Sidebar cambie la foto al instante
                setUser({ ...user, avatar: avatar, name: name, lastname: lastname });

                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert("Error al guardar los cambios");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Configuración de cuenta</h1>
                <p className="text-muted mb-0">Actualiza tus datos personales y tu foto de perfil.</p>
            </div>

            {saved && <div className="alert alert-success rounded-3 shadow-sm border-0">¡Cambios guardados con éxito!</div>}

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Nombre</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Apellido</label>
                            <input type="text" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>

                        <div className="col-12">
                            <label className="form-label fw-bold small d-block mb-3">Foto de perfil</label>
                            <div className="d-flex align-items-center gap-4">
                                <img
                                    src={avatar || "https://picsum.photos/seed/profile/160/160"}
                                    alt="Avatar"
                                    className="rounded-circle border shadow-sm"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                                <div className="flex-grow-1">
                                    <ImageUpload onImagesUploaded={handleAvatarUploaded} />
                                    <small className="text-muted">Se recomienda una imagen cuadrada.</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-danger rounded-pill px-5" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================================
// 5. PESTAÑA: CREAR EVENTO
// ============================================================
const TabCrearEvento = ({ isVerified, setActiveTab }) => {
    const [eventCreated, setEventCreated] = useState(false);
    
    // 1. Crea un estado para la URL de la foto
    const [imageUrl, setImageUrl] = useState(""); 
    
    // 2. Crea estados para los campos básicos
    const [title, setTitle] = useState("");
    const [catId, setCatId] = useState("1");

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                category_id: catId,
                image_url: imageUrl, // <--- MANDAMOS LA URL DE CLOUDINARY
                latitude: 10.5,
                longitude: -66.9,
                description: "Descripción de prueba"
            })
        });

        if (response.ok) setEventCreated(true);
    };

    return (
        // ... resto del código ...
        <form onSubmit={handleCreateEvent}>
             {/* ... otros campos ... */}
             
             <div className="col-12 mb-3">
                <label className="form-label fw-bold small">Imagen del Evento</label>
                
                {/* Muestra una previa si ya se subió */}
                {imageUrl && <img src={imageUrl} className="d-block mb-2 rounded" style={{width: "200px"}} />}
                
                {/* USA TU COMPONENTE AQUÍ */}
                <ImageUpload onImagesUploaded={(urls) => setImageUrl(urls[0])} />
             </div>

             <button type="submit" className="btn btn-danger">Publicar</button>
        </form>
    );
};


// ============================================================
// 6. PESTAÑA: VERIFICACIONES
// ============================================================
const TabVerificaciones = () => {
    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Verificaciones de cuenta</h1>
                <p className="text-muted mb-0">Confirma tu identidad y sube tu RIF para desbloquear la creación de eventos.</p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle"><Shield size={24} /></div>
                            <div>
                                <h5 className="fw-bold mb-0">Identidad Personal</h5>
                                <span className="badge bg-success text-white small mt-1">Verificado</span>
                            </div>
                        </div>
                        <p className="text-muted small">Tu cédula o pasaporte ha sido aprobado correctamente por nuestro sistema de seguridad.</p>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle"><CheckCircle size={24} /></div>
                            <div>
                                <h5 className="fw-bold mb-0">Cuenta de Empresa / RIF</h5>
                                <span className="badge bg-warning text-dark small mt-1">Pendiente de documentos</span>
                            </div>
                        </div>
                        <p className="text-muted small mb-3">Sube el Registro Mercantil o RIF digital para habilitar la publicación de eventos.</p>
                        <button className="btn btn-outline-dark btn-sm rounded-pill">Subir RIF / Documento</button>
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
            className={`btn text-start d-flex align-items-center gap-3 w-100 rounded-3 p-3 border-0 transition-all ${active ? "bg-danger bg-opacity-10 text-danger fw-bold" : "bg-transparent text-dark"
                }`}
        >
            <div className="d-flex align-items-center flex-shrink-0">{icon}</div> 
            <span className="fs-6 text-truncate" style={{ whiteSpace: "nowrap" }}>{text}</span>
        </button>
    );
};