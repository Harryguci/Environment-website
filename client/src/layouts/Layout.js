import React from "react";
import Navbar from "../components/Navbar";
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
