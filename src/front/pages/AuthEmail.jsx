import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Recuperamos el email enviado desde Signup
    const email = location.state?.email || localStorage.getItem("pendingEmail");

    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // =====================================================
    // VERIFICAR CÓDIGO
    // =====================================================

    const handleVerify = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!code || code.length !== 6) {
            setError("Ingresa el código de 6 dígitos.");
            return;
        }

        if (!email) {
            setError("No encontramos el correo electrónico. Regístrate nuevamente.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/verify-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    code: code,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "El código no es válido.");
                return;
            }

            setMessage(data.message);

            // Eliminamos el email pendiente porque ya fue verificado
            localStorage.removeItem("pendingEmail");

            // Después de verificar, vamos al login
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Error verificando correo:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // REENVIAR CÓDIGO
    // =====================================================

    const handleResend = async () => {
        setMessage("");
        setError("");

        if (!email) {
            setError("No encontramos el correo electrónico.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "No se pudo reenviar el código.");
                return;
            }

            setMessage(data.message);

        } catch (error) {
            console.error("Error reenviando código:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // INTERFAZ
    // =====================================================

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">

            <div
                className="card shadow p-4"
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    borderRadius: "15px",
                }}
            >

                <div className="text-center mb-4">

                    <h2 className="fw-bold">
                        Verifica tu correo
                    </h2>

                    <p className="text-muted">
                        Hemos enviado un código de verificación a:
                    </p>

                    <strong>
                        {email || "tu correo electrónico"}
                    </strong>

                </div>


                <form onSubmit={handleVerify}>

                    <div className="mb-3">

                        <label
                            htmlFor="verificationCode"
                            className="form-label fw-semibold"
                        >
                            Código de verificación
                        </label>

                        <input
                            id="verificationCode"
                            type="text"
                            className="form-control text-center"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6);

                                setCode(value);
                            }}
                            maxLength="6"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                        />

                    </div>


                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}


                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar correo"}
                    </button>

                </form>


                <div className="text-center mt-4">

                    <p className="text-muted mb-2">
                        ¿No recibiste el código?
                    </p>

                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleResend}
                        disabled={loading}
                    >
                        Reenviar correo
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AuthEmail;