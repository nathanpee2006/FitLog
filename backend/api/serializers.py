from rest_framework import serializers
from django.contrib.auth.models import User
from django.db import transaction

from .models import Workout, Exercise, WorkoutExercise, Set


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User(username=validated_data["username"], email=validated_data["email"])
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ["id", "workout_type", "date"]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ["id", "name", "muscle_group", "equipment"]


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ["id", "set_number", "reps", "weight"]


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    workout = WorkoutSerializer(read_only=True)
    exercise = ExerciseSerializer(read_only=True)
    sets = SetSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = "__all__"


class WorkoutCreateSerializer(serializers.ModelSerializer):
    class WorkoutExerciseCreateSerializer(serializers.ModelSerializer):
        class SetCreateSerializer(serializers.ModelSerializer):
            class Meta:
                model = Set
                fields = (
                    "set_number",
                    "reps",
                    "weight",
                )

        sets = SetCreateSerializer(many=True)

        class Meta:
            model = WorkoutExercise
            fields = ["exercise", "sets"]

    exercises = WorkoutExerciseCreateSerializer(many=True)

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop("exercises")

        with transaction.atomic():
            instance.workout_type = validated_data.get(
                "workout_type", instance.workout_type
            )
            instance.date = validated_data.get("date", instance.date)
            instance.save()

            if exercises_data is not None:

                # Delete exercises and sets in specified workout instance
                instance.workoutexercise_set.all().delete()

                # Recreate workout details
                for exercise_data in exercises_data:
                    sets_data = exercise_data.pop("sets", [])
                    workout_exercise = WorkoutExercise.objects.create(
                        workout=instance, exercise=exercise_data["exercise"]
                    )

                    for set_data in sets_data:
                        Set.objects.create(
                            workout_exercise=workout_exercise, **set_data
                        )

            instance.exercises = instance.workoutexercise_set.all()
        return instance

    def create(self, validated_data):
        exercises_data = validated_data.pop("exercises")

        with transaction.atomic():

            # Create workout instance
            workout = Workout.objects.create(**validated_data)

            # Create workout exercises
            for exercise_data in exercises_data:
                sets_data = exercise_data.pop("sets", [])
                workout_exercise = WorkoutExercise.objects.create(
                    workout=workout, exercise=exercise_data["exercise"]
                )

                # Create workout sets
                for set_data in sets_data:
                    Set.objects.create(workout_exercise=workout_exercise, **set_data)

            workout.exercises = workout.workoutexercise_set.all()
        return workout

    class Meta:
        model = Workout
        fields = (
            "user",
            "workout_type",
            "date",
            "exercises",
        )
