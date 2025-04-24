import {
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  Stack,
  CardBody,
  CardFooter,
  CloseButton,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getWorkouts, deleteWorkout } from "../endpoints/api";

export default function Workouts() {
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

  function viewWorkoutDetail(workout_id) {
    navigate(`/workouts/${workout_id}`);
  }

  function handleCreateWorkout() {
    navigate("/workouts/create");
  }

  const workoutList = workouts.map((workout) => (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      key={workout.id}
    >
      <Stack>
        <CardBody>
          <HStack>
            <Heading size="md">{workout.workout_type}</Heading>
            <CloseButton
              onClick={() => {
                const deleteId = workout.id;
                deleteWorkout(deleteId);
                setWorkouts((prevWorkouts) =>
                  prevWorkouts.filter((workout) => workout.id !== deleteId)
                );
              }}
            />
          </HStack>
          <Text py="2">{workout.date}</Text>
        </CardBody>
        <CardFooter>
          <Button
            colorScheme="blue"
            onClick={() => viewWorkoutDetail(workout.id)}
          >
            Start Workout
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  ));

  return (
    <Container>
      <Button onClick={() => handleCreateWorkout()}>+ Create Workout</Button>
      <SimpleGrid spacing={4}>{workoutList}</SimpleGrid>
    </Container>
  );
}
