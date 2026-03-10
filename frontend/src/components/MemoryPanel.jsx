import React, { useContext } from "react";
import { Cpu, Database, Layers, TerminalSquare } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import { filterVariables } from "../utils/filterVariables";
import { formatVariable } from "../utils/formatVariable";
import StepBadge from "./StepBadge";

const SectionCard = ({ icon, title, children, darkMode }) => (
  <div
    className={`rounded-2xl border p-3 ${
      darkMode
        ? "bg-slate-900/70 border-white/10"
        : "bg-white/85 border-slate-200"
    }`}
  >
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="font-frozito text-[20px]">{title}</span>
    </div>
    {children}
  </div>
);

const MemoryPanel = ({ step, finalOutput, currentStep, totalSteps }) => {
  const { darkMode } = useContext(ThemeContext);

  if (!step) {
    return (
      <div
        className={`h-full rounded-3xl border p-4 ${
          darkMode
            ? "bg-slate-900/70 border-white/10 text-white"
            : "bg-white/85 border-slate-200 text-slate-900"
        }`}
      >
        <div className="font-frozito text-[20px] mb-2">Memory View</div>
        <div className="font-jetbrains text-sm opacity-70">
          Run code to inspect variables, memory, and output.
        </div>
      </div>
    );
  }

  const stackDepth = step?.stack_depth ?? 0;
  const rawVariables = step?.variables || step?.variables_json || {};
  const filteredVariables = filterVariables(rawVariables);
  const outputSnapshot = step?.output_snapshot || "";

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
          <div className="font-frozito text-[20px]">Memory & Runtime</div>
        </div>
        <StepBadge currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="panel-scroll flex-1 space-y-4 pr-1">
        <SectionCard
          darkMode={darkMode}
          icon={<Layers size={18} />}
          title="Call Stack"
        >
          <div className="font-jetbrains
           text-sm">
            Depth: {stackDepth} level{stackDepth !== 1 ? "s" : ""}
          </div>
        </SectionCard>

        <SectionCard
          darkMode={darkMode}
          icon={<Cpu size={18} />}
          title="Local Variables"
        >
          <div className="space-y-2 font-jetbrains text-sm">
            {Object.keys(filteredVariables).length > 0 ? (
              Object.entries(filteredVariables).map(([key, value]) => (
                <div
                  key={key}
                  className={`rounded-xl p-2 border ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="font-semibold mb-1">{key}</div>
                  <pre className="whitespace-pre-wrap break-words">
                    {formatVariable(value)}
                  </pre>
                </div>
              ))
            ) : (
              <p className="opacity-70">No local variables</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          darkMode={darkMode}
          icon={<Database size={18} />}
          title="Heap / Memory"
        >
          <div className="space-y-2 font-jetbrains text-sm">
            {Object.keys(filteredVariables).length > 0 ? (
              Object.entries(filteredVariables).map(([key, value]) => (
                <div
                  key={key}
                  className={`rounded-xl p-2 border ${
                    darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="font-semibold mb-1">{key}</div>
                  <pre className="whitespace-pre-wrap break-words">
                    {formatVariable(value)}
                  </pre>
                </div>
              ))
            ) : (
              <p className="opacity-70">Heap is empty</p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          darkMode={darkMode}
          icon={<TerminalSquare size={18} />}
          title="Console Output"
        >
          <pre className="font-jetbrains text-sm whitespace-pre-wrap break-words">
            {outputSnapshot || finalOutput || "No output yet"}
          </pre>
        </SectionCard>
      </div>
    </div>
  );
};

export default MemoryPanel;