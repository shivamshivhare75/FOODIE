import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../App.css";
import ScrollToTop from "../components/ScrollToTop";
import { AuthContext } from "../contexts/AuthProvider";
import Loading from "../components/Loading";

const Main = () => {
  const { loading } = useContext(AuthContext);
  return (
    <div className="bg-primaryBG">
      {loading ? (
        <Loading />
      ) : (
        <div>
          <ScrollToTop />
          <Navbar />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Main;
