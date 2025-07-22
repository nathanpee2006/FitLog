import {
  Alert,
  AlertIcon,
  AlertTitle,
  Container,
  Center,
  CloseButton,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  Stack,
  CardBody,
  CardFooter,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DeleteWorkoutButton from "../components/DeleteWorkoutButton";

import { getWorkouts, deleteWorkout } from "../endpoints/api";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workouts = await getWorkouts();
      setWorkouts(workouts);
    };
    fetchWorkouts();
  }, [location]);

  function viewWorkoutDetail(workout_id) {
    navigate(`/workouts/${workout_id}`);
  }

  function handleCreateWorkout() {
    navigate("/workouts/create");
  }

  async function handleDeleteWorkout(workout_id) {
    await deleteWorkout(workout_id);
    setWorkouts((prevWorkouts) =>
      prevWorkouts.filter((workout) => workout.id !== workout_id)
    );
    onOpen();
  }

  const workoutList = workouts.map((workout) => (
    <Card backgroundColor="gray.100" variant="outline" key={workout.id}>
      <Stack>
        <CardBody>
          <HStack
            justify="space-between"
            width="100%"
            spacing="4"
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
          >
            <Heading size="md">{workout.workout_type}</Heading>
            <DeleteWorkoutButton
              workoutType={workout.workout_type}
              handleDelete={() => handleDeleteWorkout(workout.id)}
            />
          </HStack>
          <Text py="2">Scheduled at: {workout.date}</Text>
        </CardBody>
        <CardFooter>
          <Button
            colorScheme="blue"
            onClick={() => viewWorkoutDetail(workout.id)}
          >
            View Workout
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  ));

  return (
    <Container>
      {location.state?.workoutCreated && (
        <Alert status="success" justifyContent="space-between">
          <AlertIcon />
          <AlertTitle>Workout created!</AlertTitle>
          <CloseButton
            onClick={() => {
              navigate("/workouts", { state: null });
            }}
          />
        </Alert>
      )}
      {isOpen && (
        <Alert status="error" justifyContent="space-between">
          <AlertIcon />
          <AlertTitle>Workout deleted!</AlertTitle>
          <CloseButton onClick={onClose} />
        </Alert>
      )}
      <Center>
        <Button marginBlock={5} onClick={() => handleCreateWorkout()}>
          + Create Workout
        </Button>
      </Center>

      <SimpleGrid spacing={5}>{workoutList}</SimpleGrid>
    </Container>
  );
}
