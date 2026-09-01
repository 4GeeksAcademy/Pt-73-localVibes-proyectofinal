import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    User, Heart, Ticket, CheckCircle, Settings,
    Mic, LogOut, CalendarDays, MapPin, Clock, ArrowRight, Star, PlusCircle, Trash2, Shield, AlertTriangle
} from "lucide-react";
import { ImageUpload } from "../components/ImageUpload";


export const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("perfil");
    const navigate = useNavigate();

    // Lee los parámetros de la URL (ej: ?tab=entradas o ?tab=crear-evento)
    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        }
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
            .then((res) => {
                if (!res.ok) throw new Error("Sesión expirada");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err) => {
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
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="text-center">
                    <div className="spinner-border text-danger mb-3" role="status">
                        <span className="visually-hidden">Cargando perfil...</span>
                    </div>
                    <p className="text-muted mb-0">Cargando tu perfil...</p>
                </div>
            </div>
        );
    }

    // =========================================================
    // RENDERIZADO CONDICIONAL DE PESTAÑAS
    // =========================================================
    const renderContent = () => {
        switch (activeTab) {
            case "perfil": return <TabPerfil user={user} navigate={navigate} setActiveTab={setActiveTab} />;
            case "historial": return <TabHistorial />;
            case "entradas": return <TabEntradas />;
            case "favoritos": return <TabFavoritos />;
            case "configuracion": return <TabConfiguracion user={user} />;
            case "crear-evento": return <TabCrearEvento isVerified={user.is_verified || false} setActiveTab={setActiveTab} />;
            case "verificaciones": return <TabVerificaciones />;
            case "comunicaciones": return <TabComunicaciones />;
            default: return <TabPerfil user={user} navigate={navigate} setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            <div className="row g-0 min-vh-100">

                {/* SIDEBAR */}
                <aside className="col-12 col-md-3 col-lg-2 bg-white border-end">
                    <div className="d-flex flex-column h-100 p-3 p-lg-4">
                        
                        {/* PERFIL DEL USUARIO */}
                        <div className="text-center py-3 py-lg-4 mb-3" style={{ overflow: 'hidden' }}>
                            <img
                                src={user.avatar || "https://picsum.photos/seed/profile/160/160"}
                                alt="Avatar del usuario"
                                className="rounded-circle shadow-sm mb-3 object-fit-cover"
                                width="90" height="90"
                            />
                            <h5 className="fw-bold mb-1">
                                {user.name} {user.lastname}
                            </h5>
                            <p className="text-muted small mb-0 text-truncate" title={user.email}>
                                {user.email}
                            </p>
                        </div>

                        {error && <div className="alert alert-danger small" role="alert">{error}</div>}

                        {/* MENÚ DINÁMICO */}
                        <nav className="d-flex flex-column gap-1 flex-grow-1 overflow-auto">
                            <ProfileMenuItem icon={<User size={19} />} text="Mi perfil" active={activeTab === "perfil"} onClick={() => setActiveTab("perfil")} />
                            <ProfileMenuItem icon={<Heart size={19} />} text="Mis favoritos" active={activeTab === "favoritos"} onClick={() => setActiveTab("favoritos")} />
                            <ProfileMenuItem icon={<Ticket size={19} />} text="Mis entradas (3)" active={activeTab === "entradas"} onClick={() => setActiveTab("entradas")} />
                            <ProfileMenuItem icon={<CalendarDays size={19} />} text="Mi historial" active={activeTab === "historial"} onClick={() => setActiveTab("historial")} />
                            <ProfileMenuItem icon={<PlusCircle size={19} />} text="Crear evento" active={activeTab === "crear-evento"} onClick={() => setActiveTab("crear-evento")} />
                            <ProfileMenuItem icon={<CheckCircle size={19} />} text="Verificaciones" active={activeTab === "verificaciones"} onClick={() => setActiveTab("verificaciones")} />
                            <ProfileMenuItem icon={<Settings size={19} />} text="Configuración" active={activeTab === "configuracion"} onClick={() => setActiveTab("configuracion")} />
                            <ProfileMenuItem icon={<Mic size={19} />} text="Comunicaciones" active={activeTab === "comunicaciones"} onClick={() => setActiveTab("comunicaciones")} />
                        </nav>

                        {/* CERRAR SESIÓN */}
                        <div className="border-top pt-3 mt-3">
                            <button onClick={handleLogout} className="btn btn-light bg-transparent text-danger border-0 w-100 d-flex align-items-center gap-3 rounded-3 p-3 text-start">
                                <LogOut size={19} />
                                <span className="fw-medium">Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL DINÁMICO */}
                <main className="col-12 col-md-9 col-lg-10">
                    <div className="p-3 p-sm-4 p-lg-5">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};


