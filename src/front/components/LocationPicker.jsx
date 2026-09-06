import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Search, Map as MapIcon } from "lucide-react";

const customIcon = L.divIcon({
    html: `<div style="background-color: #ef4444; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, 16); // Acercamiento nivel 16 para ver la calle con detalle
    }, [position, map]);
    return null;
};

const MapClickHandler = ({ setPosition, setAddress }) => {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const data = await response.json();
                if (data && data.display_name) setAddress(data.display_name);
            } catch (error) {
                console.error("Error obteniendo la dirección:", error);
            }
        }
    });
    return null;
};

export const LocationPicker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState([10.4806, -66.9036]);
    const [address, setAddress] = useState("");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Enviar datos al formulario padre
    useEffect(() => {
        onLocationSelect({ latitude: position[0], longitude: position[1], address: address });
    }, [position, address]);

    // EFECTO DE BÚSQUEDA EN TIEMPO REAL (DEBOUNCE)
    useEffect(() => {
        // Si el texto es muy corto, limpiamos los resultados y no buscamos
        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        // Esperamos 800ms antes de llamar a la API para no saturarla mientras el usuario escribe
        const delayDebounceFn = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=ve&limit=5`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Error en la búsqueda:", error);
            } finally {
                setIsSearching(false);
            }
        }, 800);

        // Si el usuario vuelve a teclear antes de los 800ms, borramos el temporizador anterior
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSelectResult = (result) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setPosition([lat, lon]);
        setAddress(result.display_name);
        setSearchResults([]); // Ocultamos el menú
        setSearchQuery("");   // Limpiamos el buscador
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-visible mb-4">
            
            <div className="bg-light p-3 p-md-4 border-bottom">
                
                <div className="position-relative mb-3">
                    <div className="input-group shadow-sm rounded-3">
                        <span className="input-group-text bg-white border-end-0 text-muted px-3">
                            {isSearching ? <span className="spinner-border spinner-border-sm text-danger"></span> : <Search size={18} />}
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 py-2 ps-0" 
                            placeholder="Escribe la dirección, zona o local (Ej: Sambil Caracas)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* MENÚ DE SUGERENCIAS EN TIEMPO REAL */}
                    {searchResults.length > 0 && (
                        <ul className="list-group position-absolute w-100 mt-2 shadow-lg rounded-3 overflow-hidden" style={{ zIndex: 1050, maxHeight: "250px", overflowY: "auto" }}>
                            {searchResults.map((res, i) => (
                                <li 
                                    key={i} 
                                    className="list-group-item list-group-item-action d-flex align-items-start py-3" 
                                    style={{cursor: "pointer"}} 
                                    onClick={() => handleSelectResult(res)}
                                >
                                    <MapPin size={16} className="text-danger me-2 mt-1 flex-shrink-0" /> 
                                    <span className="small text-truncate text-wrap lh-sm">{res.display_name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="d-flex align-items-center bg-white p-2 px-3 rounded-3 border">
                    <MapIcon size={20} className="text-danger me-2 flex-shrink-0" />
                    <p className="mb-0 fw-medium small text-muted text-truncate">
                        {address ? address : "Usa el buscador o haz clic en el mapa para fijar la ubicación exacta."}
                    </p>
                </div>

            </div>

            <MapContainer center={position} zoom={13} style={{ height: "450px", width: "100%", zIndex: 0 }}>
                {/* CAPA OFICIAL DE OSM SIN MARCA DE AGUA */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon} />
                <MapClickHandler setPosition={setPosition} setAddress={setAddress} />
                <MapUpdater position={position} />
            </MapContainer>
        </div>
    );
};