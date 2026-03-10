import types
import threading
from collections.abc import ItemsView, KeysView, ValuesView


class VariableSerializer:
    def __init__(self):
        self.visited = {}

    def serialize(self, obj):
        try:
            if id(obj) in self.visited:
                return {"ref": hex(id(obj))}

            if isinstance(obj, (int, float, str, bool)) or obj is None:
                return obj

            if isinstance(obj, list):
                return [self.serialize(i) for i in obj]

            if isinstance(obj, tuple):
                return {
                    "type": "tuple",
                    "value": [self.serialize(i) for i in obj]
                }

            if isinstance(obj, set):
                return {
                    "type": "set",
                    "value": [self.serialize(i) for i in obj]
                }

            if isinstance(obj, dict):
                return {
                    str(k): self.serialize(v)
                    for k, v in obj.items()
                }

            if isinstance(obj, KeysView):
                return {
                    "type": "keys_view",
                    "value": [self.serialize(i) for i in list(obj)]
                }

            if isinstance(obj, ValuesView):
                return {
                    "type": "values_view",
                    "value": [self.serialize(i) for i in list(obj)]
                }

            if isinstance(obj, ItemsView):
                return {
                    "type": "items_view",
                    "value": [
                        [self.serialize(k), self.serialize(v)]
                        for k, v in list(obj)
                    ]
                }

            if isinstance(obj, types.ModuleType):
                return {
                    "type": "module",
                    "name": obj.__name__
                }

            if isinstance(obj, threading.Thread):
                return {
                    "type": "thread",
                    "name": obj.name,
                    "alive": obj.is_alive(),
                    "daemon": obj.daemon
                }

            if callable(obj):
                return {
                    "type": "function",
                    "name": getattr(obj, "__name__", "anonymous")
                }

            if hasattr(obj, "__dict__"):
                self.visited[id(obj)] = True
                return {
                    "type": obj.__class__.__name__,
                    "memory_id": hex(id(obj)),
                    "attributes": {
                        k: self.serialize(v)
                        for k, v in obj.__dict__.items()
                    }
                }

            return {
                "type": obj.__class__.__name__,
                "value": self.safe_string(obj)
            }

        except Exception as e:
            return {
                "type": "unserializable",
                "class": obj.__class__.__name__,
                "value": f"<unserializable: {e}>"
            }

    def safe_string(self, obj):
        try:
            return str(obj)
        except Exception:
            try:
                return repr(obj)
            except Exception:
                return f"<{obj.__class__.__name__}>"