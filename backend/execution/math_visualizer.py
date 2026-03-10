def resolve_operand(operand, variables):
    if operand["type"] == "variable":
        var_name = operand["value"]
        return variables.get(var_name, "undefined")

    if operand["type"] == "constant":
        return operand["value"]

    if operand["type"] == "function_call":
        if operand["function"] == "len":
            arg_value = resolve_operand(operand["arg"], variables)
            try:
                return len(arg_value)
            except:
                return "error"

    if operand["type"] == "array_access":
        array_name = operand["array"]
        index_val = resolve_operand(operand["index"], variables)
        array = variables.get(array_name, [])

        if isinstance(array, (list, tuple)):
            try:
                if isinstance(index_val, int):
                    if 0 <= index_val < len(array):
                        return array[index_val]
                    else:
                        return f"index {index_val} out of range"
                else:
                    return f"invalid index type: {type(index_val).__name__}"
            except:
                return f"error accessing {array_name}[{index_val}]"
        elif isinstance(array, dict):
            try:
                return array.get(index_val, f"key '{index_val}' not found")
            except:
                return f"error accessing {array_name}[{index_val}]"
        else:
            return f"cannot index {type(array).__name__}"

    if operand["type"] == "binary_operation":
        left = resolve_operand(operand["left"], variables)
        right = resolve_operand(operand["right"], variables)
        op = operand["operator"]
        return evaluate_operation(left, right, op)

    if operand["type"] == "comparison":
        left = resolve_operand(operand["left"], variables)
        right = resolve_operand(operand["right"], variables)
        op = operand["operator"]
        return evaluate_comparison(left, right, op)

    return "unknown"


def evaluate_operation(left, right, operator):
    try:
        if operator == "+":
            return left + right
        if operator == "-":
            return left - right
        if operator == "*":
            return left * right
        if operator == "/":
            return left / right if right != 0 else "division by zero"
        if operator == "%":
            return left % right
        if operator == "**":
            return left ** right
        if operator == "//":
            return left // right
    except:
        return "error"


def evaluate_comparison(left, right, operator):
    try:
        if operator == "==":
            return left == right
        if operator == "!=":
            return left != right
        if operator == "<":
            return left < right
        if operator == "<=":
            return left <= right
        if operator == ">":
            return left > right
        if operator == ">=":
            return left >= right
    except:
        return "error"


def format_operand_display(operand, variables):
    """Format operand for display in visualization"""
    if operand["type"] == "variable":
        var_name = operand["value"]
        value = variables.get(var_name, "undefined")
        if isinstance(value, (list, tuple)):
            type_name = "list" if isinstance(value, list) else "tuple"
            return f"{var_name}({type_name} of {len(value)} items)"
        elif isinstance(value, dict):
            return f"{var_name}(dict with {len(value)} keys)"
        elif isinstance(value, str):
            return f"{var_name}('{value}')" if len(value) < 20 else f"{var_name}(string)"
        else:
            return f"{var_name}({value})"

    if operand["type"] == "function_call":
        if operand["function"] == "len":
            arg_display = format_operand_display(operand["arg"], variables)
            arg_value = resolve_operand(operand["arg"], variables)
            try:
                result = len(arg_value) if hasattr(arg_value, '__len__') else "error"
                return f"len({arg_display}) = {result}"
            except:
                return f"len({arg_display}) = error"

    if operand["type"] == "constant":
        value = operand["value"]
        if isinstance(value, str):
            return f"'{value}'" if len(value) < 20 else f"string"
        return str(value)

    if operand["type"] == "array_access":
        array_name = operand["array"]
        index_display = format_operand_display(operand["index"], variables)
        array = variables.get(array_name, [])

        
        index_val = resolve_operand(operand["index"], variables)
        actual_value = resolve_operand(operand, variables)

        
        if isinstance(array, (list, tuple)):
            return f"{array_name}[{index_display}] = {actual_value}"
        elif isinstance(array, dict):
            return f"{array_name}[{index_display}] = {actual_value}"
        else:
            return f"{array_name}[{index_display}] = {actual_value}"

    if operand["type"] == "unknown":
        value_str = operand.get("value", "unknown")
        if "Subscript" in value_str or "Index" in value_str:
            return "array_element"
        return str(value_str)

    if operand["type"] == "binary_operation":
        left = format_operand_display(operand["left"], variables)
        right = format_operand_display(operand["right"], variables)
        op = operand["operator"]
        result = evaluate_operation(
            resolve_operand(operand["left"], variables),
            resolve_operand(operand["right"], variables),
            op
        )
        return f"({left} {op} {right}) = {result}"

    if operand["type"] == "comparison":
        left = format_operand_display(operand["left"], variables)
        right = format_operand_display(operand["right"], variables)
        op = operand["operator"]
        result = evaluate_comparison(
            resolve_operand(operand["left"], variables),
            resolve_operand(operand["right"], variables),
            op
        )
        return f"({left} {op} {right}) = {result}"

    return str(operand.get("value", "unknown"))


