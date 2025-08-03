import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { SearchProvider } from "./contexts/searchContext";

export default function Layout() {
  return (
    <>
        <Navbar />
        <main className="container">
          <Outlet />
        </main>
        <Footer />
    </>
  );
}
