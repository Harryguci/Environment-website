import React, { useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Assets/SCSS/index.scss";

import { Outlet } from "react-router-dom";
// import ChatCard from "../components/ChatCard.jsx";
// import ChatBubble from "../components/ChatBubble.jsx";
import ChatField from "../components/ChatField.jsx";

export default function Layout() {
  return (
    <React.Fragment>
      <ChatField />
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
