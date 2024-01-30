import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense, useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthContext from "./helpers/Authcontext";
import NotificationContext from "./helpers/NotificationContext";
import CartContext from "./helpers/CartContext";
import CurrentPageContext from "./helpers/CurrentPageContext";
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
import ProductEdit from "./pages/ProductEdit";
import Maps from "./pages/Maps";
import BlogEdit from "./pages/BlogEdit";
// import Travel from "./pages/Travel";

function App() {
  const [authState, setAuthSate] = useState({
    username: "",
    id: 0,
    role: 'user',
    status: false,
  });

  const [cartState, setCartState] = useState([]);
  const [notificationState, setNotificationState] = useState([]);

  const [pageState, setPageState] = useState("home");

  useEffect(() => {
    // Generate the current user's access-token to information about the account
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
          // Set AuthSate if this request is successful
          setAuthSate({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => console.log(error)); // error handling
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
          <CurrentPageContext.Provider value={{ pageState, setPageState }}>
            <NotificationContext.Provider value={{ notificationState, setNotificationState }}>
              <BrowserRouter>
                <Suspense fallback={<LoadingPage />}>
                  <Routes>

                    {/* Not use a layout if the current page is Login or Sign Up */}
                    <Route path="/login" element={<Login typeForm={"login"} />} />
                    <Route path="/signup" element={<Login typeForm={"signup"} />} />
                    <Route path="/maps" element={<Maps />} />

                    {/* Use a Layout */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="/blogs" element={<Blogs />} />
                      <Route path="/blogs/single/:id" element={<BlogSingle />} />
                      <Route path="/blogs/edit/:id" element={<BlogEdit />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/edit/:id" element={<ProductEdit />} />
                      <Route path="/products/single/:id" element={<ProductSingle />} />
                      <Route path="/account/:id" element={<Account />} />
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
            </NotificationContext.Provider>
          </CurrentPageContext.Provider>
        </CartContext.Provider>
      </AuthContext.Provider>
    </div >
  );
}

export default App;
