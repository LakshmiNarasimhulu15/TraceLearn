import React, { useContext } from "react";
import { AlertTriangle, Bug } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const ErrorPanel = ({ error }) => {
  const { darkMode } = useContext(ThemeContext);

  console.log("[ERROR_PANEL] Error object:", error);

  return (
    <div
      className={`rounded-3xl border p-4 ${
        darkMode
          ? "bg-slate-950/60 border-white/10 text-white"
          : "bg-white/75 border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} />
        <span className="font-frozito text-[20px]">Errors</span>
      </div>

      {error ? (
        <div
          className={`rounded-2xl p-3 border ${
            darkMode
              ? "bg-red-500/10 border-red-400/20"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-jetbrains text-sm font-semibold">
            <Bug size={15} />
            {error.type || "ExecutionError"}
          </div>

          <div className="font-jetbrains text-xs space-y-2">
            <div>
              <span className="font-semibold">Message:</span>{" "}
              {error.message || "Unknown error"}
            </div>

            {error.line_number ? (
              <div>
                <span className="font-semibold">Line:</span> {error.line_number}
              </div>
            ) : null}

            {error.traceback ? (
              <details className="mt-2">
                <summary className="cursor-pointer font-semibold">
                  Traceback
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words text-[11px] opacity-85">
                  {error.traceback}
                </pre>
              </details>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="font-jetbrains text-xs opacity-70">
          No execution error.
        </div>
      )}
    </div>
  );
};

export default ErrorPanel;