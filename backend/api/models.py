from django.db import models
from django.contrib.auth.models import User


class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workouts")
    workout_type = models.CharField(max_length=100)
    date = models.DateField()


class Exercise(models.Model):

    MUSCLE_GROUP = [
        ("UPPER_CHEST", "Upper Chest"),
        ("MIDDLE_CHEST", "Middle Chest"),
        ("LOWER_CHEST", "Lower Chest"),
        ("UPPER_BACK", "Upper Back"),
        ("LOWER_BACK", "Lower Back"),
        ("FRONT_DELTOID", "Front Deltoid"),
        ("MIDDLE_DELTOID", "Middle Deltoid"),
        ("REAR_DELTOID", "Rear Deltoid"),
        ("BICEPS", "Biceps"),
        ("TRICEPS", "Triceps"),
        ("QUADRICEPS", "Quadriceps"),
        ("HAMSTRING", "Hamstring"),
        ("GLUTES", "Glutes"),
        ("CALVES", "Calves"),
        ("CORE", "Core"),
    ]

    EQUIPMENT_CHOICES = [
        ("", "None"),
        ("BODYWEIGHT", "Bodyweight"),
        ("DUMBBELL", "Dumbbell"),
        ("BARBELL", "Barbell"),
        ("KETTLEBELL", "Kettlebell"),
        ("BAND", "Resistance Band"),
        ("MACHINE", "Machine"),
        ("CABLE", "Cable"),
        ("BENCH", "Bench"),
        ("PULLUP_BAR", "Pull-up Bar"),
    ]

    name = models.CharField(max_length=32)
    muscle_group = models.CharField(max_length=16, choices=MUSCLE_GROUP)
    equipment = models.CharField(max_length=16, choices=EQUIPMENT_CHOICES, blank=True)


class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name="workout_exercises")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="exercise_instances")


class Set(models.Model):
    workout_exercise = models.ForeignKey(WorkoutExercise, on_delete=models.CASCADE, related_name="sets")
    set_number = models.PositiveIntegerField()
    reps = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    class Meta:
        unique_together = ("workout_exercise", "set_number")