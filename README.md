# FitLog 

A web application to track workouts, exercises, and fitness progress.

## What problem did I solve?

Before when trying to do a workout, I used my own phone's notes app to record my progress such as weight and reps. However, I found it really tedious. When I wanted to change the weight or rep count of an exercise in multiple sets, I had to modify each line multiple times. It was very time-consuming and a bit annoying. That is why I decided to build FitLog, which was a fitness tracker for myself. 

## What design decisions did I make, and why?

<img width="1034" height="226" alt="image" src="https://github.com/user-attachments/assets/e47a8770-8133-4124-8ba3-082fe6a8db5b" />

Used a split frontend/backend architecture. The app is a React SPA backed by a Django REST API. This keeps UI and business logic separate.

Use HTTP-only JWT cookies instead of storing tokens in browser storage. Login and refresh set cookies server-side, and the client always sends requests with credentials. This reduces token exposure in the browser.

Kept computation on the server-side. Data is aggregated in the backend and only chart-ready data is sent to the frontend. That reduces client complexity and keeps business rules in one place.

Centralized auth state in a React context. useAuth.jsx owns login, logout, register, and session re-checking. This avoids duplicating auth logic across pages.

Protected routes with a wrapper component. PrivateRoute.jsx gates workout pages behind authentication. That keeps routing rules simple and explicit.

User → Workout: one-to-many - a user can have many workouts

Workout ↔ Exercise: many-to-many - one workout can include many exercises, and one exercise can appear in many workouts (because of this WorkoutExercise is a join/junction table holding FKs of Workout and Exercise)

WorkoutExercise → Set: one-to-many - One workout-exercise pairing can have many sets (set 1, set 2, set 3...)

## What broke, and how did I fix it?

- ***CORS***

The frontend was not able to communcate with backend because of CORS errors.

The fix was to add the domain of the frontend in the ALLOWED_HOSTS section in settings.py.

- ***JWT Auth Bug***

When the access token is expired, a 401 status code is received and the ***callRefresh()*** function is ran to retry the failed unauthorized request. But before the access token is refreshed and state is updated, ***isAuthenticated*** flag may briefly be false or unset. When the page renders during this moment - the data isn’t there (undefined), it causes .map() to break or render nothing.

It turned out that the ***authenticated()*** function was not throwing an error object, but only console logging the error. This meant that the ***getAuthenticated()*** function was not catching error and updating the ***isAuthenticated*** flag. Furthermore, the API requests from the frontend was not returning the value from the ***callRefresh()*** function whenever a retry request was made with new access token (*because I did not add the return statement*).

## What would I change?

In this project, I used Django Simple JWT library which is a authentication plugin for the Django REST framework.
I would have probably used a battle-tested managed auth provider like Clerk. It would have allowed me to spend less time on the security logic (JWT token handling, hashing) and focus on the features of app more. The reason why I went for the library was because  was trying to understand the internals of how JWT auth actually worked.

##  Tech Stack

### Frontend

- **Framework**: React.js

### Backend

- **Framework**: Django REST Framework
- **Database**: SQL
- **Authentication**: JWT (JSON Web Tokens)

### Features

- User authentication (Register/Login/Logout)
- Create and manage workouts
- View finished workouts 
- Track exercise progress through charts

## API Reference

Base path: `/api/`

Auth model: cookie-based JWT. The frontend sends requests with credentials included, and the backend reads JWTs from HTTP-only cookies.

### Authentication

| Method | Endpoint              |                    Auth | Purpose                                 |
| ------ | --------------------- | ----------------------: | --------------------------------------- |
| `POST` | `/api/token/`         |                      No | Log in and set auth cookies             |
| `POST` | `/api/token/refresh/` | Refresh cookie required | Refresh access token cookie             |
| `POST` | `/api/logout/`        |                     Yes | Clear auth cookies                      |
| `POST` | `/api/authenticated/` |                     Yes | Check whether the user is authenticated |
| `POST` | `/api/register/`      |                      No | Register a new user                     |

#### `POST /api/token/`

Logs in a user and sets access and refresh cookies.

Request body:

```json
{
  "username": "string",
  "password": "string"
}
```

Success response:

```json
{
  "success": true
}
```

#### `POST /api/token/refresh/`

Uses the refresh cookie to issue a new access token.

Success response:

```json
{
  "refreshed": true
}
```

#### `POST /api/logout/`

Clears auth cookies.

Success response:

```json
{
  "success": true
}
```

#### `POST /api/authenticated/`

Checks whether the current request is authenticated.

Success response:

```json
{
  "authenticated": true
}
```

#### `POST /api/register/`

Creates a new user.

Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Workouts

| Method   | Endpoint                      | Auth | Purpose                    |
| -------- | ----------------------------- | ---: | -------------------------- |
| `GET`    | `/api/workouts/`              |  Yes | List workouts              |
| `POST`   | `/api/workouts/`              |  Yes | Create a workout           |
| `GET`    | `/api/workouts/<workout_id>/` |  Yes | Get workout details        |
| `PUT`    | `/api/workouts/<workout_id>/` |  Yes | Update a workout           |
| `DELETE` | `/api/workouts/<workout_id>/` |  Yes | Delete a workout           |
| `PATCH`  | `/api/workouts/<workout_id>/` |  Yes | Mark a workout as finished |

### Exercises

| Method | Endpoint          | Auth | Purpose            |
| ------ | ----------------- | ---: | ------------------ |
| `GET`  | `/api/exercises/` |  Yes | List all exercises |

### Statistics

| Method | Endpoint                   | Auth | Purpose                       |
| ------ | -------------------------- | ---: | ----------------------------- |
| `GET`  | `/api/workout_statistics/` |  Yes | Return monthly workout volume |
