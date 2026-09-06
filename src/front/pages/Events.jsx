import React, { useState, useEffect } from "react";
import { EventListCard } from "../components/EventListCard";
import { EventModal } from "../components/EventModal";

export const Events = () => {
    // 1. ESTADOS PRINCIPALES (Aquí estaba faltando "loading")
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); 

    // 2. ESTADOS PARA LOS FILTROS
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [viewMode, setViewMode] = useState("list");

    // 3. ESTADO PARA EL MODAL (Popup)
    const [selectedEvent, setSelectedEvent] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        // Cargar Categorías
        fetch(`${backendUrl}/api/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        // Cargar TODOS los eventos
        fetch(`${backendUrl}/api/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false); // Aquí se detiene el "loading"
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [backendUrl]);

    // Lógica de filtrado en tiempo real
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
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedCity("");
    };

    return (
        <div className="container py-4" style={{ maxWidth: "1000px" }}>
            
            {/* Título de la vista */}
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Explorar eventos</h2>
                <p className="text-secondary">Descubre todos los eventos que tenemos disponibles para ti en Venezuela.</p>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="card shadow-sm border-0 rounded-4 mb-4">
                <div className="card-body">
                    <div className="row g-2 align-items-center">
                        <div className="col-12 col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0 text-muted">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0 ps-0" 
                                    placeholder="Buscar por nombre o lugar..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="col-6 col-md-2">
                            <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">Categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6 col-md-2">
                            <select className="form-select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                                <option value="">Ciudad</option>
                                <option value="caracas">Caracas</option>
                                <option value="hatillo">El Hatillo</option>
                                <option value="chacao">Chacao</option>
                            </select>
                        </div>

                        <div className="col-6 col-md-2">
                            <select className="form-select">
                                <option value="">Todos los precios</option>
                                <option value="free">Gratis</option>
                                <option value="paid">De pago</option>
                            </select>
                        </div>

                        <div className="col-6 col-md-2">
                            <select className="form-select">
                                <option value="">Más populares</option>
                                <option value="date">Próximos</option>
                            </select>
                        </div>

                        <div className="col-12 col-md-1 d-flex justify-content-end gap-1">
                            <button className={`btn ${viewMode === 'list' ? 'btn-danger' : 'btn-light border'}`} onClick={() => setViewMode('list')}>
                                <i className="bi bi-list-task"></i>
                            </button>
                            <button className={`btn ${viewMode === 'grid' ? 'btn-danger' : 'btn-light border'}`} onClick={() => setViewMode('grid')}>
                                <i className="bi bi-grid"></i>
                            </button>
                        </div>
                    </div>

                    {/* FILTROS ACTIVOS */}
                    {hasActiveFilters && (
                        <div className="d-flex align-items-center mt-3 pt-3 border-top gap-2 flex-wrap">
                            <span className="text-muted small">Filtros activos:</span>
                            
                            {selectedCategory && (
                                <span className="badge bg-light text-dark border p-2 d-flex align-items-center gap-1 fw-normal rounded-pill">
                                    Cat: {activeCatName} <i className="bi bi-x cursor-pointer" role="button" onClick={() => setSelectedCategory("")}></i>
                                </span>
                            )}
                            
                            {selectedCity && (
                                <span className="badge bg-light text-dark border p-2 d-flex align-items-center gap-1 fw-normal rounded-pill">
                                    Ciudad: {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)} <i className="bi bi-x cursor-pointer" role="button" onClick={() => setSelectedCity("")}></i>
                                </span>
                            )}

                            {searchTerm && (
                                <span className="badge bg-light text-dark border p-2 d-flex align-items-center gap-1 fw-normal rounded-pill">
                                    Búsqueda: {searchTerm} <i className="bi bi-x cursor-pointer" role="button" onClick={() => setSearchTerm("")}></i>
                                </span>
                            )}

                            <span role="button" className="text-danger small ms-2 fw-medium text-decoration-none" style={{cursor: "pointer"}} onClick={clearAllFilters}>
                                Limpiar todos
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Mostrando {filteredEvents.length} eventos encontrados</span>
                <button className="btn btn-outline-danger rounded-pill px-3 py-1 fw-medium d-flex align-items-center gap-2">
                    <i className="bi bi-compass"></i> Ver estos eventos en el mapa
                </button>
            </div>

            {/* LISTA DE RESULTADOS */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            ) : filteredEvents.length > 0 ? (
                <div className="d-flex flex-column">
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
                <div className="text-center py-5 text-muted bg-light border rounded-4">
                    <h5>No se encontraron eventos con los filtros actuales.</h5>
                    <button className="btn btn-primary mt-2" onClick={clearAllFilters}>Borrar filtros</button>
                </div>
            )}

            {/* RENDERIZADO DEL MODAL */}
            {selectedEvent && (
                <EventModal 
                    event={selectedEvent} 
                    categoryName={getCategoryName(selectedEvent.category_id)} 
                    onClose={() => setSelectedEvent(null)} 
                />
            )}
        </div>
    );
};