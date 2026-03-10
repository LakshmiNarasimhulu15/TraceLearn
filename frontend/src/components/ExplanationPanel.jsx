import React, { useContext } from "react";
import { BrainCircuit, Calculator, FileCode2 } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import StepBadge from "./StepBadge";

const ExplanationPanel = ({ currentStep, steps, explanation }) => {
  const { darkMode } = useContext(ThemeContext);

  console.log("[EXPLANATION_PANEL] Rendered with explanation length:", explanation?.length || 0);
  console.log("[EXPLANATION_PANEL] Explanation content:", explanation ? explanation.substring(0, 100) + "..." : "None");

  const stepData = steps?.[currentStep - 1] || null;

  if (!stepData) {
    return (
      <div
        className={`h-full rounded-3xl border p-4 ${
          darkMode
            ? "bg-slate-900/70 border-white/10 text-white"
            : "bg-white/85 border-slate-200 text-slate-900"
        }`}
      >
        <div className="font-frozito text-[20px] mb-2">AI Explanation</div>
        <div className="font-jetbrains text-sm opacity-70">
          Run code to get AI explanation and per-step reasoning.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full rounded-3xl border p-4 flex flex-col min-h-0 glass ${
        darkMode
          ? "bg-slate-950/60 border-white/10 text-white"
          : "bg-white/75 border-slate-200 text-slate-900"
      } animate-fade-in-up`}
    >
      <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
        <div>
          <div className="font-frozito text-[20px]">Reasoning & Explanation</div>
        </div>
        <StepBadge currentStep={currentStep} totalSteps={steps.length} />
      </div>

      <div className="panel-scroll flex-1 space-y-4 pr-1">
        <div
          className={`rounded-2xl border p-3 ${
            darkMode
              ? "bg-slate-900/70 border-white/10"
              : "bg-white/85 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <FileCode2 size={18} />
            <span className="font-frozito text-[18px]">Current Code Line</span>
          </div>
          <pre className="font-jetbrains text-xs whitespace-pre-wrap break-words">
            {stepData.code_line || "No line"}
          </pre>
        </div>

        <div
          className={`rounded-2xl border p-3 ${
            darkMode
              ? "bg-slate-900/70 border-white/10"
              : "bg-white/85 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={18} />
            <span className="font-frozito text-[18px]">Math / Expression</span>
          </div>

          {stepData.math_visualization ? (
            <div className="font-jetbrains text-xs space-y-2">
              {stepData.math_visualization.type === "math" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold">
                      MATH
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Expression:</span>{" "}
                    <code className={`px-1 rounded text-xs ${
                      darkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}>
                      {stepData.math_visualization.expression}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold">Result:</span>{" "}
                    <span className="text-green-400 font-mono">
                      {String(stepData.math_visualization.result)}
                    </span>
                  </div>
                </>
              )}

              {stepData.math_visualization.type === "comparison" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                      COMPARISON
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Expression:</span>{" "}
                    <code className={`px-1 rounded text-xs ${
                      darkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}>
                      {stepData.math_visualization.expression}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold">Result:</span>{" "}
                    <span className={`font-mono ${
                      stepData.math_visualization.result === true
                        ? "text-green-400"
                        : stepData.math_visualization.result === false
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}>
                      {String(stepData.math_visualization.result)}
                    </span>
                  </div>
                </>
              )}

              {stepData.math_visualization.type === "decision" && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-semibold">
                      DECISION
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Condition:</span>{" "}
                    <code className={`px-1 rounded text-xs ${
                      darkMode ? "bg-slate-800" : "bg-slate-200"
                    }`}>
                      {stepData.math_visualization.expression}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold">Decision:</span>{" "}
                    <span className={`font-mono font-bold ${
                      stepData.math_visualization.result === true
                        ? "text-green-400"
                        : stepData.math_visualization.result === false
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}>
                      {stepData.math_visualization.result === true ? "TRUE → Execute block" :
                       stepData.math_visualization.result === false ? "FALSE → Skip block" :
                       String(stepData.math_visualization.result)}
                    </span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="font-jetbrains text-xs opacity-70">
              No math operation on this step.
            </div>
          )}
        </div>

        <div
          className={`rounded-2xl border p-3 min-h-[220px] ${
            darkMode
              ? "bg-slate-900/70 border-white/10"
              : "bg-white/85 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={18} />
            <span className="font-frozito text-[20px]">AI Explanation</span>
          </div>

          <pre className="font-jetbrains text-xs whitespace-pre-wrap break-words leading-6">
            {explanation || "Explanation will appear here after execution."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;