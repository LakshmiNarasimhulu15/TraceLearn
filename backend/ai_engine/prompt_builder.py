import json

def build_prompt(code, steps, final_output=None):
    prompt = f"""
You are an expert Python teacher.

Please explain the following Python code line by line,
what each line does, and why it produces its output.

Code:
{code}
"""

    if final_output:
        prompt += f"\nFinal Output:\n{final_output}\n"

    prompt += "\nBegin explanation:" 
    return prompt
