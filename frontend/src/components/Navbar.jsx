import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FolderOpen, Home, LogOut, Sparkles } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import { logoutUser } from "../services/auth";

const Navbar = ({ pythonVersion = "Python 3.13" }) => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isMyCodesPage = location.pathname === "/my-codes";

  const handleTogglePage = () => {
    if (isMyCodesPage) {
      navigate("/");
    } else {
      navigate("/my-codes");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header
      className={`h-[64px] shrink-0 border-b px-4 md:px-6 flex items-center justify-between ${
        darkMode
          ? "bg-[#0f172a]/95 border-white/10 text-white"
          : "bg-[#00CCCC]/95 border-slate-200 text-slate-950"
      } backdrop-blur-xl shadow-sm`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-2xl flex items-center justify-center bg-white text-slate-900 shadow-md shrink-0">
          <Sparkles size={18} />
        </div>

        <div className="min-w-0">
          <div className="font-frozito text-4xl text-center leading-tight truncate">
            TraceLearn
          </div>
          
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={handleTogglePage}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all font-jetbrains ${
            darkMode
              ? "bg-white/5 hover:bg-white/10 border border-white/10"
              : "bg-white/60 hover:bg-white/80 border border-slate-200"
          }`}
        >
          {isMyCodesPage ? <Home size={16} /> : <FolderOpen size={16} />}
          <span className="hidden sm:inline">
            {isMyCodesPage ? "Back To Editor" : "My Codes"}
          </span>
        </button>

        <div
          className={`hidden md:flex items-center rounded-xl px-3 py-2 text-sm font-jetbrains ${
            darkMode
              ? "bg-white/5 border border-white/10"
              : "bg-white/60 border border-slate-200"
          }`}
        >
          {pythonVersion}
        </div>

        <ThemeToggle />

        <button
          onClick={handleLogout}
          title="Logout"
          className={`inline-flex items-center justify-center rounded-xl p-2 transition-all ${
            darkMode
              ? "bg-white/5 hover:bg-white/10 border border-white/10"
              : "bg-white/60 hover:bg-white/80 border border-slate-200"
          }`}
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;