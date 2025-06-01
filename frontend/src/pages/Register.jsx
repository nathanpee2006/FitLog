import {
  Center,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { registerUser } = useAuth();

  function handleRegister() {
    registerUser(username, email, password, confirmPassword);
  }

  return (
    <Center marginBlock="250px">
      <VStack width="480px" spacing="5px">
        <Heading>Register</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
          />
          <FormLabel>Email</FormLabel>
        </FormControl>
        <FormControl>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type="password"
          />
        </FormControl>
        <Button onClick={handleRegister} colorScheme="blue">
          Register
        </Button>
        <Text>
          Already have an account?{" "}
          <ChakraLink color="blue.500" as={ReactRouterLink} to="/login">
            Login here.
          </ChakraLink>
        </Text>
      </VStack>
    </Center>
  );
}
