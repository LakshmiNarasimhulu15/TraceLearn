import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { getPageClass } from "../utils/theme";

import MonacoEditorSection from "../components/MonacoEditorSection";
import MemoryPanel from "../components/MemoryPanel";
import ExplanationPanel from "../components/ExplanationPanel";
import ThreadsPanel from "../components/ThreadsPanel";
import ErrorPanel from "../components/ErrorPanel";
import ObjectGraphPanel from "../components/ObjectGraphPanel";
import InputPanel from "../components/InputPanel";
import BottomBar from "../components/BottomBar";
import LoadingOverlay from "../components/LoadingOverlay";

import useExecutionController from "../hooks/useExecutionController";

const MainEditorPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();

  const {
    code,
    setCode,
    inputs,
    setInputs,
    steps,
    threads,
    currentStep,
    currentStepData,
    currentLineNumber,
    currentErrorLine,
    finalOutput,
    aiExplanation,
    error,
    hasThreads,
    loading,
    runCode,
    loadSession,
    stopExecution,
    goPrev,
    goNext,
    goLast,
  } = useExecutionController();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("sessionId");

    if (sessionId) {
      loadSession(sessionId);
    }
  }, [location.search]);

  return (
    <div className={`h-full w-full overflow-hidden ${getPageClass(darkMode)}`}>
      <div className="relative h-full w-full flex flex-col overflow-hidden">
        <LoadingOverlay
          show={loading}
          label="Executing code and generating explanation..."
        />

        <div className="flex-1 min-h-0 p-3 md:p-4 overflow-hidden">
          <div className="h-full grid grid-cols-12 gap-3 md:gap-4">
            {/* Left - Editor */}
            <section className="col-span-12 xl:col-span-5 min-h-0 overflow-hidden">
              <div className="h-full rounded-3xl overflow-hidden">
                <MonacoEditorSection
                  code={code}
                  setCode={setCode}
                  currentLineNumber={currentLineNumber}
                  errorLineNumber={currentErrorLine}
                />
              </div>
            </section>

            <section className="col-span-12 md:col-span-6 xl:col-span-3 min-h-0 overflow-hidden">
              <div className="h-full flex flex-col gap-3 md:gap-4 overflow-hidden">
                <div className="shrink-0">
                  <InputPanel inputs={inputs} setInputs={setInputs} />
                </div>

                <div className="flex-1 min-h-0 overflow-hidden">
                  <MemoryPanel
                    step={currentStepData}
                    finalOutput={finalOutput}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                  />
                </div>

                <div className="shrink-0 max-h-[220px] overflow-hidden">
                  <div className="h-full panel-scroll">
                    <ObjectGraphPanel objectGraph={currentStepData?.object_graph} />
                  </div>
                </div>
              </div>
            </section>

            
            <section className="col-span-12 md:col-span-6 xl:col-span-4 min-h-0 overflow-hidden">
              <div className="h-full flex flex-col gap-3 md:gap-4 overflow-hidden">
                <div className={`min-h-0 overflow-hidden ${hasThreads || error ? '' : 'flex-1'}`}>
                  <ExplanationPanel
                    currentStep={currentStep}
                    steps={steps}
                    explanation={aiExplanation}
                  />
                </div>

                {hasThreads && (
                  <div className="shrink-0 max-h-[170px] overflow-hidden">
                    <div className="h-full panel-scroll">
                      <ThreadsPanel threads={threads} steps={steps} currentStep={currentStep} />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="shrink-0 max-h-[190px] overflow-hidden">
                    <div className="h-full panel-scroll">
                      <ErrorPanel error={error} />
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        
        <div className="shrink-0">
          <BottomBar
            currentStep={currentStep}
            totalSteps={steps.length || 1}
            onRun={runCode}
            onStop={stopExecution}
            onPrev={goPrev}
            onNext={goNext}
            onLast={goLast}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default MainEditorPage;