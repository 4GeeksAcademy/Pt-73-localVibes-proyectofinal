import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Calendar, MapPin, AlignLeft, DollarSign, Users, Search, Clock, X, Lock } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ImageUpload } from "../components/ImageUpload";

// =========================================================
// MINI COMPONENTES (Mismos que CreateEvent)
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

const TimeSelect = ({ label, time, setTime, prefix }) => {
    const hours = ['12','01','02','03','04','05','06','07','08','09','10','11'];
    const minutes = ['00','15','30','45'];
    
    return (
        <div className="col-12 col-md-4">
            <label className="form-label fw-bold text-secondary mb-2 d-flex align-items-center" style={{ fontSize: "0.85rem" }}>
                <Clock size={14} className="me-1"/> {label}
            </label>
            <div className="d-flex align-items-center justify-content-start gap-2 bg-white p-2 rounded-pill border shadow-sm" style={{ width: "fit-content" }}>
                <select className="form-control custom-time-select bg-light text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" value={time[`${prefix}H`]} onChange={e => setTime({...time, [`${prefix}H`]: e.target.value})} style={{ width: "45px", fontSize: "0.9rem", cursor: "pointer" }}>
                    {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span className="fw-bold text-muted" style={{ fontSize: "1.1rem", paddingBottom: "2px" }}>:</span>
                <select className="form-control custom-time-select bg-light text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" value={time[`${prefix}M`]} onChange={e => setTime({...time, [`${prefix}M`]: e.target.value})} style={{ width: "45px", fontSize: "0.9rem", cursor: "pointer" }}>
                    {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="form-control custom-time-select text-center fw-bold border-0 rounded-pill px-0 py-1 shadow-none" value={time[`${prefix}A`]} onChange={e => setTime({...time, [`${prefix}A`]: e.target.value})} style={{ width: "55px", fontSize: "0.85rem", background: "#ff523b", color: "white", cursor: "pointer" }}>
                    <option value="AM">AM</option><option value="PM">PM</option>
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
// COMPONENTE PRINCIPAL (EditEvent)
// =========================================================
export const EditEvent = () => {
    const { id } = useParams(); // Obtenemos el ID de la URL
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";
    const today = new Date().toISOString().split("T")[0]; 

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true); 
    const [error, setError] = useState("");
    
    const [timeError, setTimeError] = useState("");
    const [dateError, setDateError] = useState("");

    const [eventImage, setEventImage] = useState(null); 

    const [formData, setFormData] = useState({
        title: "", category_id: "", location_name: "", address: "", event_date: "",
        description: "", price: "", capacity: "", latitude: "", longitude: ""    
    });

    const [time, setTime] = useState({
        startH: "07", startM: "00", startA: "PM",
        endH: "11", endM: "00", endA: "PM"
    });

    const [isFreeEvent, setIsFreeEvent] = useState(false);
    
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearchingMap, setIsSearchingMap] = useState(false);
    const searchTimeoutRef = useRef(null);

    // ======================== EFECTOS ========================
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        Promise.all([
            fetch(`${backendUrl}/api/categories`).then(res => res.json()),
            fetch(`${backendUrl}/api/events/${id}`).then(res => res.json())
        ])
        .then(([catsData, eventData]) => {
            setCategories(catsData);
            
            const datePart = eventData.start_time ? eventData.start_time.split("T")[0] : "";
            
            let newTime = { ...time };
            
            if (eventData.start_time && eventData.start_time.includes("T")) {
                const startTimePart = eventData.start_time.split("T")[1];
                const [sH, sM] = startTimePart.split(":");
                let hr = parseInt(sH);
                newTime.startA = hr >= 12 ? "PM" : "AM";
                if (hr > 12) hr -= 12;
                if (hr === 0) hr = 12;
                newTime.startH = hr.toString().padStart(2, '0');
                newTime.startM = sM;
            }

            if (eventData.end_time) {
                const [eH, eM] = eventData.end_time.split(":");
                let hr = parseInt(eH);
                newTime.endA = hr >= 12 ? "PM" : "AM";
                if (hr > 12) hr -= 12;
                if (hr === 0) hr = 12;
                newTime.endH = hr.toString().padStart(2, '0');
                newTime.endM = eM;
            }

            let cleanDescription = eventData.description || "";
            if (cleanDescription.includes("Hora de finalización estimada:")) {
                const splitDesc = cleanDescription.split("\n\n");
                cleanDescription = splitDesc.length > 1 ? splitDesc.slice(1).join("\n\n") : "";
            }

            setFormData({
                title: eventData.title || "",
                category_id: eventData.category_id || "",
                location_name: eventData.location_name || "",
                address: eventData.address || "",
                event_date: datePart,
                description: cleanDescription,
                price: eventData.price || "",
                capacity: eventData.capacity || "",
                latitude: eventData.latitude || "",
                longitude: eventData.longitude || ""
            });

            setTime(newTime);
            setIsFreeEvent(eventData.price === 0 || eventData.price === 0.0);
            
            if (eventData.imgs_event && eventData.imgs_event.length > 0) {
                setEventImage(eventData.imgs_event[0]);
            }

            setIsLoadingData(false);
        })
        .catch(err => {
            console.error(err);
            setError("Error al cargar los datos del evento");
            setIsLoadingData(false);
        });
    }, [backendUrl, id]);

    useEffect(() => {
        setDateError("");
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

    const handleAddressSearch = (e) => {
        const query = e.target.value;
        setFormData({ ...formData, address: query });
        if (query.length > 3) {
            setIsSearchingMap(true);
            clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(async () => {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ve`);
                setSearchResults(await res.json());
                setShowDropdown(true);
                setIsSearchingMap(false);
            }, 700);
        } else setShowDropdown(false);
    };

    const compileTime = (h, m, a) => {
        let hrs = parseInt(h);
        if(a === "PM" && hrs !== 12) hrs += 12;
        if(a === "AM" && hrs === 12) hrs = 0;
        return `${hrs.toString().padStart(2, '0')}:${m}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (timeError) return setError("Corrige las horas del evento.");
        if (!formData.event_date) return setError("Debes seleccionar la fecha del evento.");
        
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
                    const cloudData = new FormData();
                    cloudData.append("file", eventImage); 
                    cloudData.append("upload_preset", "TU_UPLOAD_PRESET");
                    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/shhfhqyk/image/upload`, { 
                        method: "POST", 
                        body: cloudData 
                    });
                    if (!cloudRes.ok) throw new Error("Error subiendo la imagen a Cloudinary");
                    const cloudJson = await cloudRes.json();
                    uploadedImagesUrls.push(cloudJson.secure_url);
                }
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
                imgs_event: uploadedImagesUrls
            };

            const response = await fetch(`${backendUrl}/api/events/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(finalEventData)
            });

            if (response.ok) navigate("/profile"); 
            else throw new Error((await response.json()).message || "Error al actualizar el evento");

        } catch (err) { 
            setError(err.message); 
        } finally { 
            setIsSubmitting(false); 
        }
    };

    if (isLoadingData && isLoggedIn) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><span className="spinner-border text-danger"></span></div>;
    }

    return (
        <div className="container-fluid bg-light py-5 position-relative" style={{ minHeight: "100vh" }}>
            
            {!isLoggedIn && (
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center" style={{ zIndex: 9999, backdropFilter: "blur(8px)", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                    <div className="card shadow-lg border-0 rounded-4 p-5 text-center animate__animated animate__zoomIn" style={{ maxWidth: "450px" }}>
                        <Lock size={48} className="text-danger mx-auto mb-4" />
                        <h3 className="fw-bold mb-3">Acceso Restringido</h3>
                        <div className="d-flex gap-3 justify-content-center mt-4">
                            <Link to="/profile" className="btn btn-light rounded-pill px-4 py-2 border">Volver</Link>
                            <Link to="/login" className="btn text-white rounded-pill px-4 py-2 shadow-sm" style={{ background: orangeGradient }}>Iniciar Sesión</Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ maxWidth: "800px" }}>
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <Link to="/profile" className="btn btn-light rounded-pill border px-3 fw-medium">Volver</Link>
                    <h2 className="fw-bold m-0" style={{ color: "#2b2b2b" }}>Editar Evento</h2>
                    <div style={{ width: "80px" }}></div>
                </div>

                {error && <div className="alert alert-danger rounded-4 shadow-sm border-0">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white p-4 p-md-5 rounded-4 shadow-sm border-0">
                    
                    <div className="mb-4">
                        <label className="form-label fw-bold">Imagen del evento (Flyer)</label>
                        <ImageUpload 
                            currentImage={typeof eventImage === 'string' ? eventImage : null}
                            onImagesUploaded={(urls) => {
                                if (Array.isArray(urls) && urls.length > 0) {
                                    setEventImage(urls[0]);
                                } else {
                                    setEventImage(urls);
                                }
                            }} 
                        />
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-md-8">
                            <label className="form-label fw-bold">Título del evento *</label>
                            <input type="text" className="form-control rounded-3 py-2" name="title" value={formData.title} onChange={handleChange} required />
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="form-label fw-bold">Categoría *</label>
                            <select className="form-select rounded-3 py-2" name="category_id" value={formData.category_id} onChange={handleChange} required>
                                <option value="">Seleccionar...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="col-12">
                            <div className="p-4 bg-light rounded-4 border">
                                <h6 className="fw-bold mb-4 border-bottom pb-2" style={{ color: "#ff523b" }}><Calendar size={20} className="me-2"/> Fecha y Horario</h6>
                                <div className="row g-4">
                                    <div className="col-12 col-md-4">
                                        <label className="form-label fw-bold text-secondary mb-2" style={{ fontSize: "0.85rem" }}>Fecha del evento</label>
                                        <input type="date" className={`form-control rounded-3 py-2 shadow-sm border-0 cursor-pointer text-muted fw-medium ${dateError ? 'is-invalid' : ''}`} name="event_date" value={formData.event_date} onChange={handleChange} required />
                                    </div>
                                    <TimeSelect label="Hora de Inicio" time={time} setTime={setTime} prefix="start" />
                                    <TimeSelect label="Hora de Fin" time={time} setTime={setTime} prefix="end" />
                                    {timeError && <div className="col-12 text-danger small fw-bold mt-2 d-flex align-items-center"><X size={16} className="me-1"/> {timeError}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold"><MapPin size={18} className="me-2 text-danger"/> Lugar *</label>
                            <input type="text" className="form-control rounded-3 py-2" name="location_name" value={formData.location_name} onChange={handleChange} required />
                        </div>
                        <div className="col-12 col-md-6 position-relative">
                            <label className="form-label fw-bold"><Search size={18} className="me-2 text-danger"/> Buscar Dirección</label>
                            <input type="text" className="form-control rounded-3 py-2" value={formData.address} onChange={handleAddressSearch} autoComplete="off"/>
                            {showDropdown && searchResults.length > 0 && (
                                <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg" style={{ zIndex: 1000, top: "100%", maxHeight: "200px", overflowY: "auto" }}>
                                    {searchResults.map((loc, idx) => (
                                        <div key={idx} className="p-3 border-bottom text-truncate cursor-pointer hover-bg-light" onClick={() => {
                                            setFormData({...formData, address: loc.display_name, latitude: parseFloat(loc.lat), longitude: parseFloat(loc.lon)});
                                            setShowDropdown(false);
                                        }}><MapPin size={14} className="text-danger me-2 d-inline" />{loc.display_name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="col-12">
                            <div className="rounded-4 overflow-hidden border shadow-sm" style={{ height: "250px", zIndex: 1 }}>
                                <MapContainer center={formData.latitude ? [formData.latitude, formData.longitude] : [10.4806, -66.9036]} zoom={12} style={{ height: "100%", cursor: "crosshair" }}>
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <MapEventsListener setFormData={setFormData} />
                                    {formData.latitude && <Marker position={[formData.latitude, formData.longitude]} icon={customMarker} />}
                                    <MapAutoUpdater lat={formData.latitude} lng={formData.longitude} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold d-flex justify-content-between">
                                <span><DollarSign size={18} className="me-1 text-success"/> Precio ($)</span>
                                <div className="form-check form-switch m-0">
                                    <input className="form-check-input cursor-pointer" type="checkbox" checked={isFreeEvent} onChange={() => { setIsFreeEvent(!isFreeEvent); if(!isFreeEvent) setFormData({...formData, price: ""}); }}/>
                                    <label className="form-check-label small text-muted">Gratis</label>
                                </div>
                            </label>
                            <input type="number" step="0.01" min="0" className={`form-control rounded-3 py-2 shadow-sm ${isFreeEvent ? 'bg-light' : ''}`} name="price" value={isFreeEvent ? "0" : formData.price} onChange={handleChange} disabled={isFreeEvent}/>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="form-label fw-bold"><Users size={18} className="me-2 text-primary"/> Aforo máximo</label>
                            <input type="number" min="1" className="form-control rounded-3 py-2 shadow-sm" name="capacity" value={formData.capacity} onChange={handleChange} />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold"><AlignLeft size={18} className="me-2 text-secondary"/> Descripción detallada</label>
                            <textarea className="form-control rounded-3 shadow-sm" rows="4" name="description" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <hr className="my-5 text-light" />
                    <button type="submit" disabled={isSubmitting || timeError || dateError} className="btn w-100 rounded-pill py-3 fw-bold text-white fs-5 shadow-sm transition-all hover-scale" style={{ background: (timeError || dateError) ? "#ccc" : orangeGradient, border: "none" }}>
                        {isSubmitting ? "Guardando Cambios..." : "Actualizar Evento"}
                    </button>
                </form>
            </div>
            
            <style>{`
                .custom-time-select { appearance: none !important; -webkit-appearance: none !important; -moz-appearance: none !important; background-image: none !important; padding-right: 0 !important; }
                .custom-time-select::-ms-expand { display: none !important; }
                .custom-time-select:hover { background-color: #e2e8f0 !important; }
                .custom-time-select[style*="color: white"]:hover { filter: brightness(0.9); background-color: #ff523b !important; }
                .cursor-pointer { cursor: pointer; }
                .hover-scale { transition: transform 0.2s; }
                .hover-scale:hover { transform: scale(1.02); }
                .hover-bg-light:hover { background-color: #f8f9fa; }
                .form-control:focus, .form-select:focus { border-color: #ff7a00; box-shadow: 0 0 0 0.25rem rgba(255, 122, 0, 0.25); }
            `}</style>
        </div>
    );
};