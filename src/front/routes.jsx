import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import AuthEmail from "./pages/AuthEmail";
import { Profile } from "./pages/Profile";
import { Events } from "./pages/Events";
import { MapPage } from "./pages/MapPage";
import { CreateEvent } from "./pages/CreateEvent";
import { Favorites } from "./pages/Favorites";
import { EditEvent } from "./pages/EditEvent";
import { Checkout } from "./pages/Checkout";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >

            {/* Página principal de Local Vibes */}
            <Route index element={<Home />} />

            {/* Autenticación */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth-email" element={<AuthEmail />} />
            <Route path="/login" element={<Login />} />

            {/* Perfil */}
            <Route path="/profile" element={<Profile />} />

            {/* Rutas principales */}
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route element={<Favorites />} path="/favorites" />
            <Route path="/checkout/:id" element={<Checkout />} />

        </Route>
    )
);

