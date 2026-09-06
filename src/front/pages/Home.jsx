import React from "react";
import { Link } from "react-router-dom";

// Iconos de Lucide React
import {
    Search,
    MapPin,
    Music,
    Utensils,
    Drama,
    Dumbbell,
    Palette,
    Leaf
} from "lucide-react";


// =========================================================
// COMPONENTE PLACEHOLDER DE EVENTO
// =========================================================
const EventCardPlaceholder = ({
    title,
    date,
    location,
    category,
    image
}) => {
    return (
        <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
            {/* Imagen del evento */}
            <div
                className="text-white p-3 d-flex align-items-end"
                style={{
                    height: "180px",
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <span className="badge bg-danger">
                    {category}
                </span>
            </div>

            {/* Información */}
            <div className="card-body">
                <p className="text-muted small mb-1">
                    {date}
                </p>
                <h5 className="card-title fw-bold">
                    {title}
                </h5>
                <p className="text-muted small mb-0">
                    <MapPin size={14} className="me-1" />
                    {location}
                </p>
                <button className="btn btn-outline-danger w-100 mt-3 rounded-pill">
                    Ver detalles
                </button>
            </div>
        </div>
    );
};


// =========================================================
// HOME
// =========================================================

export const Home = () => {

    // =====================================================
    // CATEGORÍAS
    // =====================================================
    const categories = [
        { name: "Música", events: "12 eventos", icon: <Music size={24} /> },
        { name: "Gastronomía", events: "61 eventos", icon: <Utensils size={24} /> },
        { name: "Teatro", events: "56 eventos", icon: <Drama size={24} /> },
        { name: "Deportes", events: "44 eventos", icon: <Dumbbell size={24} /> },
        { name: "Arte", events: "01 eventos", icon: <Palette size={24} /> },
        { name: "Naturaleza", events: "01 eventos", icon: <Leaf size={24} /> }
    ];

    // =====================================================
    // EVENTOS DESTACADOS
    // =====================================================
    const featuredEvents = [
        {
            id: 1,
            category: "CONCIERTO",
            title: "Festival de Música",
            date: "15 Feb, 2026 - 11:30 PM",
            location: "Caracas, Venezuela",
            image: "https://picsum.photos/id/1035/600/400"
        },
        {
            id: 2,
            category: "GASTRONOMÍA",
            title: "Experiencia Gastronómica",
            date: "20 Feb, 2026 - 7:00 PM",
            location: "Las Mercedes, Caracas",
            image: "https://picsum.photos/id/1080/600/400"
        },
        {
            id: 3,
            category: "ARTE",
            title: "Exposición de Arte",
            date: "22 Feb, 2026 - 5:30 PM",
            location: "Centro Cultural",
            image: "https://picsum.photos/id/1025/600/400"
        },
        {
            id: 4,
            category: "NATURALEZA",
            title: "Experiencia al Aire Libre",
            date: "25 Feb, 2026 - 8:00 AM",
            location: "Caracas, Venezuela",
            image: "https://picsum.photos/id/1016/600/400"
        }
    ];

    return (
        <div className="container-fluid px-0 bg-light" style={{ minHeight: "100vh" }}>

            {/* =================================================
                HERO
            ================================================= */}
            <section className="container mt-4 mb-5">
                <div className="row align-items-center g-4">
                    {/* TEXTO */}
                    <div className="col-12 col-lg-6 pe-lg-5">

                        {/* ETIQUETA */}
                        <span className="badge bg-danger-subtle text-danger border border-1 border-danger-subtle mb-3 py-2 px-3 rounded-pill fs-5 fw-normal">
                            <MapPin size={24} className="me-1" />
                            Eventos
                        </span>

                        {/* TÍTULO */}
                        <h1 className="display-4 fw-bold mb-3">
                            Encuentra los mejores <span className="text-danger">eventos</span> en Caracas
                        </h1>

                        {/* DESCRIPCIÓN */}
                        <p className="text-muted fs-5 mb-4">
                            Conciertos, teatro, gastronomía y experiencias... encuentra lo que justo está pasando cerca de ti.
                        </p>

                        {/* BUSCADOR */}
                        <div className="bg-white p-2 rounded-4 shadow-sm d-flex flex-column flex-md-row gap-2 align-items-stretch">

                            {/* QUÉ */}
                            <div className="d-flex align-items-center px-3 py-1 flex-fill">
                                <Search size={18} className="text-muted me-2 flex-shrink-0" />
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-0 shadow-none bg-transparent"
                                    placeholder="¿Qué estás buscando?"
                                />
                            </div>

                            {/* DÓNDE */}
                            <div className="d-flex align-items-center px-3 py-1 flex-fill border-start-md">
                                <MapPin size={18} className="text-muted me-2 flex-shrink-0" />
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-0 shadow-none bg-transparent"
                                    placeholder="¿Dónde?"
                                />
                            </div>

                            {/* BOTÓN BUSCAR (Opcional si ya lo tienes al lado) */}
                            <button className="btn btn-danger px-4 rounded-3 flex-shrink-0">
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* IMAGEN HERO */}
                    <div className="col-12 col-lg-6">
                        <div
                            className="hero-image rounded-4 w-100 shadow-sm"
                            style={{
                                height: "420px",
                                backgroundImage: "url(https://picsum.photos/id/1011/800/600)",
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        >
                            <span className="visually-hidden">
                                Personas disfrutando de un evento
                            </span>
                        </div>
                    </div>
                </div>
            </section>


            {/* =================================================
                CATEGORÍAS
            ================================================= */}
            <section className="container mb-5">
                <h4 className="fw-bold mb-4">Explora por categorías</h4>
                <div className="row g-3">
                    {categories.map((category, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-2">
                            <div className="card text-center border-0 shadow-sm rounded-4 py-4 h-100">
                                <div className="mb-2 d-flex justify-content-center">
                                    <div className="bg-danger-subtle text-danger p-3 rounded-circle d-inline-flex">
                                        {category.icon}
                                    </div>
                                </div>
                                <h6 className="fw-bold mb-1">{category.name}</h6>
                                <small className="text-muted">{category.events}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </section>


            {/* =================================================
                EVENTOS DESTACADOS
            ================================================= */}
            <section className="container mb-5">
                {/* TÍTULO */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Eventos destacados</h4>
                    <Link to="/events" className="text-danger text-decoration-none fw-semibold">
                        Ver más
                    </Link>
                </div>

                {/* TARJETAS */}
                <div className="row g-4">
                    {featuredEvents.map((event) => (
                        <div key={event.id} className="col-12 col-md-6 col-lg-3">
                            <EventCardPlaceholder
                                category={event.category}
                                title={event.title}
                                date={event.date}
                                location={event.location}
                                image={event.image}
                            />
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};