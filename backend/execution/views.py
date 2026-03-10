from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializers import (
    CodeExecutionRequestSerializer,
    CodeExecutionResponseSerializer
)

from .services.execution_service import ExecutionService


class ExecuteCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CodeExecutionRequestSerializer(data=request.data)

        if not serializer.is_valid():
            print("[EXECUTION] Request validation failed:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data["code"]
        inputs = serializer.validated_data.get("inputs", [])

        print("\n========== TRACELEARN EXECUTION START ==========")
        print(f"[EXECUTION] User: {request.user}")
        print(f"[EXECUTION] Inputs: {inputs}")
        print("[EXECUTION] Code received:\n")
        print(code)
        print("================================================\n")

        try:
            result = ExecutionService.execute_code_service(
                user=request.user,
                code=code,
                inputs=inputs
            )

            print(f"[EXECUTION] Steps count: {len(result.get('steps', []))}")
            print(f"[EXECUTION] Final output: {result.get('final_output', '')!r}")
            print(f"[EXECUTION] Error: {result.get('error')}")
            print(f"[EXECUTION] Session ID: {result.get('session_id')}")
            print(f"[EXECUTION] Response keys: {result.keys()}")

            
            if result.get('error'):
                print("========== TRACELEARN EXECUTION SUCCESS (WITH ERROR) ==========\n")
                return Response(result)

            response = CodeExecutionResponseSerializer(data=result)
            if not response.is_valid():
                print(f"[EXECUTION] Serializer errors: {response.errors}")
                response.is_valid(raise_exception=True)

            print("========== TRACELEARN EXECUTION SUCCESS ==========\n")
            return Response(response.data)

        except Exception as e:
            print(f"[EXECUTION] Exception in ExecuteCodeView: {type(e).__name__}: {str(e)}")
            print("========== TRACELEARN EXECUTION FAILED ==========\n")

            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GetExplanationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        try:
            from session.models import CodeSession
            print(f"[EXPLANATION] Fetching explanation for session {session_id}")
            session = CodeSession.objects.get(id=session_id, user=request.user)
            session.refresh_from_db()  # Force refresh from database
            explanation = session.explanation or ""

            print(f"[EXPLANATION] Retrieved explanation for session {session_id}, length: {len(explanation)}")
            if explanation:
                print(f"[EXPLANATION] Explanation preview: {explanation[:200]}...")
            else:
                print(f"[EXPLANATION] Explanation is empty or None")

            return Response({"explanation": explanation})
        except CodeSession.DoesNotExist:
            print(f"[EXPLANATION] Session {session_id} not found for user {request.user}")
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

