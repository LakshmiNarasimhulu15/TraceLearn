import React, { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleDarkMode}
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`inline-flex items-center justify-center rounded-xl p-2 border transition-all ${
        darkMode
          ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
          : "border-slate-200 bg-white/60 hover:bg-white text-slate-900"
      }`}
    >
      {darkMode ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

export default ThemeToggle;