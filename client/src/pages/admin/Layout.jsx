import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
  };

  return (
    <>
      <div className="flex item-center justify-between py-2 px-4 sm:px-12 border-b border-gray-200 h-[70px]">
        <img
          src={assets.logo}
          onClick={() => navigate("/")}
          className="w-32 sm:w-40 cursor-pointer"
        />
        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-blue-500 text-white rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="flex h-[calc[100vh-70px]]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
