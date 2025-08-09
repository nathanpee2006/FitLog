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
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  FormErrorMessage,
  Progress,
  VStack,
  HStack,
  Text,
  useBreakpointValue,
  Container,
  Flex,
} from "@chakra-ui/react";
import { getExercises, createWorkoutDetail } from "../endpoints/api";
import ExerciseSetField from "../components/ExerciseSetField";

export default function CreateWorkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const totalSteps = 3;

  const form = useForm({
    defaultValues: {
      workout_type: "",
      date: "",
      exercises: [],
    },
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState,
    trigger,
  } = form;
  const { errors } = formState;

  const steps = [
    { title: "Workout Details", description: "Basic information" },
    { title: "Select Exercises", description: "Choose your exercises" },
    { title: "Enter Sets", description: "Add your sets and reps" },
  ];

  async function next() {
    const isValid = await trigger();
    // if none of the fields are empty on the current step, then proceed to the next step
    if (isValid) setCurrentStep((prevStep) => prevStep + 1);
  }

  function back() {
    setCurrentStep((prevStep) => prevStep - 1);
  }
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
              errors={errors}
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
    <Container maxW="container.lg" py={8} px={4}>
      <VStack spacing={8} w="100%">
        <Box w="100%">
          <Progress
            value={((currentStep + 1) / totalSteps) * 100}
            size="sm"
            colorScheme="blue"
            mb={4}
            borderRadius="full"
          />
          <HStack
            justify="space-between"
            textAlign="center"
            fontSize={{ base: "sm", md: "md" }}
            mb={8}
          >
            {steps.map((step, index) => (
              <Box
                key={index}
                flex={1}
                color={currentStep >= index ? "blue.500" : "gray.400"}
                fontWeight={currentStep === index ? "bold" : "normal"}
              >
                <Text fontSize="xs" mb={1}>
                  Step {index + 1}
                </Text>
                <Text>{step.title}</Text>
              </Box>
            ))}
          </HStack>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          w="100%"
          maxW="container.md"
          mx="auto"
        >
          {currentStep === 0 && (
            <VStack spacing={6} w="100%">
              <Heading size="lg" mb={4}>
                Workout Details
              </Heading>
              <FormControl isInvalid={errors.workout_type?.message}>
                <Input
                  type="text"
                  placeholder="Workout Name"
                  size="lg"
                  {...register("workout_type", {
                    required: "Workout Name is required!",
                  })}
                />
                <FormErrorMessage>
                  {errors.workout_type?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.date?.message}>
                <Input
                  type="date"
                  placeholder="Date"
                  size="lg"
                  {...register("date", { required: "Date is required!" })}
                />
                <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          )}

          {currentStep === 1 && (
            <VStack spacing={6} w="100%">
              <Heading size="lg" mb={4}>
                Select Exercises
              </Heading>
              <Controller
                control={control}
                name="exercises"
                rules={{ required: "Please select at least one exercise." }}
                render={({ field }) => (
                  <FormControl isInvalid={errors.exercises?.message} w="100%">
                    <Select
                      isMulti
                      {...field}
                      placeholder="Search and select exercises"
                      options={exerciseOptions}
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      selectedOptionColorScheme="blue"
                      size="lg"
                    />
                    <FormErrorMessage>
                      {errors.exercises?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
            </VStack>
          )}

          {currentStep === 2 && (
            <VStack spacing={6} w="100%">
              <Heading size="lg" mb={4}>
                Enter Your Sets
              </Heading>
              {exerciseData}
            </VStack>
          )}

          <Flex
            mt={12}
            justifyContent={currentStep === 0 ? "flex-end" : "space-between"}
            w="100%"
          >
            {currentStep > 0 && (
              <Button
                onClick={back}
                variant="outline"
                size={isMobile ? "md" : "lg"}
              >
                Back
              </Button>
            )}
            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={next}
                colorScheme="blue"
                ml={currentStep === 0 ? "auto" : 0}
                size={isMobile ? "md" : "lg"}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                colorScheme="green"
                size={isMobile ? "md" : "lg"}
              >
                Create Workout
              </Button>
            )}
          </Flex>
        </Box>
      </VStack>
    </Container>
  );
}
