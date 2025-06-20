import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Select } from "chakra-react-select";

import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  ButtonGroup,
  Table,
  Thead,
  Tr,
  Th,
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
  const { register, handleSubmit, control, watch, getValues } = form;

  const exercisesSelected = watch("exercises");

  // index represents exercises selected by the user (e.g. if Bicep Curls was first selected by the user, then it is at index 0...)
  const exerciseData = exercisesSelected.map((exercise, index) => {
    return (
      <Box
        key={exercise.label}
        marginTop="1em"
        marginLeft="5em"
        marginRight="5em"
        marginBottom="2em"
      >
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
              getValues={getValues}
            />
          </Table>
        </TableContainer>
      </Box>
    );
  });

  const onSubmit = async (data) => {
    const formattedExercisesArray = data.exercises.map(
      ({ label: name, value: exercise, ...rest }) => ({
        exercise,
        name,
        ...rest,
      })
    );
    data.exercises = formattedExercisesArray;
    await createWorkoutDetail(data);
    navigate("/workouts", { state: { workoutCreated: true } });
  };

  useEffect(() => {
    const fetchExercises = async () => {
      const exercises = await getExercises();
      const exerciseOptions = exercises.map((exercise) => ({
        label: exercise.name,
        value: exercise.id,
      }));
      setExerciseOptions(exerciseOptions);
    };
    fetchExercises();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box margin="2em 40em 2em 40em">
        {currentStep === 0 && (
          <>
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
              <Button onClick={back}>Back</Button>
              <Button onClick={next}>Next</Button>
            </ButtonGroup>
          </>
        )}
      </Box>
      {currentStep === 2 && (
        <>
          {exerciseData}
          <ButtonGroup margin="2em" spacing="3">
            <Button onClick={back}>Back</Button>
            <Button type="submit">Create</Button>
          </ButtonGroup>
        </>
      )}
    </form>
  );
}
