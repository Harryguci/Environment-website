import React from "react";
import Navbar from "../components/Navbar";
import CircleLayout from "../components/CircleLayout";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
export default function Layout({ children }) {
  return (
    <React.Fragment>
      <header>
        <Navbar />
      </header>
      {children}
      <footer>
        <Footer />
      </footer>
    </React.Fragment>
  );
}
