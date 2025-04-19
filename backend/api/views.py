from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Workout, Exercise, WorkoutExercise, Set
from .serializers import UserRegistrationSerializer, WorkoutSerializer, ExerciseSerializer, WorkoutExerciseSerializer, SetSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()

            res.data = {'success': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except:
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)

            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            return res

        except: 
            return Response({'refreshed': False}, status=status.HTTP_401_UNAUTHORIZED) 


@api_view(['POST'])
def logout(request):
    
    # Log user out and clear cookies
    if request.method == 'POST':
        try:
            res = Response()
            res.data = {'success': True}
            res.delete_cookie('access_token', path='/', samesite='None')
            res.delete_cookie('refresh_token', path='/', samesite='None')
            return res
        except:
            return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):

    # Check if user is authenticated 
    if request.method == 'POST':
        return Response({'authenticated': True})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    # Register a new user
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def workout_list(request):

    # List workouts
    if request.method == 'GET':
        workouts = Workout.objects.filter(user_id=request.user.id)
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def workout_detail(request, workout_id):
    
    # Get workout details, including exercises, sets, reps and weight        
    if request.method == 'GET':
        workout_details = WorkoutExercise.objects.prefetch_related("sets").filter(workout_id=workout_id)
        serializer = WorkoutExerciseSerializer(workout_details, many=True)
        print(serializer.data)
        return Response(serializer.data)

