import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Select } from "chakra-react-select";

import {
  Box,
  Heading,
  Tag,
  FormControl,
  Input,
  Button,
  ButtonGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  FormLabel,
} from "@chakra-ui/react";

import { getExercises, createWorkoutDetail } from "../endpoints/api";
import ExerciseSetField from "../components/ExerciseSetField";

export default function CreateWorkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const navigate = useNavigate();

  function next() {
    setCurrentStep((prevStep) => prevStep + 1);
  }

  function back() {
    setCurrentStep((prevStep) => prevStep - 1);
  }

  const form = useForm({
    defaultValues: {
      workout_type: "",
      date: "",
      exercises: [
        { name: "", sets: [{ set_number: "", weight: "", reps: "" }] },
      ],
    },
  });
  const { register, handleSubmit, control, watch } = form;

  const exercisesSelected = watch("exercises");
  console.log(exercisesSelected);

  const exerciseData = exercisesSelected.map((exercise, index) => {
    return (
      <Box key={exercise.label}>
        <Heading>{exercise.label}</Heading>
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
            />
          </Table>
        </TableContainer>
      </Box>
    );
  });

  const onSubmit = (data) => {
    const formattedExercisesArray = data.exercises.map(
      ({ label: name, value: exercise, ...rest }) => ({
        exercise,
        name,
        ...rest,
      })
    );
    data.exercises = formattedExercisesArray;
    console.log(data);
    createWorkoutDetail(data);
    navigate("/workouts");
    console.log("Form submitted!");
  };

  useEffect(() => {
    const fetchExercises = async () => {
      const exercises = await getExercises();
      console.log(exercises);
      const exerciseOptions = exercises.map((exercise) => ({
        label: exercise.name,
        value: exercise.id,
      }));
      setExerciseOptions(exerciseOptions);
    };
    fetchExercises();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="create-workout-form">
      {currentStep === 0 && (
        <>
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
          <Button onClick={next}>Next</Button>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Controller
            control={control}
            name="exercises"
            render={({ field }) => (
              <FormControl>
                <FormLabel>Exercises</FormLabel>

                <Select
                  className="create-workout-form-input"
                  isMulti
                  {...field}
                  placeholder="Select exercises"
                  options={exerciseOptions}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  selectedOptionColorScheme="blue"
                />
              </FormControl>
            )}
          />
          <ButtonGroup>
            <Button onClick={next}>Next</Button>
            <Button onClick={back}>Back</Button>
          </ButtonGroup>
        </>
      )}
      {currentStep === 2 && (
        <>
          {exerciseData}
          <Button type="submit">Create</Button>
          <Button onClick={back}>Back</Button>
        </>
      )}
    </form>
  );
}
