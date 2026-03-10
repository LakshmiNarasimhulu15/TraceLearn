import sys
import io
import threading


class OutputCapture:

    def __init__(self):
        self._stdout = io.StringIO()
        self._stderr = io.StringIO()
        self._lock = threading.Lock()

    def write_stdout(self, text):
        with self._lock:
            self._stdout.write(text)

    def write_stderr(self, text):
        with self._lock:
            self._stderr.write(text)

    def get_stdout(self):
        return self._stdout.getvalue()

    def get_stderr(self):
        return self._stderr.getvalue()

    def get_combined(self):
        return self.get_stdout() + self.get_stderr()

    def clear(self):
        with self._lock:
            self._stdout = io.StringIO()
            self._stderr = io.StringIO()


class StdoutProxy:

    def __init__(self, capture):
        self.capture = capture

    def write(self, text):
        self.capture.write_stdout(text)

    def flush(self):
        pass


class StderrProxy:

    def __init__(self, capture):
        self.capture = capture

    def write(self, text):
        self.capture.write_stderr(text)

    def flush(self):
        pass


class OutputRedirector:

    def __init__(self):
        self.capture = OutputCapture()
        self._old_stdout = None
        self._old_stderr = None

    def start(self):

        self._old_stdout = sys.stdout
        self._old_stderr = sys.stderr

        sys.stdout = StdoutProxy(self.capture)
        sys.stderr = StderrProxy(self.capture)

    def stop(self):

        if self._old_stdout:
            sys.stdout = self._old_stdout

        if self._old_stderr:
            sys.stderr = self._old_stderr

    def get_output(self):
        return self.capture.get_combined()

    def get_stdout(self):
        return self.capture.get_stdout()

    def get_stderr(self):
        return self.capture.get_stderr()