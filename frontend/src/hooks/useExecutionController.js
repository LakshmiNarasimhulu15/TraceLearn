import { useMemo, useRef, useState } from "react";
import { executeCode, fetchExplanation } from "../services/codeExecution";
import { fetchSessionDetail } from "../services/sessions";

const DEFAULT_CODE = `# Write your Python code here
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

p = Person("Ram", 20)
print(p.name)
`;

export const useExecutionController = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [inputs, setInputs] = useState([]);
  const [steps, setSteps] = useState([]);
  const [threads, setThreads] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [finalOutput, setFinalOutput] = useState("");
  const [aiExplanation, setAIExplanation] = useState("");
  const [error, setError] = useState(null);
  const [hasThreads, setHasThreads] = useState(false);
  const [loading, setLoading] = useState(false);

  const stopExecutionRef = useRef(false);

  const currentStepData = useMemo(() => {
    if (!steps.length) return null;
    return steps[currentStep - 1] || null;
  }, [steps, currentStep]);

  const currentErrorLine = useMemo(() => {
    if (!error) return null;
    return error.line_number || null;
  }, [error]);

  const currentLineNumber = useMemo(() => {
    return currentStepData?.line_number || null;
  }, [currentStepData]);

  const resetExecutionState = () => {
    setSteps([]);
    setThreads([]);
    setCurrentStep(1);
    setFinalOutput("");
    setAIExplanation("");
    setError(null);
    setHasThreads(false);
  };

  const runCode = async () => {
    setLoading(true);
    stopExecutionRef.current = false;
    resetExecutionState();

    try {
      const response = await executeCode({
        code,
        inputs: inputs.filter((item) => item !== ""),
      });

      if (stopExecutionRef.current) return;

      setSteps(response.steps || []);
      setThreads(response.threads || []);
      setFinalOutput(response.final_output || "");
      setCurrentStep(1);
      setHasThreads(response.has_threads || false);

      console.log("[DEBUG] Response has_threads:", response.has_threads);
      console.log("[DEBUG] Response threads:", response.threads);
      console.log("[DEBUG] Session ID:", response.session_id);

      if (response.error) {
        setError(response.error);
        console.log("[DEBUG] Backend error:", response.error);
      } else {
        setError(null);
      }

      if (response.session_id && !response.error) {
        console.log("[DEBUG] Scheduling explanation fetch for session:", response.session_id);
        let retryCount = 0;
        const maxRetries = 10;
        const retryDelay = 20000; 
        
        const fetchExplanationWithRetry = async () => {
          try {
            console.log(`[DEBUG] Attempt ${retryCount + 1}/${maxRetries + 1}: Fetching explanation for session ${response.session_id}`);
            const explanationResponse = await fetchExplanation(response.session_id);
            console.log("[DEBUG] API response received:", explanationResponse);
            const exp = explanationResponse?.explanation;
            console.log("[DEBUG] Explanation field:", exp);
            console.log("[DEBUG] Type:", typeof exp, "Length:", exp ? exp.length : 0);
            
            if (exp && typeof exp === 'string' && exp.trim().length > 0) {
              console.log("[DEBUG] Explanation found! Setting state, length:", exp.length);
              console.log("[DEBUG] Preview (first 300 chars):", exp.substring(0, 300));
              setAIExplanation(exp);
              return true; 
            } else {
              console.log("[DEBUG] Explanation empty, will retry...");
              return false;
            }
          } catch (err) {
            console.error("[DEBUG] Fetch error:", err);
            return false;
          }
        };
        
        setTimeout(async () => {
          const success = await fetchExplanationWithRetry();
          
         
          if (!success && retryCount < maxRetries) {
            const retryInterval = setInterval(async () => {
              retryCount++;
              const retrySuccess = await fetchExplanationWithRetry();
              if (retrySuccess || retryCount >= maxRetries) {
                clearInterval(retryInterval);
                if (!retrySuccess) {
                  console.log("[DEBUG] Max retries reached, explanation not available");
                }
              }
            }, retryDelay);
          }
        }, 40000); 
      }

      if (response.debug && response.debug.prompt_length !== undefined) {
        console.log("[DEBUG] LLM prompt length:", response.debug.prompt_length);
      }
    } catch (err) {
      console.error("[ERROR] Execution error:", err);
      
      if (err?.response?.data?.error) {
        setError({
          type: "BackendError",
          message: err.response.data.error,
          line_number: null,
          traceback: "",
        });
      } else {
        setError({
          type: "FrontendExecutionError",
          message: err?.message || "Execution failed",
          line_number: null,
          traceback: err?.stack || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    if (!sessionId) return;

    setLoading(true);
    stopExecutionRef.current = true;

    try {
      const session = await fetchSessionDetail(sessionId);

      setCode(session.code || "");
      setSteps(
        (session.steps || []).map((step) => ({
          ...step,
          variables: step.variables_json || {},
        }))
      );
      setThreads([]);
      setCurrentStep(1);
      setFinalOutput("");
      setAIExplanation("");
      setError(null);
    } catch (err) {
      setError({
        type: "SessionLoadError",
        message: err?.response?.data?.error || err.message || "Could not load session",
        line_number: null,
        traceback: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopExecution = () => {
    stopExecutionRef.current = true;
    setLoading(false);
  };

  const goPrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goNext = () => {
    setCurrentStep((prev) => Math.min(steps.length || 1, prev + 1));
  };

  const goLast = () => {
    if (steps.length > 0) {
      setCurrentStep(steps.length);
    }
  };

  return {
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
    resetExecutionState,
  };
};

export default useExecutionController;