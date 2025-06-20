import {
  Container,
  Center,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getWorkouts, deleteWorkout } from "../endpoints/api";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const workoutList = workouts.map((workout) => (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      backgroundColor="gray.100"
      variant="outline"
      key={workout.id}
    >
      <Stack>
        <CardBody>
          <HStack>
            <Heading size="md">{workout.workout_type}</Heading>
            <Popover placement="left-end">
              <PopoverTrigger>
                <CloseButton marginLeft={"22.5em"} />
              </PopoverTrigger>
              <PopoverContent width="25em" height="10em">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontSize="1.25em" fontWeight="bold">
                  Confirmation!
                </PopoverHeader>
                <PopoverBody>
                  Are you sure you want to delete {workout.workout_type}?
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button
                      marginTop="0.75em"
                      marginRight={"0.75em"}
                      colorScheme="red"
                      onClick={() => {
                        const deleteId = workout.id;
                        deleteWorkout(deleteId);
                        setWorkouts((prevWorkouts) =>
                          prevWorkouts.filter(
                            (workout) => workout.id !== deleteId
                          )
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
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
      <Center>
        <Button marginBlock={5} onClick={() => handleCreateWorkout()}>
          + Create Workout
        </Button>
      </Center>
      <SimpleGrid spacing={5}>{workoutList}</SimpleGrid>
    </Container>
  );
}
