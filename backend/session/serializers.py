from rest_framework import serializers
from .models import CodeSession, ExecutionStep


class ExecutionStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExecutionStep
        fields = [
            "step_index",
            "event",
            "line_number",
            "code_line",
            "variables_json",
            "stack_depth",
            "output_snapshot",
            "math_visualization",
        ]


class CodeSessionSerializer(serializers.ModelSerializer):
    steps = ExecutionStepSerializer(many=True, read_only=True)

    class Meta:
        model = CodeSession
        fields = [
            "id",
            "code",
            "created_at",
            "last_run_at",
            "steps",
        ]


class CodeSessionSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeSession
        fields = [
            "id",
            "code",
            "created_at",
            "last_run_at",
        ]