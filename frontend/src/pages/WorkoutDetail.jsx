import {
  Box,
  Heading,
  FormControl,
  Input,
  Tag,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Checkbox,
  Progress,
  ButtonGroup,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Stopwatch from "../components/Stopwatch";
import ExerciseSetField from "../components/ExerciseSetField";

import { getWorkoutDetail, updateWorkout } from "../endpoints/api";

export default function WorkoutDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [completedSets, setCompletedSets] = useState(new Set());
  const [progressValue, setProgressValue] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(0);
  const { id } = useParams();

  const setCount = exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );
  const progressIncrementPerSet = 100 / setCount;

  const form = useForm({
    defaultValues: {
      workout_type: "",
      date: "",
      exercises: [
        {
          exercise: "",
          name: "",
          sets: [{ set_number: "", weight: "", reps: "" }],
        },
      ],
    },
  });
  const { register, handleSubmit, control, setValue, getValues } = form;

  function start() {
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTime;
  }

  function stop() {
    setIsRunning(false);
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
  }

  function formatTime() {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  }

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, [isRunning]);

  const viewWorkoutExercises = (
    <>
      <Progress value={progressValue} />
      <Flex>
        <Button
          marginTop="2em"
          marginLeft="2em"
          backgroundColor="blue.500"
          color="white"
          onClick={() => {
            setValue("workout_type", exercises?.[0]?.workout?.workout_type);
            setValue("date", exercises?.[0]?.workout?.date);
            setIsEditing(true);
          }}
        >
          Edit
        </Button>
        <Spacer />
        <Stopwatch
          isRunning={isRunning}
          start={start}
          stop={stop}
          reset={reset}
          formatTime={formatTime}
          startTimeRef={startTimeRef}
          intervalIdRef={intervalIdRef}
        />
      </Flex>

      {exercises.map((exercise) => (
        <Box
          key={exercise.id}
          marginTop="1em"
          marginLeft="5em"
          marginRight="5em"
          marginBottom="2em"
        >
          <Heading>{exercise.exercise.name}</Heading>
          <Tag>{exercise.exercise.muscle_group}</Tag>
          {exercise.exercise.equipment && (
            <Tag>{exercise.exercise.equipment}</Tag>
          )}
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Set</Th>
                  <Th>Previous</Th>
                  <Th isNumeric>kg</Th>
                  <Th isNumeric>Reps</Th>
                </Tr>
              </Thead>
              <Tbody>
                {exercise.sets.map((set) => (
                  <Tr
                    key={set.id}
                    backgroundColor={
                      completedSets.has(set.id) ? "green.100" : ""
                    }
                  >
                    <Td>{set.set_number}</Td>
                    <Td>
                      {set.weight}kg x {set.reps}
                    </Td>
                    <Td isNumeric>{set.weight}</Td>
                    <Td isNumeric>{set.reps}</Td>
                    <Td width="1em">
                      <Checkbox
                        colorScheme="green"
                        isChecked={completedSets.has(set.id)}
                        onChange={(e) => {
                          setCompletedSets((prev) => {
                            const newSet = new Set(prev);
                            if (e.target.checked) {
                              newSet.add(set.id);
                            } else {
                              newSet.delete(set.id);
                            }
                            return newSet;
                          });
                          setProgressValue((prevProgressValue) =>
                            e.target.checked
                              ? prevProgressValue + progressIncrementPerSet
                              : prevProgressValue - progressIncrementPerSet
                          );
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );

  const onSubmit = async (data) => {
    const workoutId = id;
    const formattedExercisesArray = data.exercises.map((exercise, index) => {
      return {
        ...exercise,
        exercise: exercises[index].exercise.id,
        name: exercises[index].exercise.name,
      };
    });
    data.exercises = formattedExercisesArray;
    await updateWorkout(workoutId, data);
    setIsEditing(false);
  };

  const editWorkoutExercises = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ButtonGroup margin="2em" spacing="3">
        <Button backgroundColor="green.200" type="submit">
          Save
        </Button>
        <Button backgroundColor="red.200" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
      </ButtonGroup>

      <Box margin="2em 40em 2em 40em">
        <FormControl>
          <Input
            type="text"
            placeholder="Workout Type"
            {...register("workout_type")}
          />
        </FormControl>
        <FormControl>
          <Input type="date" placeholder="Date" {...register("date")} />
        </FormControl>
      </Box>

      {exercises.map((exercise, index) => {
        return (
          <Box
            key={exercise.id}
            marginTop="1em"
            marginLeft="5em"
            marginRight="5em"
            marginBottom="2em"
          >
            <Heading>{exercise.exercise.name}</Heading>
            <Tag>{exercise.exercise.muscle_group}</Tag>
            {exercise.exercise.equipment && (
              <Tag>{exercise.exercise.equipment}</Tag>
            )}
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Set</Th>
                    <Th>Previous</Th>
                    <Th isNumeric>kg</Th>
                    <Th isNumeric>Reps</Th>
                  </Tr>
                </Thead>
                <ExerciseSetField
                  control={control}
                  register={register}
                  index={index}
                  initialValues={exercise.sets}
                  getValues={getValues}
                />
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </form>
  );

  useEffect(() => {
    const fetchWorkout = async () => {
      const exercises = await getWorkoutDetail(id);
      setExercises(exercises);
    };
    if (!isEditing) {
      fetchWorkout();
    }
  }, [id, isEditing]);

  return <>{isEditing ? editWorkoutExercises : viewWorkoutExercises}</>;
}
