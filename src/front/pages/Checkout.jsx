import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CreditCard, CalendarDays, MapPin, CheckCircle, ShieldCheck, ArrowLeft } from "lucide-react";

export const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const orangeGradient = "linear-gradient(135deg, #c23b00 0%, #ff7a00 100%)";

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Formulario de tarjeta falso
    const [cardData, setCardData] = useState({ name: "", number: "", expiry: "", cvc: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Obtener los datos del evento a comprar
        fetch(`${backendUrl}/api/events/${id}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => console.error("Error cargando evento:", err));
    }, [id, navigate, backendUrl]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const token = localStorage.getItem("token");

        // 1. Simulamos el tiempo que tarda el banco (2 segundos)
        setTimeout(async () => {
            try {
                // 2. Realizamos la compra real en la base de datos
                const response = await fetch(`${backendUrl}/api/tickets`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        event_id: event.id,
                        ticket_type: "General"
                    })
                });

                if (response.ok) {
                    setPaymentSuccess(true);
                    // 3. Después de mostrar el éxito, lo enviamos a sus entradas
                    setTimeout(() => {
                        navigate("/profile?tab=tickets");
                    }, 2500);
                } else {
                    alert("Hubo un problema procesando la entrada.");
                    setIsProcessing(false);
                }
            } catch (error) {
                console.error("Error en pago:", error);
                setIsProcessing(false);
            }
        }, 2000);
    };

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><span className="spinner-border text-danger"></span></div>;
    if (!event) return <div className="vh-100 d-flex justify-content-center align-items-center">Evento no encontrado</div>;

    const priceValue = parseFloat(event.price) || 0;
    const taxes = priceValue * 0.16; // 16% IVA simulación
    const total = priceValue + taxes;

    // PANTALLA DE ÉXITO
    if (paymentSuccess) {
        return (
            <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light animate__animated animate__fadeIn">
                <CheckCircle size={80} className="text-success mb-4 animate__animated animate__bounceIn" />
                <h2 className="fw-bold text-dark">¡Pago Exitoso!</h2>
                <p className="text-muted fs-5">Tu entrada ha sido generada correctamente.</p>
                <p className="small text-secondary">Redirigiendo a tus entradas...</p>
                <div className="spinner-border spinner-border-sm text-secondary mt-3"></div>
            </div>
        );
    }

    // PANTALLA DE CHECKOUT
    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container" style={{ maxWidth: "1000px" }}>
                
                <Link to="/events" className="btn btn-light rounded-pill border px-4 fw-medium mb-4 d-inline-flex align-items-center">
                    <ArrowLeft size={16} className="me-2" /> Volver a eventos
                </Link>

                <div className="row g-4">
                    {/* COLUMNA IZQUIERDA: PAGO */}
                    <div className="col-12 col-lg-7">
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0 h-100">
                            <h4 className="fw-bold mb-4 d-flex align-items-center">
                                <CreditCard className="me-2 text-primary" /> Método de Pago
                            </h4>
                            <p className="text-muted small mb-4">
                                <ShieldCheck size={16} className="me-1 text-success" /> 
                                Transacción encriptada y segura. (Modo Simulación)
                            </p>

                            <form onSubmit={handlePayment}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">Nombre en la tarjeta</label>
                                    <input type="text" className="form-control rounded-3 py-2 bg-light" required placeholder="Ej. Juan Pérez" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">Número de tarjeta</label>
                                    <input type="text" className="form-control rounded-3 py-2 bg-light" required placeholder="XXXX XXXX XXXX XXXX" maxLength="16" value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                                </div>
                                <div className="row mb-4">
                                    <div className="col-6">
                                        <label className="form-label fw-bold small text-secondary">Vencimiento (MM/AA)</label>
                                        <input type="text" className="form-control rounded-3 py-2 bg-light" required placeholder="12/25" value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-bold small text-secondary">CVC</label>
                                        <input type="text" className="form-control rounded-3 py-2 bg-light" required placeholder="123" maxLength="3" value={cardData.cvc} onChange={e => setCardData({...cardData, cvc: e.target.value})} />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="btn w-100 rounded-pill py-3 fw-bold text-white shadow-sm mt-3"
                                    style={{ background: isProcessing ? "#ccc" : orangeGradient, border: "none" }}
                                >
                                    {isProcessing ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span> Procesando pago...</>
                                    ) : (
                                        `Pagar $${total.toFixed(2)}`
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: RESUMEN */}
                    <div className="col-12 col-lg-5">
                        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 border-0 h-100 d-flex flex-column">
                            <h5 className="fw-bold mb-4">Resumen del pedido</h5>
                            
                            <div className="d-flex gap-3 mb-4 pb-4 border-bottom">
                                <img 
                                    src={event.imgs_event && event.imgs_event.length > 0 ? event.imgs_event[0] : (event.image_url || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a")} 
                                    alt={event.title} 
                                    className="rounded-3 object-fit-cover shadow-sm"
                                    style={{ width: "80px", height: "80px" }}
                                />
                                <div>
                                    <h6 className="fw-bold mb-1">{event.title}</h6>
                                    <small className="text-muted d-block mb-1"><MapPin size={12} className="me-1"/> {event.location_name}</small>
                                    <small className="text-muted d-block"><CalendarDays size={12} className="me-1"/> {event.start_time ? event.start_time.split("T")[0] : ""}</small>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between mb-2 text-secondary">
                                <span>1x Entrada General</span>
                                <span>${priceValue.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4 pb-3 border-bottom text-secondary">
                                <span>Cargos por servicio (IVA)</span>
                                <span>${taxes.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mt-auto pt-3">
                                <span className="fs-5 fw-bold text-dark">Total</span>
                                <span className="fs-4 fw-bold" style={{ color: "#ff523b" }}>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};