import builtins
import math
import random
import threading
import time
import abc


ALLOWED_MODULES = {
    "math": math,
    "random": random,
    "threading": threading,
    "time": time,
    "abc": abc,
}


def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    """
    Restrict imports only to explicitly allowed modules.
    Supports:
      import math
      import threading
      import time
      from abc import ABC, abstractmethod
    """
    root_name = name.split(".")[0]

    if root_name in ALLOWED_MODULES:
        return ALLOWED_MODULES[root_name]

    raise ImportError(f"Import of module '{name}' is not allowed.")


COMMON_EXCEPTIONS = {
    "Exception": Exception,
    "BaseException": BaseException,
    "ArithmeticError": ArithmeticError,
    "ValueError": ValueError,
    "TypeError": TypeError,
    "NameError": NameError,
    "ZeroDivisionError": ZeroDivisionError,
    "IndexError": IndexError,
    "KeyError": KeyError,
    "AttributeError": AttributeError,
    "ImportError": ImportError,
    "RuntimeError": RuntimeError,
    "EOFError": EOFError,
}


ALLOWED_BUILTINS = {
    # Basic I/O
    "print": print,
    "input": input,

    
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "list": list,
    "dict": dict,
    "set": set,
    "tuple": tuple,

    
    "range": range,
    "len": len,
    "enumerate": enumerate,
    "zip": zip,
    "sorted": sorted,
    "reversed": reversed,

    
    "sum": sum,
    "min": min,
    "max": max,
    "abs": abs,
    "any": any,
    "all": all,
    "map": map,
    "filter": filter,

    
    "__build_class__": builtins.__build_class__,
    "object": object,
    "type": type,
    "super": super,
    "isinstance": isinstance,
    "issubclass": issubclass,
    "hasattr": hasattr,
    "getattr": getattr,
    "setattr": setattr,
    "property": property,
    "staticmethod": staticmethod,
    "classmethod": classmethod,

    
    "__import__": safe_import,
}

ALLOWED_BUILTINS.update(COMMON_EXCEPTIONS)


def get_restricted_globals(input_handler=None):
    builtins_copy = ALLOWED_BUILTINS.copy()

    if input_handler:
        builtins_copy["input"] = input_handler.input

    safe_globals = {
        "__builtins__": builtins_copy,
        "__name__": "__main__",
    }

    safe_globals.update(ALLOWED_MODULES)
    return safe_globals
