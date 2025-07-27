import { useState, useEffect } from "react";
import { getWorkouts } from "../endpoints/api";
import {
  Container,
  SimpleGrid,
  Card,
  Stack,
  CardBody,
  CardFooter,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function FinishedWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  function viewWorkoutDetail(workout_id) {
    navigate(`/workouts/${workout_id}`);
  }

  const workoutList = workouts.map((workout) => (
    <Card backgroundColor="green.100" variant="outline" key={workout.id}>
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
            <Alert width="1.75em" padding="0" status="success">
              <AlertIcon />
            </Alert>
          </HStack>
          <Text py="2">Scheduled at: {workout.date}</Text>
        </CardBody>
        <CardFooter>
          <Button
            colorScheme="blue"
            onClick={() => viewWorkoutDetail(workout.id)}
          >
            View
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  ));

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workouts = await getWorkouts({ is_finished: true });
      setWorkouts(workouts);
    };
    fetchWorkouts();
  }, []);

  return (
    <Container>
      <SimpleGrid marginBlock={20} spacing={5}>
        {workoutList}
      </SimpleGrid>
    </Container>
  );
}
