from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Workout, Exercise, WorkoutExercise, Set


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= ['username']


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise 
        fields = ['name', 'muscle_group', 'equipment'] 


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set 
        fields = ['set_number', 'reps', 'weight', 'duration']


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True) 
    sets = SetSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutExercise 
        exclude = ['workout'] 