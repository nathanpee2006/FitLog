import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Workouts from "./pages/Workouts";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import AuthProvider from "./contexts/useAuth";
import Header from "./components/Header";
import WorkoutDetail from "./pages/WorkoutDetail";
import CreateWorkout from "./pages/CreateWorkout";
import FinishedWorkouts from "./pages/FinishedWorkouts";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/workouts"
            element={
              <PrivateRoute>
                <Workouts />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts/create"
            element={
              <PrivateRoute>
                <CreateWorkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/workouts/:id"
            element={
              <PrivateRoute>
                <WorkoutDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/finished-workouts"
            element={
              <PrivateRoute>
                <FinishedWorkouts />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