// ============================================================
// 1. PESTAÑA: PERFIL (DASHBOARD)
// ============================================================
const TabPerfil = ({ user, navigate, setActiveTab }) => (
    <div className="animate__animated animate__fadeIn">
        <div className="mb-4">
            <h1 className="fw-bold mb-2">Mi perfil</h1>
            <p className="text-muted mb-0">Gestiona tu actividad y descubre tus próximos eventos en Local Vibes.</p>
        </div>

        <div className="row g-3 mb-4">
            <div className="col-12 col-sm-4" onClick={() => setActiveTab("crear-evento")} style={{ cursor: 'pointer' }}>
                <StatCard title="Eventos Creados" value="0" icon={<PlusCircle size={22} />} />
            </div>
            <div className="col-12 col-sm-4" onClick={() => setActiveTab("favoritos")} style={{ cursor: 'pointer' }}>
                <StatCard title="Favoritos" value="2" icon={<Heart size={22} />} />
            </div>
            <div className="col-12 col-sm-4" onClick={() => setActiveTab("entradas")} style={{ cursor: 'pointer' }}>
                <StatCard title="Mis entradas" value="3" icon={<Ticket size={22} />} />
            </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <div>
                <h4 className="fw-bold mb-1">Próximos eventos</h4>
                <p className="text-muted small mb-0">Eventos que tienes en tu agenda.</p>
            </div>
            <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" onClick={() => navigate("/events")}>
                Ver todos <ArrowRight size={16} />
            </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <div className="row g-0">
                <div className="col-12 col-md-4">
                    <img src="https://picsum.photos/seed/concert/700/450" alt="Festival" className="w-100 h-100 object-fit-cover" style={{ minHeight: "220px" }} />
                </div>
                <div className="col-12 col-md-8">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">Música</span>
                            <button className="btn btn-sm border-0 text-danger" title="Favorito"><Heart size={20} /></button>
                        </div>
                        <h4 className="fw-bold mb-3">Festival de Música Local</h4>
                        <div className="d-flex flex-column gap-2 text-muted small mb-4">
                            <div className="d-flex align-items-center gap-2"><CalendarDays size={17} /> 25 de agosto de 2026</div>
                            <div className="d-flex align-items-center gap-2"><Clock size={17} /> 7:00 PM</div>
                            <div className="d-flex align-items-center gap-2"><MapPin size={17} /> Caracas, Venezuela</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center gap-3">
                            <div className="d-flex align-items-center gap-1 text-warning"><Star size={17} fill="currentColor" /><span className="text-dark small">4.8</span></div>
                            <button className="btn btn-danger rounded-3 d-flex align-items-center gap-2" onClick={() => setActiveTab("entradas")}>Ver mis entradas <ArrowRight size={17} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


// ============================================================
// 2. PESTAÑA: MIS ENTRADAS
// ============================================================
const TabEntradas = () => {
    const myTickets = [
        { id: 1, title: "Festival de Música Local", date: "25 de Ago, 2026", time: "7:00 PM", location: "Caracas, Venezuela", code: "LV-9823-XQ", type: "General" },
        { id: 2, title: "Stand Up Comedy: Risa Segura", date: "02 de Sep, 2026", time: "8:30 PM", location: "Centro Cultural Chacao", code: "LV-4412-TR", type: "VIP" },
        { id: 3, title: "Cata de Café y Chocolates", date: "14 de Sep, 2026", time: "4:00 PM", location: "Los Palos Grandes", code: "LV-7731-MN", type: "Exclusiva" },
    ];

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Mis entradas (3)</h1>
                <p className="text-muted mb-0">Presenta el código QR o el número de ticket en la entrada del evento.</p>
            </div>

            <div className="row g-4">
                {myTickets.map((ticket) => (
                    <div key={ticket.id} className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                            <div className="row g-0 align-items-center">
                                <div className="col-12 col-md-3 bg-danger bg-opacity-10 p-4 text-center d-flex flex-column justify-content-center align-items-center border-end border-light">
                                    <Ticket size={48} className="text-danger mb-2" />
                                    <span className="badge bg-danger text-white px-3 py-1 rounded-pill">{ticket.type}</span>
                                    <small className="text-muted mt-2 font-monospace">Ref: {ticket.code}</small>
                                </div>
                                <div className="col-12 col-md-6 p-4">
                                    <h4 className="fw-bold mb-2 text-dark">{ticket.title}</h4>
                                    <div className="text-muted small d-flex flex-column gap-1 mb-3">
                                        <div>📅 <strong>Fecha:</strong> {ticket.date} - {ticket.time}</div>
                                        <div>📍 <strong>Lugar:</strong> {ticket.location}</div>
                                    </div>
                                    <span className="text-success small fw-bold">✔ Entrada válida y confirmada</span>
                                </div>
                                <div className="col-12 col-md-3 p-4 text-center border-start border-light d-flex flex-column align-items-center justify-content-center">
                                    <div className="bg-light p-3 rounded-3 mb-2 border">
                                        <div style={{ width: "70px", height: "70px" }} className="mx-auto bg-dark rounded-1 d-flex align-items-center justify-content-center text-white small fw-bold">QR</div>
                                    </div>
                                    <button className="btn btn-outline-danger btn-sm rounded-pill w-100">Descargar Ticket</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// ============================================================
// 3. PESTAÑA: MIS FAVORITOS
// ============================================================
const TabFavoritos = () => {
    const [favorites, setFavorites] = useState([
        { id: 1, title: "Festival de Música Local", category: "Música", date: "25 de Agosto, 2026", image: "https://picsum.photos/seed/concert/600/400" },
        { id: 2, title: "Exposición de Arte Moderno", category: "Arte", date: "10 de Septiembre, 2026", image: "https://picsum.photos/seed/art/600/400" }
    ]);

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
const TabConfiguracion = ({ user }) => {
    const [name, setName] = useState(user.name || "");
    const [lastname, setLastname] = useState(user.lastname || "");
    const [birthdate, setBirthdate] = useState("1995-06-15");
    const [accountType, setAccountType] = useState("Persona");
    const [phone, setPhone] = useState("+58 412-1234567");
    // El estado avatar sigue siendo un string (la URL única)
    const [avatar, setAvatar] = useState(user.avatar || "");
    const [saved, setSaved] = useState(false);

    // NUEVA FUNCIÓN: Maneja la subida de la foto de perfil
    const handleAvatarUploaded = (urls) => {
        // Como Cloudinary devuelve un array, tomamos la primera imagen [0]
        if (urls && urls.length > 0) {
            setAvatar(urls[0]);
            // Opcional: Podrías llamar a handleSubmit aquí para guardar automáticamente
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría tu lógica para enviar 'avatar' (y demás datos) a tu backend
        console.log("Guardando perfil con avatar:", avatar);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {/* ... (cabecera y alerta de guardado) ... */}
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Configuración de cuenta</h1>
                <p className="text-muted mb-0">Actualiza tus datos personales, tipo de cuenta e información de contacto.</p>
            </div>

            {saved && <div className="alert alert-success rounded-3">¡Cambios guardados con éxito!</div>}

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        {/* ... (inputs de nombre, apellido, etc.) ... */}
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Nombre</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Apellido</label>
                            <input type="text" className="form-control" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Correo electrónico (No editable)</label>
                            <input type="email" className="form-control bg-light" value={user.email} disabled />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Teléfono (Opcional)</label>
                            <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+58 ..." />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Fecha de nacimiento</label>
                            <input type="date" className="form-control" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold small">Tipo de cuenta</label>
                            <select className="form-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                                <option value="Persona">Persona</option>
                                <option value="Empresa">Empresa / Organizador</option>
                            </select>
                        </div>

                        {/* CAMBIO AQUÍ: Reemplazamos el input de tipo "url" por el componente */}
                        <div className="col-12">
                            <label className="form-label fw-bold small d-block">Foto de perfil (Avatar)</label>
                            
                            <div className="d-flex align-items-center gap-3">
                                {/* Vista previa circular actual */}
                                <img 
                                    src={avatar || "https://via.placeholder.com/100"} 
                                    alt="Avatar" 
                                    className="rounded-circle border shadow-sm" 
                                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                                
                                {/* Componente de subida (reutilizable) */}
                                <div className="flex-grow-1">
                                    <ImageUpload onImagesUploaded={handleAvatarUploaded} />
                                    <small className="text-muted">Se recomienda una imagen cuadrada.</small>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-4">
                            <button type="submit" className="btn btn-danger rounded-pill px-4">Guardar cambios</button>
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

    const handleCreateEvent = (e) => {
        e.preventDefault();
        setEventCreated(true);
    };

    if (!isVerified) {
        return (
            <div className="animate__animated animate__fadeIn text-center py-5">
                <div className="card border-0 shadow-sm rounded-4 p-5 bg-white mx-auto" style={{ maxWidth: "550px" }}>
                    <div className="bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "80px", height: "80px", borderRadius: "50%" }}>
                        <AlertTriangle size={36} />
                    </div>
                    <h3 className="fw-bold mb-2 text-dark">Verificación de RIF requerida</h3>
                    <p className="text-muted mb-4">Para poder publicar eventos oficiales y vender entradas en Local Vibes, es obligatorio tener tu cuenta de empresa o RIF verificado.</p>
                    <button onClick={() => setActiveTab("verificaciones")} className="btn btn-danger rounded-pill px-5 py-2 fw-bold">
                        Ir a Verificaciones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Crear un nuevo evento</h1>
                <p className="text-muted mb-0">Publica tu evento, añade su cronograma y hazlo visible en la plataforma.</p>
            </div>

            {eventCreated ? (
                <div className="alert alert-success p-4 rounded-4 text-center">
                    <h4 className="fw-bold">¡Evento publicado con éxito! 🎉</h4>
                    <p className="mb-0">Ya se encuentra activo en la cartelera de Local Vibes.</p>
                    <button onClick={() => setEventCreated(false)} className="btn btn-dark mt-3 rounded-pill">Crear otro evento</button>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <form onSubmit={handleCreateEvent}>
                        <div className="row g-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small">Título del evento</label>
                                <input type="text" className="form-control" placeholder="Ej. Festival Rock Urbano" required />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small">Categoría</label>
                                <select className="form-select">
                                    <option>Música</option>
                                    <option>Gastronomía</option>
                                    <option>Teatro</option>
                                    <option>Deportes</option>
                                    <option>Arte</option>
                                    <option>Naturaleza</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small">Fecha</label>
                                <input type="date" className="form-control" required />
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label fw-bold small">Hora de inicio</label>
                                <input type="time" className="form-control" required />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small">Ubicación exacta / Local</label>
                                <input type="text" className="form-control" placeholder="Ej. Centro Cultural, Caracas" required />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small">URL de la imagen del evento</label>
                                <input type="url" className="form-control" placeholder="https://images.unsplash.com/..." required />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small">Cronograma / Itinerario (Horas clave)</label>
                                <textarea className="form-control" rows="3" placeholder="Ej: 5:00 PM - Apertura de puertas&#10;6:30 PM - Banda invitado&#10;9:00 PM - Concierto principal" required></textarea>
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold small">Descripción detallada</label>
                                <textarea className="form-control" rows="3" placeholder="Cuéntale a la gente por qué no deben perdérselo..." required></textarea>
                            </div>
                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-danger rounded-pill px-5 py-2">Publicar evento</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
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
            </div>
        </div>
    );
};


// ============================================================
// 7. PESTAÑA: COMUNICACIONES
// ============================================================
const TabComunicaciones = () => {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [weeklyNewsletter, setWeeklyNewsletter] = useState(false);

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Comunicaciones y Alertas</h1>
                <p className="text-muted mb-0">Elige cómo deseas recibir notificaciones sobre tus eventos y entradas.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" style={{ maxWidth: "600px" }}>
                <div className="d-flex flex-column gap-3">
                    <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                        <label className="form-check-label fw-bold small text-dark" htmlFor="emailSwitch">Alertas de entradas por correo electrónico</label>
                        <input className="form-check-input ms-2" type="checkbox" id="emailSwitch" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} style={{ transform: "scale(1.3)" }} />
                    </div>
                    <hr className="text-muted opacity-25" />
                    <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                        <label className="form-check-label fw-bold small text-dark" htmlFor="pushSwitch">Notificaciones Push en navegador</label>
                        <input className="form-check-input ms-2" type="checkbox" id="pushSwitch" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} style={{ transform: "scale(1.3)" }} />
                    </div>
                    <hr className="text-muted opacity-25" />
                    <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0">
                        <label className="form-check-label fw-bold small text-dark" htmlFor="newsSwitch">Boletín semanal con los mejores planes de Caracas</label>
                        <input className="form-check-input ms-2" type="checkbox" id="newsSwitch" checked={weeklyNewsletter} onChange={() => setWeeklyNewsletter(!weeklyNewsletter)} style={{ transform: "scale(1.3)" }} />
                    </div>
                </div>
            </div>
        </div>
    );
};


// ============================================================
// COMPONENTES AUXILIARES
// ============================================================
const TabHistorial = () => {
    const pastEvents = [
        { id: 1, title: "Concierto de Jazz Bajo las Estrellas", date: "12 de Julio, 2026", location: "Hatillo, Caracas", category: "Música", rating: 5, image: "https://picsum.photos/seed/jazz/600/400" },
        { id: 2, title: "Feria Gastronómica Sabor a Caracas", date: "28 de Junio, 2026", location: "Plaza Altamira, Caracas", category: "Gastronomía", rating: 4, image: "https://picsum.photos/seed/food/600/400" }
    ];

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="mb-4">
                <h1 className="fw-bold mb-2">Mi historial</h1>
                <p className="text-muted mb-0">Revisa los eventos a los que has asistido en el pasado.</p>
            </div>
            <div className="d-flex flex-column gap-3">
                {pastEvents.map((event) => (
                    <div key={event.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white p-3">
                        <div className="row g-3 align-items-center">
                            <div className="col-12 col-md-3">
                                <img src={event.image} alt={event.title} className="rounded-3 w-100 object-fit-cover" style={{ height: "120px" }} />
                            </div>
                            <div className="col-12 col-md-6">
                                <span className="badge bg-secondary bg-opacity-10 text-secondary mb-2 px-2 py-1">{event.category}</span>
                                <h5 className="fw-bold mb-1 text-dark">{event.title}</h5>
                                <p className="text-muted small mb-1">📅 Asististe el: {event.date}</p>
                                <p className="text-muted small mb-0">📍 {event.location}</p>
                            </div>
                            <div className="col-12 col-md-3 text-md-end">
                                <div className="text-warning small mb-2">⭐⭐⭐⭐⭐</div>
                                <button className="btn btn-outline-danger btn-sm rounded-pill px-3">Ver detalles</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon }) => (
    <div className="card border-0 shadow-sm h-100 rounded-4">
        <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <p className="text-muted small mb-2">{title}</p>
                    <h3 className="fw-bold mb-0">{value}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 text-danger rounded-3 p-2">{icon}</div>
            </div>
        </div>
    </div>
);

const ProfileMenuItem = ({ icon, text, active = false, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`btn text-start d-flex align-items-center gap-3 w-100 rounded-3 p-3 border-0 transition-all ${
                active ? "bg-danger bg-opacity-10 text-danger fw-bold" : "bg-transparent text-dark"
            }`}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-grow-1"><span className="d-block">{text}</span></div>
        </button>
    );
};