def generate_math_visualizations(steps, math_expressions):
    math_map = {expr["line"]: expr for expr in math_expressions}

    for idx, step in enumerate(steps):
        line = step["line_number"]

        if line in math_map:
            expr = math_map[line]
            variables = step["variables"]

            if expr["type"] == "binary_operation":
                left_display = format_operand_display(expr["left"], variables)
                right_display = format_operand_display(expr["right"], variables)
                result = evaluate_operation(
                    resolve_operand(expr["left"], variables),
                    resolve_operand(expr["right"], variables),
                    expr["operator"]
                )

                step["math_visualization"] = {
                    "type": "math",
                    "expression": f"{left_display} {expr['operator']} {right_display}",
                    "result": result
                }

            elif expr["type"] == "comparison":
                left_display = format_operand_display(expr["left"], variables)
                right_display = format_operand_display(expr["right"], variables)
                result = evaluate_comparison(
                    resolve_operand(expr["left"], variables),
                    resolve_operand(expr["right"], variables),
                    expr["operator"]
                )

                viz_type = "decision" if expr.get("is_decision") else "comparison"
                step["math_visualization"] = {
                    "type": viz_type,
                    "expression": f"{left_display} {expr['operator']} {right_display}",
                    "result": result
                }

            elif expr["type"] == "for_loop":
                if expr["function"] == "range":
                    args_resolved = []
                    args_display = []
                    for arg in expr["args"]:
                        val = resolve_operand(arg, variables)
                        disp = format_operand_display(arg, variables)
                        args_resolved.append(val)
                        args_display.append(disp)
                    
                    target = expr["target"]
                    current_iteration = variables.get(target, 0)
                    next_iteration = current_iteration
                    try:
                        next_step = steps[idx + 1]
                        next_iteration = next_step["variables"].get(target, current_iteration)
                    except Exception:
                        pass
                    display_i = next_iteration if next_iteration != current_iteration else current_iteration
                    
                    if len(args_resolved) == 1:
                        max_val = args_resolved[0]
                        loop_active = display_i < max_val
                        expression = f"{target} = {display_i}, {display_i} < {args_display[0]} → {'enters loop' if loop_active else 'exits loop'}"
                    elif len(args_resolved) == 2:
                        start_val = args_resolved[0]
                        max_val = args_resolved[1]
                        loop_active = display_i < max_val
                        expression = f"{target} = {display_i}, {display_i} < {max_val} → {'enters loop' if loop_active else 'exits loop'}"
                    else:
                        expression = f"for {target} in range(...)"
                        loop_active = True
                    
                    step["math_visualization"] = {
                        "type": "decision",
                        "expression": expression,
                        "result": loop_active
                    }

        else:
            step["math_visualization"] = None

    return steps