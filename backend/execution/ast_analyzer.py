import ast

class MathExpressionVisitor(ast.NodeVisitor):
    def __init__(self):
        self.expressions = []

    def visit_Assign(self, node):
        if isinstance(node.value, ast.BinOp):
            self.expressions.append(self._extract_binop(node.value, node.lineno))
        self.generic_visit(node)

    def visit_AugAssign(self, node):
        if isinstance(node.value, ast.BinOp):
            self.expressions.append(self._extract_binop(node.value, node.lineno))
        self.generic_visit(node)

    def visit_Expr(self, node):
        if isinstance(node.value, ast.BinOp):
            self.expressions.append(self._extract_binop(node.value, node.lineno))
        elif isinstance(node.value, ast.Compare):
            self.expressions.append(self._extract_compare(node.value, node.lineno))
        self.generic_visit(node)

    def visit_If(self, node):
        if isinstance(node.test, ast.Compare):
            self.expressions.append(self._extract_compare(node.test, node.lineno, is_decision=True))
        elif isinstance(node.test, ast.BinOp):
            self.expressions.append(self._extract_binop(node.test, node.lineno, is_decision=True))
        self.generic_visit(node)

    def visit_While(self, node):
        if isinstance(node.test, ast.Compare):
            self.expressions.append(self._extract_compare(node.test, node.lineno, is_decision=True))
        elif isinstance(node.test, ast.BinOp):
            self.expressions.append(self._extract_binop(node.test, node.lineno, is_decision=True))
        self.generic_visit(node)

    def visit_For(self, node):
        if isinstance(node.iter, ast.Call):
            for_expr = self._extract_for_loop(node)
            if for_expr:
                self.expressions.append(for_expr)
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node):
        self.generic_visit(node)

    def _extract_binop(self, node, lineno, is_decision=False):
        return {
            "line": lineno,
            "type": "binary_operation",
            "operator": self._get_operator(node.op),
            "left": self._extract_operand(node.left),
            "right": self._extract_operand(node.right),
            "is_decision": is_decision
        }

    def _extract_compare(self, node, lineno, is_decision=False):
        if len(node.comparators) == 1:
            return {
                "line": lineno,
                "type": "comparison",
                "operator": self._get_compare_op(node.ops[0]),
                "left": self._extract_operand(node.left),
                "right": self._extract_operand(node.comparators[0]),
                "is_decision": is_decision
            }
        return None

    def _extract_operand(self, node):
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            inner = self._extract_operand(node.operand)
            if inner.get("type") == "constant" and isinstance(inner.get("value"), (int, float)):
                if isinstance(node.op, ast.USub):
                    inner["value"] = -inner["value"]
            return inner

        if isinstance(node, ast.Name):
            return {"type": "variable", "value": node.id}

        if isinstance(node, ast.Constant):
            return {"type": "constant", "value": node.value}

        if isinstance(node, ast.BinOp):
            return self._extract_binop(node, node.lineno)

        if isinstance(node, ast.Subscript):
            return self._extract_subscript(node)

        if isinstance(node, ast.Compare):
            return self._extract_compare(node, node.lineno)

        if isinstance(node, ast.Call):
            return self._extract_call(node)

        return {"type": "unknown", "value": str(node)}

    def _extract_call(self, node):
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            if func_name == "len" and len(node.args) == 1:
                arg = self._extract_operand(node.args[0])
                return {
                    "type": "function_call",
                    "function": "len",
                    "arg": arg
                }
        return {"type": "unknown", "value": str(node)}

    def _extract_for_loop(self, node):
        if isinstance(node.iter, ast.Call) and isinstance(node.iter.func, ast.Name):
            func_name = node.iter.func.id
            if func_name == "range":
                target_var = node.target.id if isinstance(node.target, ast.Name) else "i"
                args = []
                for arg in node.iter.args:
                    args.append(self._extract_operand(arg))
                
                return {
                    "line": node.lineno,
                    "type": "for_loop",
                    "target": target_var,
                    "function": "range",
                    "args": args,
                    "is_decision": True
                }
        return None

    def _extract_subscript(self, node):
        if isinstance(node.value, ast.Name):
            index_node = None
            
            if not isinstance(node.slice, ast.Index):
                index_node = node.slice
            elif isinstance(node.slice, ast.Index):
                index_node = node.slice.value
            
            if index_node:
                index = self._extract_operand(index_node)
                return {
                    "type": "array_access",
                    "array": node.value.id,
                    "index": index
                }
        return {"type": "unknown", "value": str(node)}

    def _get_operator(self, op):
        return {
            ast.Add: "+",
            ast.Sub: "-",
            ast.Mult: "*",
            ast.Div: "/",
            ast.Mod: "%",
            ast.Pow: "**",
            ast.FloorDiv: "//"
        }.get(type(op), "unknown")

    def _get_compare_op(self, op):
        return {
            ast.Eq: "==",
            ast.NotEq: "!=",
            ast.Lt: "<",
            ast.LtE: "<=",
            ast.Gt: ">",
            ast.GtE: ">=",
        }.get(type(op), "unknown")


def analyze_code_math(code):
    tree = ast.parse(code)
    visitor = MathExpressionVisitor()
    visitor.visit(tree)
    return visitor.expressions