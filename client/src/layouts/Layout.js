import React, { useCallback, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../Assets/SCSS/index.scss";

import { Outlet } from "react-router-dom";
import ChatField from "../components/ChatField.jsx";
import Notification from "../components/Notification.jsx";
import NotificationField from "../components/NotificationField.jsx";

export default function Layout() {
  return (
    <React.Fragment>
      <NotificationField />
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
