import React, { use } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { token, navigate } = useAppContext();

  return (
    <div className="flex justify-between cursor-pointer items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="w-32 sm:w-44"
        alt="logo"
      />
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-500 text-white px-10 py-2.5"
      >
        {token ? "Dashboard" : "Login"}
        <img src={assets.arrow} className="w-3 " alt="arrow" />
      </button>
    </div>
  );
};

export default Navbar;
