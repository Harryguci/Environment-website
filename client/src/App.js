import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./Assets/SCSS/index.scss";

import AuthContext from "./helpers/Authcontext";
import CartContext from "./helpers/CartContext";
import axios from "axios";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Account from "./pages/Account";
import BlogSingle from "./pages/BlogSingle";
import ProductSingle from "./pages/ProductSingle";
import Search from "./pages/Search";
import NoPage from "./pages/NoPage";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";

function App() {
  const [authState, setAuthSate] = useState({
    username: "",
    id: 0,
    status: false,
  });

  const [cartState, setCartState] = useState([]);

  useEffect(() => {
    axios
      .get("/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthSate(prev => ({
            ...prev,
            status: false,
          }));
          console.log(response.data.error);
        } else {
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const LoadingPage = useCallback(() => (
    <div
      style={{
        width: "100vw",
        height: 100 + "vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f1630",
      }}
    >
      <h1 style={{ color: "white", fontSize: '10rem' }}>Loading...</h1>
    </div>
  ), []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthSate }}>
        <CartContext.Provider value={{ cartState, setCartState }}>
          <BrowserRouter>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/login" element={<Login typeForm={"login"} />} />
                <Route path="/signup" element={<Login typeForm={"signup"} />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/blogs/single/:id" element={<BlogSingle />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/single/:id" element={<ProductSingle />} />
                  <Route path="/account/:tab" element={<Account />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/search/:q" element={<Search />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
