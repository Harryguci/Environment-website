import React from "react";
import Navbar from "../components/Navbar";
import CircleLayoutGroup from "../components/CircleLayoutGroup";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
export default function Layout({ children }) {
  return (
    <React.Fragment>
      {/* <CircleLayoutGroup /> */}
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
