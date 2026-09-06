import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Calendar as CalendarIcon, Calendar, MapPin, AlignLeft, DollarSign, Users, Search, Clock, Mic, X, Plus, Lock, Info, Phone, ImagePlus } from "lucide-react";
import { LocationPicker } from "../components/LocationPicker";
import { ImageUpload } from "../components/ImageUpload";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// =========================================================
// MINI COMPONENTES
// =========================================================
const customMarker = new L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: #ff523b; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24], iconAnchor: [12, 12]
});

const MapAutoUpdater = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => { if (lat && lng) map.flyTo([lat, lng], 16, { duration: 1.5 }); }, [lat, lng, map]);
    return null;
};

// Selector de Tiempo Premium (Estilo Píldora Minimalista SIN flechas)
const TimeSelect = ({ label, time, setTime, prefix }) => {
    const hours = ['12','01','02','03','04','05','06','07','08','09','10','11'];
    const minutes = ['00','15','30','45'];
    
    return (
        <div className="col-12 col-md-4">
            <label className="form-label fw-bold text-secondary mb-2 d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                <Clock size={14} className="me-1"/> {label}
            </label>
            <div className="d-flex align-items-center justify-content-start gap-2 bg-white p-2 rounded-pill border shadow-sm" style={{ width: "fit-content" }}>
                
                <select 
                    className="form-control custom-time-select bg-light text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" 
                    value={time[`${prefix}H`]} 
                    onChange={e => setTime({...time, [`${prefix}H`]: e.target.value})}
                    style={{ width: "45px", fontSize: "0.9rem", cursor: "pointer" }}
                >
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                
                <span className="fw-bold text-muted" style={{ fontSize: "1.1rem", paddingBottom: "2px" }}>:</span>
                
                <select 
                    className="form-control custom-time-select bg-light text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" 
                    value={time[`${prefix}M`]} 
                    onChange={e => setTime({...time, [`${prefix}M`]: e.target.value})}
                    style={{ width: "45px", fontSize: "0.9rem", cursor: "pointer" }}
                >
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                
                <select 
                    className="form-control custom-time-select text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" 
                    value={time[`${prefix}A`]} 
                    onChange={e => setTime({...time, [`${prefix}A`]: e.target.value})}
                    style={{ width: "55px", fontSize: "0.85rem", background: "#ff523b", color: "white", cursor: "pointer" }}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
};

const MapEventsListener = ({ setFormData }) => {
    useMapEvents({ click(e) { setFormData(prev => ({ ...prev, latitude: e.latlng.lat, longitude: e.latlng.lng })); }});
    return null;
};

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
export const CreateEvent = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    const today = new Date().toISOString().split("T")[0]; 

    // Estados Generales
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);
    
    // Estados de Validación
    const [timeError, setTimeError] = useState("");
    const [dateError, setDateError] = useState("");

    // Estado único para la imagen del evento
    const [eventImage, setEventImage] = useState(null); 

    // Formulario Principal unificado
    const [formData, setFormData] = useState({
        title: "",
        category_id: "",
        start_time: "",
        end_time: "",
        description: "",
        image_url: "",
        location_name: "",
        address: "",
        event_date: "",
        latitude: null,
        longitude: null,
        contact_phone: "",
        price: "",
        capacity: ""
    });

    const [time, setTime] = useState({
        startH: "07", startM: "00", startA: "PM",
        endH: "11", endM: "00", endA: "PM"
    });

    const [isFreeEvent, setIsFreeEvent] = useState(false);
    const [hasGuests, setHasGuests] = useState(false);
    const [guestList, setGuestList] = useState([]);
    const [currentGuest, setCurrentGuest] = useState("");
    
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeoutRef = useRef(null);

    // ======================== EFECTOS ========================
    useEffect(() => {
        if (!localStorage.getItem("token")) setIsLoggedIn(false);
        fetch(`${backendUrl}/api/categories`).then(res => res.json()).then(setCategories).catch(console.error);
    }, [backendUrl]);

    useEffect(() => {
        if (formData.event_date && formData.event_date < today) {
            setDateError("La fecha del evento no puede ser anterior al día de hoy.");
        } else {
            setDateError("");
        }
    }, [formData.event_date, today]);

    useEffect(() => {
        const getMins = (h, m, a) => {
            let hrs = parseInt(h);
            if(a === "PM" && hrs !== 12) hrs += 12;
            if(a === "AM" && hrs === 12) hrs = 0;
            return (hrs * 60) + parseInt(m);
        };
        const startTotal = getMins(time.startH, time.startM, time.startA);
        const endTotal = getMins(time.endH, time.endM, time.endA);
        
        setTimeError(startTotal >= endTotal ? "La hora de fin debe ser posterior a la de inicio." : "");
    }, [time]);

    // ======================== FUNCIONES ========================
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGuests = (e, action, guest = null) => {
        e.preventDefault();
        if (action === "ADD" && currentGuest.trim() && !guestList.includes(currentGuest.trim())) {
            setGuestList([...guestList, currentGuest.trim()]);
            setCurrentGuest("");
        }
        if (action === "REMOVE") setGuestList(guestList.filter(g => g !== guest));
    };

    const handleAddressSearch = (e) => {
        const query = e.target.value;
        setFormData({ ...formData, address: query });
        if (query.length > 3) {
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(async () => {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ve`);
                setSearchResults(await res.json());
                setShowDropdown(true);
            }, 700);
        } else setShowDropdown(false);
    };

    const compileTime = (h, m, a) => {
        let hrs = parseInt(h);
        if(a === "PM" && hrs !== 12) hrs += 12;
        if(a === "AM" && hrs === 12) hrs = 0;
        return `${hrs.toString().padStart(2, '0')}:${m}`;
    };

    const handleImagesUploaded = (urls) => {
        if (urls && urls.length > 0) {
            setFormData(prev => ({ ...prev, image_url: urls[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (dateError) return setError("Por favor, corrige la fecha del evento.");
        if (timeError) return setError("Corrige las horas del evento.");
        if (!formData.event_date) return setError("Debes seleccionar la fecha del evento.");
        
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setError("Por favor, revisa los campos en rojo y completa la información correctamente.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            setValidated(true);
            setError("Debes seleccionar la ubicación del evento en el mapa.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        setValidated(true);
        setIsSubmitting(true);
        const token = localStorage.getItem("token");

        try {
            let uploadedImagesUrls = [];
            
            if (eventImage) {
                if (typeof eventImage === "string") {
                    uploadedImagesUrls.push(eventImage);
                } else if (Array.isArray(eventImage) && eventImage.length > 0) {
                    uploadedImagesUrls = eventImage;
                } else {
                    uploadedImagesUrls.push(formData.image_url);
                }
            } else if (formData.image_url) {
                uploadedImagesUrls.push(formData.image_url);
            }

            const startTime24 = compileTime(time.startH, time.startM, time.startA);
            const endTime24 = compileTime(time.endH, time.endM, time.endA);
            const combinedStartTime = `${formData.event_date}T${startTime24}`;

            const finalEventData = {
                ...formData,
                start_time: combinedStartTime,
                end_time: endTime24,
                description: `Hora de finalización estimada: ${endTime24}\n\n${formData.description}`,
                price: isFreeEvent ? 0.0 : (parseFloat(formData.price) || 0.0),       
                capacity: parseInt(formData.capacity) || null,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                imgs_event: uploadedImagesUrls,
                guests: hasGuests ? guestList : []
            };

            const response = await fetch(`${backendUrl}/api/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(finalEventData)
            });

            if (response.ok) navigate("/events"); 
            else throw new Error((await response.json()).message || "Error al crear el evento");

        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="container-fluid bg-light py-5 position-relative" style={{ minHeight: "100vh" }}>
            
            {!isLoggedIn && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: 9999, backdropFilter: "blur(8px)", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                    <div className="card shadow-lg border-0 rounded-4 p-5 text-center" style={{ maxWidth: "450px" }}>
                        <Lock size={48} className="text-danger mx-auto mb-4" />
                        <h3 className="fw-bold mb-3">Acceso Restringido</h3>
                        <p className="text-muted mb-4">Inicia sesión para publicar y gestionar eventos.</p>
                        <div className="d-flex gap-3 justify-content-center">
                            <Link to="/events" className="btn btn-light rounded-pill px-4 py-2 border">Volver</Link>
                            <Link to="/login" className="btn text-white rounded-pill px-4 py-2 shadow-sm" style={{ background: orangeGradient }}>Iniciar Sesión</Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ maxWidth: "900px", filter: !isLoggedIn ? "blur(4px)" : "none", pointerEvents: !isLoggedIn ? "none" : "auto" }}>
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Publicar Nuevo Evento</h2>
                    <p className="text-muted">Completa los detalles para que la comunidad descubra tu evento.</p>
                </div>

                {error && <div className="alert alert-danger rounded-4 shadow-sm border-0"><Info size={18} className="me-2" />{error}</div>}

                <form onSubmit={handleSubmit} className={`row g-4 needs-validation ${validated ? 'was-validated' : ''}`} noValidate>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h5 className="fw-bold d-flex align-items-center mb-4">
                                <Info size={20} className="me-2 text-danger" /> Información Básica
                            </h5>

                            <div className="row g-3">
                                <div className="col-12 col-md-8">
                                    <label className="form-label fw-medium">Nombre del Evento <span className="text-danger">*</span></label>
                                    <input type="text" name="title" className="form-control bg-light border-0 py-2" value={formData.title} onChange={handleChange} required placeholder="Ej: Concierto Sinfónico, Torneo de Pádel..." />
                                    <div className="invalid-feedback">El nombre del evento es obligatorio.</div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-medium">Categoría <span className="text-danger">*</span></label>
                                    <select className="form-select bg-light border-0 py-2" name="category_id" value={formData.category_id} onChange={handleChange} required>
                                        <option value="">Seleccionar...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    <div className="invalid-feedback">Selecciona una categoría.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h6 className="fw-bold mb-4 border-bottom pb-2" style={{ color: "#ff523b" }}>
                                <Calendar size={20} className="me-2"/> Fecha y Horario
                            </h6>
                            <div className="row g-4">
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-bold text-secondary mb-2" style={{ fontSize: "0.85rem" }}>Fecha del evento</label>
                                    <input 
                                        type="date" 
                                        className={`form-control rounded-3 py-2 shadow-sm border-0 cursor-pointer text-muted fw-medium ${dateError ? 'is-invalid' : ''}`} 
                                        name="event_date" 
                                        value={formData.event_date} 
                                        onChange={handleChange} 
                                        min={today} 
                                        required 
                                    />
                                    {dateError && <div className="text-danger small fw-bold mt-2 d-flex align-items-center"><X size={14} className="me-1"/> {dateError}</div>}
                                </div>
                                
                                <TimeSelect label="Hora de Inicio" time={time} setTime={setTime} prefix="start" />
                                <TimeSelect label="Hora de Fin" time={time} setTime={setTime} prefix="end" />
                                
                                {timeError && <div className="col-12 text-danger small fw-bold mt-2 d-flex align-items-center"><X size={16} className="me-1"/> {timeError}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold d-flex align-items-center mb-4">
                                <MapPin size={20} className="me-2 text-danger" /> Ubicación
                            </h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-medium">Nombre del Lugar <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control bg-light border-0 py-2" name="location_name" value={formData.location_name} onChange={handleChange} required placeholder="Ej: Teatro Municipal" />
                                </div>
                                <div className="col-12 col-md-6 position-relative">
                                    <label className="form-label fw-medium">Buscar Dirección</label>
                                    <input type="text" className="form-control bg-light border-0 py-2" value={formData.address} onChange={handleAddressSearch} autoComplete="off" placeholder="Escribe para buscar..." />
                                    {showDropdown && searchResults.length > 0 && (
                                        <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg" style={{ zIndex: 1000, top: "100%", maxHeight: "200px", overflowY: "auto" }}>
                                            {searchResults.map((loc, idx) => (
                                                <div key={idx} className="p-3 border-bottom text-truncate cursor-pointer hover-bg-light" onClick={() => {
                                                    setFormData({...formData, address: loc.display_name, latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lon)});
                                                    setShowDropdown(false);
                                                }}>
                                                    <MapPin size={14} className="text-danger me-2 d-inline" />{loc.display_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="col-12 mt-3">
                                    <div className="rounded-4 overflow-hidden border shadow-sm" style={{ height: "250px", zIndex: 1 }}>
                                        <MapContainer center={formData.latitude ? [formData.latitude, formData.longitude] : [10.4806, -66.9036]} zoom={12} style={{ height: "100%", cursor: "crosshair" }}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <MapEventsListener setFormData={setFormData} />
                                            {formData.latitude && <Marker position={[formData.latitude, formData.longitude]} icon={customMarker} />}
                                            <MapAutoUpdater lat={formData.latitude} lng={formData.longitude} />
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold d-flex align-items-center mb-4">
                                <DollarSign size={20} className="me-2 text-danger" /> Detalles y Costos
                            </h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label fw-medium mb-0">Precio ($)</label>
                                        <div className="form-check form-switch m-0">
                                            <input className="form-check-input cursor-pointer" type="checkbox" checked={isFreeEvent} onChange={() => { setIsFreeEvent(!isFreeEvent); if(!isFreeEvent) setFormData({...formData, price: ""}); }}/>
                                            <label className="form-check-label small text-muted">Gratis</label>
                                        </div>
                                    </div>
                                    <input type="number" step="0.01" min="0" className={`form-control bg-light border-0 py-2 ${isFreeEvent ? 'text-muted' : ''}`} name="price" value={isFreeEvent ? "0" : formData.price} onChange={handleChange} disabled={isFreeEvent} placeholder="0.00" />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-medium">Aforo máximo</label>
                                    <input type="number" min="1" className="form-control bg-light border-0 py-2" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Ej: 100" />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Número de Contacto (Opcional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><Phone size={18} className="text-muted" /></span>
                                        <input type="tel" name="contact_phone" className="form-control bg-light border-0 py-2" value={formData.contact_phone} onChange={handleChange} placeholder="Ej: +58 412 123 4567" />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-medium">Descripción del Evento <span className="text-danger">*</span></label>
                                    <textarea
                                        name="description"
                                        className="form-control bg-light border-0 py-2"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        minLength="50"
                                        placeholder="Detalla de qué trata el evento... (Mínimo 50 caracteres)"
                                    ></textarea>
                                    <div className={`mt-1 small fw-medium text-end ${formData.description.length > 0 && formData.description.length < 50 ? 'text-danger' : 'text-muted'}`}>
                                        {formData.description.length} / 50 caracteres mínimos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold d-flex align-items-center mb-3">
                                <Mic size={20} className="me-2 text-danger" /> Invitados Especiales
                            </h5>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted small">¿El evento cuenta con artistas o invitados especiales?</span>
                                <div className="form-check form-switch m-0">
                                    <input className="form-check-input shadow-none cursor-pointer" type="checkbox" role="switch" checked={hasGuests} onChange={() => { setHasGuests(!hasGuests); if(hasGuests) setGuestList([]); }}/>
                                </div>
                            </div>
                            {hasGuests && (
                                <div className="mt-3 pt-3 border-top">
                                    <div className="d-flex gap-2 mb-3">
                                        <input type="text" className="form-control bg-light border-0 shadow-sm" placeholder="Ej: DJ Sam..." value={currentGuest} onChange={(e) => setCurrentGuest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGuests(e, 'ADD')} />
                                        <button type="button" className="btn btn-dark rounded-3 px-3 shadow-sm" onClick={(e) => handleGuests(e, 'ADD')} disabled={!currentGuest.trim()}><Plus size={18} /></button>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {guestList.map((g, i) => (
                                            <span key={i} className="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill d-flex align-items-center fw-medium">
                                                {g} <X size={14} className="ms-2 text-danger cursor-pointer" onClick={(e) => handleGuests(e, 'REMOVE', g)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <label className="form-label fw-medium d-flex align-items-center mb-3">
                                <ImagePlus size={20} className="me-2 text-danger" />
                                Sube las fotos del evento (Opcional)
                            </label>
                            <div className="bg-light p-3 rounded-3 border-0">
                                <ImageUpload onImagesUploaded={handleImagesUploaded} />
                            </div>
                        </div>
                    </div>

                    <div className="col-12">
                        <button 
                            type="submit" 
                            disabled={isSubmitting || timeError || dateError} 
                            className="btn w-100 rounded-pill py-3 fw-bold text-white fs-5 shadow-sm transition-all hover-scale" 
                            style={{ background: (timeError || dateError) ? "#ccc" : orangeGradient, border: "none" }}
                        >
                            {isSubmitting ? "Publicando evento..." : "Crear Evento"}
                        </button>
                    </div>
                </form>
            </div>
            
            <style>{`
                .custom-time-select {
                    appearance: none !important; 
                    -webkit-appearance: none !important;
                    -moz-appearance: none !important;
                    background-image: none !important;
                    padding-right: 0 !important; 
                }
                .custom-time-select::-ms-expand { display: none !important; }
                .custom-time-select:hover { background-color: #e2e8f0 !important; }
                .custom-time-select[style*="color: white"]:hover {
                    filter: brightness(0.9);
                    background-color: #ff523b !important;
                }
                .cursor-pointer { cursor: pointer; }
                .hover-scale { transition: transform 0.2s; }
                .hover-scale:hover { transform: scale(1.02); }
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .form-control:focus, .form-select:focus { border-color: #ff7a00; box-shadow: 0 0 0 0.25rem rgba(255, 122, 0, 0.25); }
            `}</style>
        </div>
    );
};