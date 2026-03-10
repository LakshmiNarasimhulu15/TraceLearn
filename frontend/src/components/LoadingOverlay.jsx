import React, { useContext } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const LoadingOverlay = ({ show, label = "Working on your code..." }) => {
  const { darkMode } = useContext(ThemeContext);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className={`w-[320px] rounded-3xl p-6 shadow-2xl border ${
          darkMode
            ? "bg-slate-900/95 border-white/10 text-white"
            : "bg-white/95 border-slate-200 text-slate-900"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="font-jetbrains text-lg">TraceLearn</div>
            <div className="font-jetbrains text-xs opacity-70">
              Advanced Execution Workspace
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-jetbrains text-sm">
          <LoaderCircle className="animate-spin" size={18} />
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;