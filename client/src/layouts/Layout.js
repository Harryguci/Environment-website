import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Assets/SCSS/index.scss";

import { Outlet } from "react-router-dom";
export default function Layout() {
  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>

      <Outlet />

      <footer>
        <Footer />
      </footer>
    </React.Fragment>
  );
}
