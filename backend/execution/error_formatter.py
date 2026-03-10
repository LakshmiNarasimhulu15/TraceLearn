import traceback
import re

def format_exception(e):
    tb = traceback.format_exc()

    line_number = None
    if hasattr(e, "__traceback__") and e.__traceback__:
        tb_last = traceback.extract_tb(e.__traceback__)[-1]
        line_number = tb_last.lineno

    if isinstance(e, SyntaxError):
        return {
            "type": "SyntaxError",
            "message": e.msg,
            "line_number": e.lineno,
            "traceback": tb
        }

    if type(e).__name__ == 'SyntaxError':
        match = re.search(r'line (\d+)', str(e))
        if match:
            line_number = int(match.group(1))

    return {
        "type": type(e).__name__,
        "message": str(e),
        "line_number": line_number,
        "traceback": tb
    }