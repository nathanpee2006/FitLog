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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import ExerciseSetField from "../components/ExerciseSetField";

import { getWorkoutDetail, updateWorkout } from "../endpoints/api";

export default function WorkoutDetail() {
  const [isEditing, setIsEditing] = useState(false);
  const [exercises, setExercises] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(exercises);
  console.log(exercises?.[0]?.workout?.workout_type);

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
  const { register, handleSubmit, control, setValue } = form;

  const viewWorkoutExercises = (
    <>
      <Button
        onClick={() => {
          setValue("workout_type", exercises?.[0]?.workout?.workout_type);
          setValue("date", exercises?.[0]?.workout?.date);
          setIsEditing(true);
        }}
      >
        Edit
      </Button>
      {exercises.map((exercise) => (
        <Box key={exercise.id} m="5">
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
                  <Tr key={set.set_number}>
                    <Td>{set.set_number}</Td>
                    <Td>
                      {set.weight}kg x {set.reps}
                    </Td>
                    <Td isNumeric>{set.weight}</Td>
                    <Td isNumeric>{set.reps}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );

  const onSubmit = (data) => {
    const workoutId = id;
    const formattedExercisesArray = data.exercises.map((exercise, index) => {
      return {
        ...exercise,
        exercise: exercises[index].exercise.id,
        name: exercises[index].exercise.name,
      };
    });
    data.exercises = formattedExercisesArray;
    updateWorkout(workoutId, data);
    navigate("/workouts");
  };

  const editWorkoutExercises = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Save</Button>
      <Button onClick={() => setIsEditing(false)}>Cancel</Button>

      <FormControl>
        <Input
          className="create-workout-form-input"
          type="text"
          placeholder="Workout Type"
          {...register("workout_type")}
        />
      </FormControl>
      <FormControl>
        <Input
          className="create-workout-form-input"
          type="date"
          placeholder="Date"
          {...register("date")}
        />
      </FormControl>

      {exercises.map((exercise, index) => {
        return (
          <Box key={exercise.id}>
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
    fetchWorkout();
  }, []);

  return <>{isEditing ? editWorkoutExercises : viewWorkoutExercises}</>;
}
