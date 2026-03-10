import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const StepBadge = ({ currentStep, totalSteps }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-jetbrains border ${
        darkMode
          ? "bg-cyan-500/10 text-cyan-300 border-cyan-400/20"
          : "bg-cyan-50 text-cyan-700 border-cyan-200"
      }`}
    >
      Step {Math.max(currentStep, 1)} / {Math.max(totalSteps, 1)}
    </div>
  );
};

export default StepBadge;