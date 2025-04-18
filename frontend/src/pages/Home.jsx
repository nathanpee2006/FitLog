import { Heading, VStack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getWorkouts, logout } from "../endpoints/api";

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  console.log(workouts);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workouts = await getWorkouts();
      setWorkouts(workouts);
    };
    fetchWorkouts();
  }, []);

  const workoutList = workouts.map((workout) => (
    <li key={workout.id}>
      {workout.workout_type}, {workout.date}
    </li>
  ));

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <VStack>
      <Heading>Home</Heading>
      <VStack>
        <ul>{workoutList}</ul>
      </VStack>
      <Button colorScheme="red" onClick={handleLogout}>
        Logout
      </Button>
    </VStack>
  );
}
