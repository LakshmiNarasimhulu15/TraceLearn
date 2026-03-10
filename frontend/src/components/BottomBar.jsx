import React, { useContext } from "react";
import {
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Activity,
} from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const BottomBar = ({
  onRun,
  onStop,
  onPrev,
  onNext,
  onLast,
  currentStep,
  totalSteps,
  loading,
}) => {
  const { darkMode } = useContext(ThemeContext);

  const buttonClass = `inline-flex items-center justify-center rounded-xl p-2.5 transition-all border ${
    darkMode
      ? "border-white/10 bg-white/5 hover:bg-white/10 text-white"
      : "border-slate-200 bg-white hover:bg-slate-100 text-slate-900"
  }`;

  return (
    <div
      className={`h-[62px] shrink-0 border-t px-4 flex items-center justify-between ${
        darkMode
          ? "bg-slate-950/90 border-white/10 text-white"
          : "bg-white/90 border-slate-200 text-slate-900"
      } backdrop-blur-xl`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          className={buttonClass}
          title="Run"
          disabled={loading}
        >
          <Play size={18} />
        </button>

        <button
          onClick={onStop}
          className={buttonClass}
          title="Stop"
          disabled={!loading}
        >
          <Square size={18} />
        </button>

        <button
          onClick={onPrev}
          className={buttonClass}
          title="Previous Step"
          disabled={currentStep <= 1}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={onNext}
          className={buttonClass}
          title="Next Step"
          disabled={currentStep >= totalSteps}
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={onLast}
          className={buttonClass}
          title="Last Step"
          disabled={currentStep >= totalSteps}
        >
          <SkipForward size={18} />
        </button>
      </div>

      <div className="flex items-center gap-3 font-jetbrains text-sm">
        <div className="hidden sm:flex items-center gap-2 opacity-80">
          <Activity size={15} />
          <span>{loading ? "Executing..." : "Ready"}</span>
        </div>

        <div
          className={`rounded-xl px-3 py-1.5 border ${
            darkMode
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          Step {Math.max(currentStep, 1)} / {Math.max(totalSteps, 1)}
        </div>
      </div>
    </div>
  );
};

export default BottomBar;