
class ObjectGraphBuilder:
    """
    Builds a structured object graph from serialized variables.

    Produces:
    - nodes (objects / primitives)
    - edges (references between them)
    """

    def __init__(self):
        self.nodes = {}
        self.edges = []

    def build(self, variables):

        for var_name, value in variables.items():
            self._process_node(var_name, value)

        return {
            "nodes": list(self.nodes.values()),
            "edges": self.edges
        }

    def _process_node(self, name, value):
        if isinstance(value, dict):
            if "memory_id" in value:

                node_id = value["memory_id"]

                if node_id not in self.nodes:
                    self.nodes[node_id] = {
                        "id": node_id,
                        "type": value.get("type"),
                        "attributes": value.get("attributes", {})
                    }

                
                self.edges.append({
                    "from": name,
                    "to": node_id,
                    "relation": "references"
                })

                
                for attr_name, attr_val in value.get("attributes", {}).items():

                    attr_key = f"{node_id}.{attr_name}"

                    self._process_node(attr_key, attr_val)

            
            elif "ref" in value:

                self.edges.append({
                    "from": name,
                    "to": value["ref"],
                    "relation": "reference_link"
                })

        
        else:

            if name not in self.nodes:

                self.nodes[name] = {
                    "id": name,
                    "type": "primitive",
                    "value": value
                }


