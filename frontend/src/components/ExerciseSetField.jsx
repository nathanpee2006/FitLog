import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { FormControl, Input, Tbody, Tr, Td, Button } from "@chakra-ui/react";

export default function ExerciseSetField({ control, register, index }) {
  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });

  useEffect(() => {
    replace([{ set_number: "", weight: "", reps: "" }]);
  }, []);

  return (
    <>
      <Tbody>
        {fields.map((field, setIndex) => (
          <Tr key={field.id}>
            <Td>
              <FormControl>
                <Input
                  type="number"
                  {...register(
                    `exercises.${index}.sets.${setIndex}.set_number`
                  )}
                />
              </FormControl>
            </Td>
            <Td>None</Td>
            <Td>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`exercises.${index}.sets.${setIndex}.weight`)}
                />
              </FormControl>
            </Td>
            <Td>
              <FormControl>
                <Input
                  type="number"
                  {...register(`exercises.${index}.sets.${setIndex}.reps`)}
                />
              </FormControl>
            </Td>
            <Td>
              <Button type="button" onClick={() => remove(setIndex)}>
                Remove
              </Button>
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td>
            <Button
              type="button"
              onClick={() => append({ set_number: "", weight: "", reps: "" })}
            >
              + Add Set
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </>
  );
}
