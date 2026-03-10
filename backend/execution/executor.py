import sys
import io
import threading

from execution.tracer import ExecutionTracer
from execution.restricted_env import get_restricted_globals
from execution.error_formatter import format_exception
from execution.thread_tracker import get_thread_info


class CodeExecutor:
    USER_SOURCE_FILENAME = "<tracelearn_user_code>"

    def __init__(self, code):
        self.code = code
        self.code_lines = code.split("\n")
        self.restricted_globals = None

    def execute(self):
        restricted_globals = self.restricted_globals or get_restricted_globals()

        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output

        tracer = ExecutionTracer(
            code_lines=self.code_lines,
            output_buffer=redirected_output,
            source_filename=self.USER_SOURCE_FILENAME,
        )

        error = None

        try:
            compiled_code = compile(
                self.code,
                self.USER_SOURCE_FILENAME,
                "exec"
            )
        except SyntaxError as e:
            error = {
                "type": "SyntaxError",
                "message": e.msg,
                "line_number": e.lineno,
                "traceback": ""
            }
        else:
            try:
                sys.settrace(tracer.trace)
                threading.settrace(tracer.trace)

                exec(compiled_code, restricted_globals)

            except Exception as e:
                error = format_exception(e)

            finally:
                sys.settrace(None)
                threading.settrace(None)

        if error is None:
            sys.settrace(None)
            threading.settrace(None)
            sys.stdout = old_stdout

        return {
            "steps": tracer.steps,
            "output": redirected_output.getvalue(),
            "error": error,
            "threads": get_thread_info()
        }


