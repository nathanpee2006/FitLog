from django.urls import path

from . import views

urlpatterns = [
    path(
        "api/token/",
        views.CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "api/token/refresh/",
        views.CustomTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("api/workouts/", views.workout_list),
    path("api/workouts/<int:workout_id>/", views.workout_detail),
    path("api/logout/", views.logout),
    path("api/authenticated/", views.is_authenticated),
    path("api/register/", views.register),
    path("api/exercises/", views.exercise_list),
]
