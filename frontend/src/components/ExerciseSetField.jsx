import { useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { FormControl, Input, Tbody, Tr, Td, Button } from "@chakra-ui/react";

export default function ExerciseSetField({
  control,
  register,
  index,
  initialValues,
  getValues,
}) {
  const { fields, replace, append, remove } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });

  useEffect(() => {
    if (initialValues && initialValues.length > 0) {
      replace(initialValues);
    } else {
      replace([{ set_number: 1, weight: "", reps: "" }]);
    }
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
                  {...register(`exercises.${index}.sets.${setIndex}.weight`, {
                    required: true,
                  })}
                />
              </FormControl>
            </Td>
            <Td>
              <FormControl>
                <Input
                  type="number"
                  {...register(`exercises.${index}.sets.${setIndex}.reps`, {
                    required: true,
                  })}
                />
              </FormControl>
            </Td>
            <Td>
              <Button
                backgroundColor="red.200"
                type="button"
                onClick={() => remove(setIndex)}
              >
                Remove
              </Button>
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td>
            <Button
              type="button"
              onClick={() => {
                append({
                  set_number: fields.length + 1,
                  weight: getValues(`exercises.${index}.sets.0.weight`),
                  reps: getValues(`exercises.${index}.sets.0.reps`),
                });
              }}
            >
              + Add Set
            </Button>
          </Td>
        </Tr>
      </Tbody>
    </>
  );
}
