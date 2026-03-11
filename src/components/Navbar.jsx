import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };

  return (
    <div className="sticky top-0 z-50 bg-transparent flex items-center justify-between text-sm py-4 mb-5 border-b-0 px-4 sm:px-[0%]">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer hover:scale-105 transition-all duration-300 active:opacity-80"
        src={assets.logo}
        alt="Prescripto Logo"
      />
      <ul className="hidden md:flex items-start gap-6 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `py-1 transition-all duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500 hover:scale-110"}`
          }
        >
          <li>HOME</li>
        </NavLink>
        <NavLink
          to="/doctor"
          className={({ isActive }) =>
            `py-1 transition-all duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500 hover:scale-110"}`
          }
        >
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink
          to="/generate-ai"
          className={({ isActive }) =>
            `py-1 transition-all duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500 hover:scale-110"}`
          }
        >
          <li className="flex items-center gap-1">AI SPECIALIST <span className="text-xs">🤖</span></li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `py-1 transition-all duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500 hover:scale-110"}`
          }
        >
          <li>ABOUT</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `py-1 transition-all duration-300 ${isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-500 hover:scale-110"}`
          }
        >
          <li>CONTACT</li>
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image || assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointment")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-400 text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* --- Mobile Menu --- */}
        <div
          className={` ${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className=" flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium ">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctor">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/generate-ai">
              <p className="px-4 py-2 rounded inline-block">AI</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
