import threading
import time

from execution.variable_serializer import VariableSerializer
from execution.constants import MAX_STEPS, MAX_EXECUTION_TIME
from core.exceptions import StepLimitExceeded


class ExecutionTracer:
    def __init__(self, code_lines, output_buffer, source_filename):
        self.steps = []
        self.step_index = 0
        self.code_lines = code_lines
        self.stack_depth = 0
        self.output_buffer = output_buffer
        self.serializer = VariableSerializer()
        self.lock = threading.Lock()
        self.source_filename = source_filename
        self.start_time = time.monotonic()

    def _is_user_frame(self, frame):
        return frame.f_code.co_filename == self.source_filename

    def trace(self, frame, event, arg):
        if not self._is_user_frame(frame):
            return self.trace

        elapsed = time.monotonic() - self.start_time
        if elapsed >= MAX_EXECUTION_TIME:
            raise TimeoutError("Execution time limit exceeded")

        if self.step_index >= MAX_STEPS:
            raise StepLimitExceeded("Maximum execution steps exceeded")

        if event == "call":
            self.stack_depth += 1

        elif event == "return":
            self.stack_depth = max(0, self.stack_depth - 1)

        elif event == "line":
            lineno = frame.f_lineno

            serialized_locals = {}
            for k, v in frame.f_locals.items():
                serialized_locals[k] = self.serializer.serialize(v)

            step_data = {
                "step_index": self.step_index,
                "thread": threading.current_thread().name,
                "event": event,
                "line_number": lineno,
                "code_line": self.code_lines[lineno - 1].strip()
                if 0 <= lineno - 1 < len(self.code_lines) else "",
                "variables": serialized_locals,
                "stack_depth": self.stack_depth,
                "output_snapshot": self.output_buffer.getvalue(),
            }

            with self.lock:
                self.steps.append(step_data)
                self.step_index += 1

        return self.trace


