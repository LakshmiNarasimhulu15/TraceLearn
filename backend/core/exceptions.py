class ExecutionError(Exception):
    """Base execution error."""
    pass


class StepLimitExceeded(ExecutionError):
    """Raised when execution exceeds step limit."""
    pass


class ExecutionTimeout(ExecutionError):
    """Raised when execution takes too long."""
    pass


class RestrictedOperationError(ExecutionError):
    """Raised when restricted operation is attempted."""
    pass


class InputExhaustedError(ExecutionError):
    """Raised when input() is called but no inputs remain."""
    pass