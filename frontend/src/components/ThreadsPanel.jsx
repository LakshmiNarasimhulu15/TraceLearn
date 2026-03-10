import React, { useContext, useMemo } from "react";
import { GitBranch, CircleDot, Play, Pause } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const ThreadsPanel = ({ threads = [], steps = [], currentStep }) => {
  const { darkMode } = useContext(ThemeContext);

  const threadSteps = useMemo(() => {
    const grouped = {};
    steps.forEach((step, index) => {
      const threadName = step.thread || "MainThread";
      if (!grouped[threadName]) {
        grouped[threadName] = [];
      }
      grouped[threadName].push({ ...step, globalIndex: index });
    });
    return grouped;
  }, [steps]);

  const threadInfo = useMemo(() => {
    const info = {};
    threads.forEach(thread => {
      info[thread.name] = thread;
    });
    return info;
  }, [threads]);

  return (
    <div
      className={`rounded-3xl border p-4 ${darkMode ? "bg-slate-950/60 border-white/10 text-white" : "bg-white/75 border-slate-200 text-slate-900"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={18} />
        <span className="font-frozito text-[20px]">Thread Execution</span>
      </div>

      <div className="space-y-3 font-jetbrains text-xs max-h-32 overflow-y-auto">
        {Object.keys(threadSteps).length > 0 ? (
          Object.entries(threadSteps).map(([threadName, threadStepsList]) => {
            const threadData = threadInfo[threadName];
            const isActive = threadData?.alive || threadName === "MainThread";
            const stepCount = threadStepsList.length;
            const currentThreadStep = threadStepsList.find(s => s.globalIndex === currentStep);

            return (
              <div
                key={threadName}
                className={`rounded-2xl p-3 border ${darkMode ? "bg-slate-900/70 border-white/10" : "bg-slate-50 border-slate-200"}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {isActive ? <Play size={12} className="text-emerald-400" /> : <Pause size={12} className="text-red-400" />}
                    {threadName}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {stepCount} steps
                  </div>
                </div>

                
                <div className="flex gap-1 mb-2">
                  {threadStepsList.slice(0, 10).map((step, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        step.globalIndex === currentStep
                          ? "bg-cyan-400"
                          : step.globalIndex < currentStep
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      }`}
                      title={`Step ${step.globalIndex + 1}: Line ${step.line_number}`}
                    />
                  ))}
                  {stepCount > 10 && (
                    <div className="h-2 w-2 rounded-full bg-gray-300" title={`+${stepCount - 10} more steps`} />
                  )}
                </div>

                {currentThreadStep && (
                  <div className="text-[11px] opacity-70">
                    Current: Line {currentThreadStep.line_number} - {currentThreadStep.code_line?.slice(0, 30)}...
                  </div>
                )}

                {threadData && (
                  <div className="text-[11px] opacity-70 mt-1">
                    Daemon: {threadData.daemon ? "Yes" : "No"}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="opacity-70">No thread execution data.</div>
        )}
      </div>
    </div>
  );
};

export default ThreadsPanel;