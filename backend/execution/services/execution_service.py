from session.models import CodeSession, ExecutionStep
from execution.executor import CodeExecutor
from execution.ast_analyzer import analyze_code_math
from execution.math_visualizer import generate_math_visualizations
from execution.object_graph_builder import ObjectGraphBuilder
from execution.input_handler import InputHandler
from execution.restricted_env import get_restricted_globals

from ai_engine.prompt_builder import build_prompt
from ai_engine.llm_handler import generate_explanation

import threading
import time


class ExecutionService:
    def __init__(self, code, inputs=None):
        self.code = code
        self.inputs = inputs or []
        self.session_id = None

    def run(self):
        print("[SERVICE] Starting execution service")
        print(f"[SERVICE] Input count: {len(self.inputs)}")

        input_handler = InputHandler(self.inputs)

        executor = CodeExecutor(self.code)
        executor.restricted_globals = get_restricted_globals(input_handler)

        result = executor.execute()

        steps = result["steps"]
        output = result["output"]
        error = result["error"]
        threads = result["threads"]

        print(f"[SERVICE] Raw steps collected: {len(steps)}")
        print(f"[SERVICE] Raw output: {output!r}")
        print(f"[SERVICE] Raw error: {error}")

        # Ensure last step has complete output
        if steps and output:
            steps[-1]["output_snapshot"] = output

        # Only analyze and visualize if no error
        if not error:
            analysis = analyze_code_math(self.code)
            steps = generate_math_visualizations(steps, analysis)

            print(f"[SERVICE]  Steps after math visualization: {len(steps)}")

            # filter out internal vars (__name__, modules) to reduce payload
            def clean_vars(var_dict):
                out = {}
                for k, v in var_dict.items():
                    if k.startswith("__") and k.endswith("__"):
                        continue
                    if isinstance(v, dict) and v.get("type") == "module":
                        continue
                    out[k] = v
                return out

            for step in steps:
                step_vars = step.get("variables", {})
                cleaned = clean_vars(step_vars)
                step["variables"] = cleaned
                graph_builder = ObjectGraphBuilder()
                graph = graph_builder.build(cleaned)
                step["object_graph"] = graph
        else:
            print(f"[SERVICE] Skipping analysis and visualization due to error: {error}")

        # Generate AI explanation asynchronously if session_id provided
        explanation = ""
        prompt_len = 0  # Initialize prompt_len
        if self.session_id and not error:
            def generate_explanation_async():
                nonlocal prompt_len  # Allow modification of outer variable
                try:
                    print("[SERVICE] Starting LLM explanation generation")
                    prompt = build_prompt(self.code, steps, final_output=output)
                    prompt_len = len(prompt)
                    print(f"[SERVICE] Prompt length: {prompt_len} characters")
                    exp = generate_explanation(prompt)
                    print(f"[SERVICE] Raw explanation length: {len(exp)}")
                    if not exp or not exp.strip():
                        exp = "Explanation generation failed."
                    # Update session with explanation
                    session = CodeSession.objects.get(id=self.session_id)
                    session.explanation = exp
                    session.save()
                    print("[SERVICE] Explanation saved to session")
                except Exception as e:
                    print(f"[SERVICE] Explanation generation failed: {e}")
                    import traceback
                    traceback.print_exc()

            thread = threading.Thread(target=generate_explanation_async)
            thread.daemon = True
            thread.start()

        response = {
            "steps": steps,
            "final_output": output or "",
            "error": error,
            "threads": threads,
            "explanation": explanation,
            "input_usage": input_handler.get_usage(),
            "has_threads": bool(threads) or self._detect_threading_usage()
        }
        # include debug data when Django DEBUG is True
        from django.conf import settings
        if getattr(settings, 'DEBUG', False):
            response['debug'] = {'prompt_length': prompt_len}
        return response

    def _detect_threading_usage(self):
        """Detect if code uses threading in various ways"""
        code_lower = self.code.lower()
        detections = []
        
        # Check for threading module usage
        if "import threading" in code_lower or "from threading" in code_lower:
            detections.append("imports threading module")
        
        # Check for thread creation patterns
        if "threading.thread(" in code_lower:
            detections.append("creates Thread objects")
        
        if ".start()" in code_lower:
            detections.append("starts threads")
            
        if ".join()" in code_lower:
            detections.append("joins threads")
        
        # Check for concurrent.futures usage
        if "concurrent.futures" in code_lower:
            detections.append("uses concurrent.futures")
        
        if "threadpool" in code_lower or "processpool" in code_lower:
            detections.append("uses pool executors")
        
        if detections:
            print(f"[SERVICE] Threading detected: {', '.join(detections)}")
            return True
        
        return False

    def run_async_explanation(self):
        print(f"[SERVICE] run_async_explanation called, session_id: {self.session_id}")
        if not self.session_id:
            print("[SERVICE] No session_id, returning")
            return
        # Re-run the analysis for explanation
        print("[SERVICE] Re-running execution for explanation analysis")
        input_handler = InputHandler(self.inputs or [])
        executor = CodeExecutor(self.code)
        executor.restricted_globals = get_restricted_globals(input_handler)
        result = executor.execute()
        steps = result["steps"]
        output = result["output"]
        error = result["error"]

        if error:
            print(f"[SERVICE] Error found during re-execution: {error}")
            return

        # Re-do analysis
        analysis = analyze_code_math(self.code)
        steps = generate_math_visualizations(steps, analysis)

        def clean_vars(var_dict):
            out = {}
            for k, v in var_dict.items():
                if k.startswith("__") and k.endswith("__"):
                    continue
                if isinstance(v, dict) and v.get("type") == "module":
                    continue
                out[k] = v
            return out

        for step in steps:
            step_vars = step.get("variables", {})
            cleaned = clean_vars(step_vars)
            step["variables"] = cleaned

        def generate_explanation_async():
            try:
                print("[SERVICE] Starting LLM explanation generation")
                prompt = build_prompt(self.code, steps, final_output=output)
                prompt_len = len(prompt)
                print(f"[SERVICE] Prompt length: {prompt_len}")
                exp = generate_explanation(prompt)
                print(f"[SERVICE] Raw explanation length: {len(exp)}")
                if not exp or not exp.strip():
                    exp = "Explanation generation failed."
                # Update session with explanation
                try:
                    session = CodeSession.objects.get(id=self.session_id)
                    session.explanation = exp
                    session.save()
                    print(f"[SERVICE] Explanation saved to session {self.session_id}")
                    import time
                    time.sleep(1)  # Delay to ensure commit
                except CodeSession.DoesNotExist:
                    print(f"[SERVICE] Session {self.session_id} not found!")
            except Exception as e:
                print(f"[SERVICE] Explanation generation failed: {e}")
                import traceback
                traceback.print_exc()

        print("[SERVICE] Starting daemon thread for async explanation generation")
        thread = threading.Thread(target=generate_explanation_async, daemon=True)
        thread.start()
        print("[SERVICE] Daemon thread started")

    @staticmethod
    def execute_code_service(user, code, inputs=None):
        service = ExecutionService(code, inputs)
        result = service.run()

        session = CodeSession.objects.create(
            user=user,
            code=code
        )

        for step in result["steps"]:
            ExecutionStep.objects.create(
                session=session,
                step_index=step["step_index"],
                event=step["event"],
                line_number=step["line_number"],
                code_line=step["code_line"],
                variables_json=step["variables"],
                stack_depth=step["stack_depth"],
                output_snapshot=step["output_snapshot"],
                math_visualization=step.get("math_visualization")
            )

        print(f"[SERVICE] Session saved with ID: {session.id}")
        print(f"[SERVICE] Execution steps saved: {len(result['steps'])}")

        # Set session_id for async explanation
        service.session_id = session.id
        # Start async explanation
        if not result["error"]:
            service.run_async_explanation()

        has_threads = result.get("has_threads", False)
        print(f"[SERVICE] has_threads: {has_threads}, threads count: {len(result.get('threads', []))}")

        return {
            "session_id": session.id,
            "steps": result["steps"],
            "final_output": result["final_output"],
            "explanation": result["explanation"],
            "error": result["error"],
            "threads": result.get("threads", []),
            "has_threads": has_threads
        }
