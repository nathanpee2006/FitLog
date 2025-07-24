from django.contrib import admin

from .models import Workout, Exercise, WorkoutExercise, Set


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "workout_type", "date", "is_finished"]


class ExerciseAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "muscle_group", "equipment"]


class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ["id", "workout", "exercise"]


class SetAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "workout_exercise",
        "set_number",
        "reps",
        "weight",
        "duration",
    ]


admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutExercise, WorkoutExerciseAdmin)
admin.site.register(Set, SetAdmin)
