from django.db import models
from django.conf import settings

class CodeSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    code = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_run_at = models.DateTimeField(auto_now=True)
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Session {self.id} - {self.user.username}"


class ExecutionStep(models.Model):
    session = models.ForeignKey(CodeSession, on_delete=models.CASCADE, related_name="steps")
    step_index = models.IntegerField()
    event = models.CharField(max_length=20)
    line_number = models.IntegerField()
    code_line = models.TextField()
    variables_json = models.JSONField()
    stack_depth = models.IntegerField()
    output_snapshot = models.TextField()
    math_visualization = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Step {self.step_index} (Line {self.line_number})"