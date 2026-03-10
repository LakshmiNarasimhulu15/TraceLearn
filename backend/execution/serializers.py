from rest_framework import serializers


class CodeExecutionRequestSerializer(serializers.Serializer):
    code = serializers.CharField()
    inputs = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=[]
    )


class ExecutionStepResponseSerializer(serializers.Serializer):
    step_index = serializers.IntegerField()
    thread = serializers.CharField()
    event = serializers.CharField()
    line_number = serializers.IntegerField()
    code_line = serializers.CharField()
    variables = serializers.DictField()
    stack_depth = serializers.IntegerField()
    output_snapshot = serializers.CharField(allow_blank=True)
    math_visualization = serializers.JSONField(required=False, allow_null=True)
    object_graph = serializers.JSONField(required=False, allow_null=True)


class CodeExecutionResponseSerializer(serializers.Serializer):
    session_id = serializers.IntegerField()
    steps = ExecutionStepResponseSerializer(many=True)
    final_output = serializers.CharField(allow_blank=True)
    explanation = serializers.CharField(allow_blank=True)
    error = serializers.JSONField(required=False, allow_null=True)
    threads = serializers.ListField(child=serializers.DictField(), required=False, default=[])
    has_threads = serializers.BooleanField(required=False, default=False)

