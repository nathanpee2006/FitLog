import {
  Box,
  Heading,
  Tag,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getWorkoutDetail } from "../endpoints/api";

export default function WorkoutDetail() {
  const [exercises, setExercises] = useState([]);
  const { id } = useParams();

  const workoutExercises = exercises.map((exercise) => (
    <Box key={exercise.id} m="5">
      <Heading>{exercise.exercise.name}</Heading>
      <Tag>{exercise.exercise.muscle_group}</Tag>
      {exercise.exercise.equipment && <Tag>{exercise.exercise.equipment}</Tag>}
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
  ));

  useEffect(() => {
    const fetchWorkout = async () => {
      const exercises = await getWorkoutDetail(id);
      setExercises(exercises);
    };
    fetchWorkout();
  }, []);

  return workoutExercises;
}
