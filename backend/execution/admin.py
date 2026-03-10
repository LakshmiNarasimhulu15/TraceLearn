from django.contrib import admin
from session.models import CodeSession, ExecutionStep


class ExecutionStepInline(admin.TabularInline):
    model = ExecutionStep
    extra = 0


@admin.register(CodeSession)
class CodeSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "last_run_at")
    inlines = [ExecutionStepInline]


@admin.register(ExecutionStep)
class ExecutionStepAdmin(admin.ModelAdmin):
    list_display = (
        "session",
        "step_index",
        "line_number",
        "event",
    )