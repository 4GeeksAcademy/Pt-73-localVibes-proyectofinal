import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    return (
        <ScrollToTop>
            <Navbar />
            <main className="container pb-4" style={{ paddingTop: "110px" }}>
                <Outlet /> {/* Aquí React Router renderiza Signup, Login, Profile, etc. */}
            </main>
            <Footer />
        </ScrollToTop>
    );
};