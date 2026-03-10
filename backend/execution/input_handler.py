class InputHandler:
    """
    Simulates Python input() safely.
    Prevents blocking execution.
    """

    def __init__(self, inputs=None):
        self.inputs = inputs or []
        self.index = 0
        self.used_inputs = []

    def input(self, prompt=""):
        if self.index >= len(self.inputs):
            raise Exception("InputExhaustedError: No more input values provided.")

        value = self.inputs[self.index]
        self.used_inputs.append({
            "prompt": prompt,
            "value": value
        })
        self.index += 1
        return value

    def get_usage(self):
        return self.used_inputs