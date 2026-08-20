import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix para los iconos de marcadores (necesario en React)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Función para mover la cámara del mapa
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 14);
    return null;
}

const MapModule = () => {
    // Datos de prueba funcionales
    const [places, setPlaces] = useState([
        { id: 1, name: "Plaza Mayor", lat: 40.4153, lng: -3.7073, category: "Cultura", img: "https://picsum.photos/200/120?random=1" },
        { id: 2, name: "Restaurante El Faro", lat: 40.4210, lng: -3.7010, category: "Gastronomía", img: "https://picsum.photos/200/120?random=2" },
        { id: 3, name: "Club Nocturno Vibes", lat: 40.4120, lng: -3.7150, category: "Ocio", img: "https://picsum.photos/200/120?random=3" }
    ]);

    const [coords, setCoords] = useState([40.4167, -3.7037]); // Coordenadas iniciales

    // Función para obtener ubicación del usuario
    const getMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setCoords([pos.coords.latitude, pos.coords.longitude]);
        });
    };

    return (
        <div className="container-fluid p-4 bg-light">
            {/* Header con Bootstrap */}
            <div className="row mb-4">
                <div className="col d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm">
                    <div>
                        <h1 className="h3 mb-0 text-primary fw-bold">LocalVibes Map</h1>
                        <p className="text-muted small mb-0">Encuentra los mejores puntos de interés</p>
                    </div>
                    <button className="btn btn-primary" onClick={getMyLocation}>
                        Ubicarme Ahora
                    </button>
                </div>
            </div>

            <div className="row">
                {/* Lista lateral: Bootstrap List Group */}
                <div className="col-md-4 mb-3">
                    <div className="list-group shadow-sm overflow-auto" style={{ maxHeight: "500px" }}>
                        <div className="list-group-item bg-dark text-white fw-bold">Lugares Disponibles</div>
                        {places.map((place) => (
                            <button
                                key={place.id}
                                onClick={() => setCoords([place.lat, place.lng])}
                                className="list-group-item list-group-item-action d-flex align-items-center p-3"
                            >
                                <img src={place.img} alt="" className="rounded me-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />
                                <div>
                                    <div className="fw-bold">{place.name}</div>
                                    <span className="badge bg-secondary opacity-75 small">{place.category}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenedor del Mapa */}
                <div className="col-md-8">
                    <div className="rounded shadow-sm border bg-white p-2" style={{ height: "515px" }}>
                        <MapContainer 
                            center={coords} 
                            zoom={13} 
                            style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <ChangeView center={coords} />

                            {places.map((place) => (
                                <Marker key={place.id} position={[place.lat, place.lng]}>
                                    <Popup>
                                        {/* Card de Bootstrap dentro del Popup */}
                                        <div className="card border-0" style={{ width: "150px" }}>
                                            <img src={place.img} className="card-img-top rounded" alt="..." />
                                            <div className="card-body p-2 text-center">
                                                <h6 className="card-title fw-bold mb-1">{place.name}</h6>
                                                <p className="badge bg-primary mb-2" style={{ fontSize: "0.7rem" }}>{place.category}</p>
                                                <button className="btn btn-sm btn-dark w-100" style={{ fontSize: "0.7rem" }}>Ver detalles</button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapModule;

/* prueba */