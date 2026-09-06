import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { EventListCard } from "../components/EventListCard";
import { EventCard } from "../components/EventCard"; 
import { EventModal } from "../components/EventModal";

import { Search, List, LayoutGrid, X, Compass, Filter } from "lucide-react";

export const Events = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); 

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    
    // Estado que controla si se ve en lista o cuadrícula
    const [viewMode, setViewMode] = useState("list");

    const [searchInput, setSearchInput] = useState(""); 
    const [searchTerm, setSearchTerm] = useState("");   
    const [isSearching, setIsSearching] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

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
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [backendUrl]);

    useEffect(() => {
        setIsSearching(true);
        const delayDebounceFn = setTimeout(() => {
            setSearchTerm(searchInput);
            setIsSearching(false);
        }, 600);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    const filteredEvents = events.filter(event => {
        const matchSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (event.location_name && event.location_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchCategory = selectedCategory ? event.category_id.toString() === selectedCategory : true;
        const matchCity = selectedCity ? (event.address && event.address.toLowerCase().includes(selectedCity.toLowerCase())) : true;
        
        return matchSearch && matchCategory && matchCity;
    });

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id.toString() === id.toString());
        return cat ? cat.name : "Evento";
    };

    const activeCatName = categories.find(c => c.id.toString() === selectedCategory)?.name;
    const hasActiveFilters = searchTerm !== "" || selectedCategory !== "" || selectedCity !== "";

    const clearAllFilters = () => {
        setSearchInput(""); 
        setSearchTerm("");  
        setSelectedCategory("");
        setSelectedCity("");
    };

    return (
        <div className="container py-4 animate__animated animate__fadeIn" style={{ maxWidth: "1100px" }}>
            
            {/* ENCABEZADO */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1" style={{ color: "#2b2b2b" }}>Explorar eventos</h2>
                <p className="text-muted">Descubre todos los eventos que tenemos disponibles para ti.</p>
            </div>

            {/* BARRA DE FILTROS PREMIUM */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 bg-white">
                <div className="card-body p-4">
                    <div className="row g-3 align-items-center">
                        
                        {/* BUSCADOR */}
                        <div className="col-12 col-lg-4">
                            <div className="input-group rounded-pill border bg-light overflow-hidden transition-all">
                                <span className="input-group-text bg-transparent border-0 text-muted ps-3">
                                    {isSearching ? <span className="spinner-border spinner-border-sm text-danger"></span> : <Search size={18} />}
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 shadow-none ps-2" 
                                    placeholder="Buscar por nombre o lugar..." 
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* SELECT: CATEGORÍA */}
                        <div className="col-6 col-md-3 col-lg-2">
                            <select className="form-select rounded-pill bg-light border-0 shadow-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Todas las categorías</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* SELECT: CIUDAD */}
                        <div className="col-6 col-md-3 col-lg-2">
                            <select className="form-select rounded-pill bg-light border-0 shadow-none" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                <option value="">Cualquier ciudad</option>
                                <option value="caracas">Caracas</option>
                                <option value="hatillo">El Hatillo</option>
                                <option value="chacao">Chacao</option>
                            </select>
                        </div>

                        {/* SELECT: PRECIO */}
                        <div className="col-6 col-md-3 col-lg-2">
                            <select className="form-select rounded-pill bg-light border-0 shadow-none">
                                <option value="">Cualquier precio</option>
                                <option value="free">Gratis</option>
                                <option value="paid">De pago</option>
                            </select>
                        </div>

                        {/* BOTONES DE VISTA (LISTA VS CUADRÍCULA) */}
                        <div className="col-6 col-md-3 col-lg-2 d-flex justify-content-end gap-2">
                            <button 
                                className="btn rounded-circle d-flex align-items-center justify-content-center transition-all" 
                                onClick={() => setViewMode('list')} 
                                style={viewMode === 'list' ? { background: orangeGradient, color: 'white', border: 'none', width: '42px', height: '42px' } : { backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6', width: '42px', height: '42px' }}
                            >
                                <List size={18} />
                            </button>
                            <button 
                                className="btn rounded-circle d-flex align-items-center justify-content-center transition-all" 
                                onClick={() => setViewMode('grid')} 
                                style={viewMode === 'grid' ? { background: orangeGradient, color: 'white', border: 'none', width: '42px', height: '42px' } : { backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6', width: '42px', height: '42px' }}
                            >
                                <LayoutGrid size={18} />
                            </button>
                        </div>
                    </div>

                    {/* FILTROS ACTIVOS (TAGS) */}
                    {hasActiveFilters && (
                        <div className="d-flex align-items-center mt-3 pt-3 border-top gap-2 flex-wrap">
                            <span className="text-muted small d-flex align-items-center me-2"><Filter size={14} className="me-1"/> Filtros activos:</span>
                            {selectedCategory && (
                                <span className="badge bg-white text-dark border shadow-sm p-2 d-flex align-items-center gap-1 fw-medium rounded-pill">
                                    {activeCatName} <X size={14} className="ms-1 text-danger" role="button" onClick={() => setSelectedCategory("")} style={{cursor: "pointer"}}/>
                                </span>
                            )}
                            {selectedCity && (
                                <span className="badge bg-white text-dark border shadow-sm p-2 d-flex align-items-center gap-1 fw-medium rounded-pill">
                                    {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} <X size={14} className="ms-1 text-danger" role="button" onClick={() => setSelectedCity("")} style={{cursor: "pointer"}}/>
                                </span>
                            )}
                            {searchTerm && (
                                <span className="badge bg-white text-dark border shadow-sm p-2 d-flex align-items-center gap-1 fw-medium rounded-pill">
                                    "{searchTerm}" <X size={14} className="ms-1 text-danger" role="button" onClick={() => {setSearchInput(""); setSearchTerm("");}} style={{cursor: "pointer"}}/>
                                </span>
                            )}
                            <span role="button" className="text-danger small ms-2 fw-bold text-decoration-none" style={{cursor: "pointer"}} onClick={clearAllFilters}>
                                Limpiar todos
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* INFO Y MAPA */}
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
                <span className="text-muted fw-medium">{filteredEvents.length} eventos encontrados</span>
                
                <Link to="/map" className="btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center shadow-sm text-decoration-none text-white transition-all hover-scale" style={{ background: orangeGradient, border: "none" }}>
                    <Compass size={18} className="me-2" /> Ver en el mapa
                </Link>
            </div>

            {/* RENDERIZADO DINÁMICO */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: "#ff7a00" }} role="status"></div>
                </div>
            ) : filteredEvents.length > 0 ? (
                viewMode === "list" ? (
                    <div className="d-flex flex-column gap-3">
                        {filteredEvents.map(event => (
                            <EventListCard 
                                key={event.id} 
                                event={event} 
                                categoryName={getCategoryName(event.category_id)} 
                                onOpenModal={setSelectedEvent} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredEvents.map(event => {
                            const catName = getCategoryName(event.category_id);
                            return (
                                <div key={event.id} className="col-12 col-md-6 col-lg-4">
                                    <EventCard 
                                        event={{...event, categoryName: catName}} 
                                        onOpenModal={() => setSelectedEvent({...event, categoryName: catName})} 
                                    />
                                </div>
                            );
                        })}
                    </div>
                )

            ) : (
                <div className="text-center py-5 bg-white border border-light rounded-4 shadow-sm">
                    <Search size={48} className="text-muted opacity-25 mb-3" />
                    <h5 className="fw-bold text-dark">No se encontraron eventos</h5>
                    <p className="small text-muted mb-4">Intenta cambiar los filtros o realizar otra búsqueda.</p>
                    <button className="btn rounded-pill px-4 text-white fw-bold shadow-sm" style={{ background: orangeGradient, border: "none" }} onClick={clearAllFilters}>Borrar filtros</button>
                </div>
            )}

            {/* MODAL */}
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent} 
                    categoryName={selectedEvent.categoryName || getCategoryName(selectedEvent.category_id)} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
            
            <style>{`
                .hover-scale { transition: transform 0.2s ease; }
                .hover-scale:hover { transform: scale(1.03); }
            `}</style>
        </div>
    );
};