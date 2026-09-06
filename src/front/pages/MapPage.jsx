import React, { useState, useEffect } from "react";
import { EventsMap } from "../components/EventsMap";
import { EventModal } from "../components/EventModal"; // <-- Importamos el Modal
import { Search, MapPin, Layers, X } from "lucide-react";

export const MapPage = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // NUEVO ESTADO: Controla el evento que se mostrará en el Modal
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${backendUrl}/api/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        fetch(`${backendUrl}/api/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [backendUrl]);

    const filteredEvents = events.filter(event => {
        const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (event.location_name && event.location_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchCategory = selectedCategory ? event.category_id.toString() === selectedCategory : true;
        const matchCity = selectedCity ? (event.address && event.address.toLowerCase().includes(selectedCity.toLowerCase())) : true;
        return matchSearch && matchCategory && matchCity;
    });

    const eventsWithCategory = filteredEvents.map(ev => ({
        ...ev,
        categoryName: categories.find(c => c.id === ev.category_id)?.name || "Evento"
    }));

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedCity("");
    };

    return (
        <div className="position-relative w-100 bg-light" style={{ height: "85vh", overflow: "hidden" }}>
            
            <div className="position-absolute top-0 start-0 w-100 p-3 p-md-4" style={{ zIndex: 1000, pointerEvents: "none" }}>
                
                <div className="container-fluid max-w-1200" style={{ pointerEvents: "auto", maxWidth: "1200px" }}>
                    
                    <div className="bg-white bg-opacity-75 rounded-pill shadow-sm p-2 d-flex flex-column flex-md-row align-items-center gap-2 mb-3 backdrop-blur" style={{ backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.8)" }}>
                        
                        <div className="d-flex align-items-center px-3 border-end">
                            <MapPin size={18} className="text-danger me-2" />
                            <select className="form-select border-0 bg-transparent shadow-none fw-medium" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                <option value="">Caracas</option>
                                <option value="chacao">Chacao</option>
                                <option value="hatillo">El Hatillo</option>
                            </select>
                        </div>

                        <div className="d-flex align-items-center px-3 border-end d-none d-md-flex">
                            <Layers size={18} className="text-primary me-2" />
                            <select className="form-select border-0 bg-transparent shadow-none fw-medium" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Todas las categorías</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>

                        <div className="d-flex align-items-center px-3 flex-grow-1">
                            <Search size={18} className="text-muted me-2" />
                            <input 
                                type="text" 
                                className="form-control border-0 bg-transparent shadow-none" 
                                placeholder="Buscar en el mapa..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="d-flex align-items-center gap-2 px-2 ms-auto">
                            <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-medium d-flex align-items-center gap-2">
                                <span className="rounded-circle bg-success" style={{width: "8px", height: "8px"}}></span>
                                {eventsWithCategory.length} eventos
                            </span>
                            {(searchTerm || selectedCategory || selectedCity) && (
                                <button onClick={clearFilters} className="btn btn-white text-danger border rounded-pill px-3 fw-medium d-flex align-items-center bg-white shadow-sm">
                                    <X size={16} className="me-1" /> Limpiar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="d-flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                        <button 
                            className={`btn rounded-pill px-4 fw-medium flex-shrink-0 shadow-sm ${selectedCategory === "" ? "btn-dark" : "btn-white bg-white bg-opacity-75 border text-dark"}`}
                            onClick={() => setSelectedCategory("")}
                        >
                            Todas las categorías
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                className={`btn rounded-pill px-4 fw-medium flex-shrink-0 shadow-sm ${selectedCategory === cat.id.toString() ? "btn-dark" : "btn-white bg-white bg-opacity-75 border text-dark"}`}
                                onClick={() => setSelectedCategory(cat.id.toString())}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            ) : (
                // Pasamos la función setSelectedEvent al mapa
                <EventsMap events={eventsWithCategory} height="100%" onOpenModal={setSelectedEvent} />
            )}

            {/* RENDERIZADO DEL MODAL (Aparece superpuesto cuando se selecciona un evento) */}
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent} 
                    categoryName={selectedEvent.categoryName} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
};