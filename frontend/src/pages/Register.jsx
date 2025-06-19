import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser } = useAuth();

  async function handleRegister(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(username, email, password, confirmPassword);
      console.log("Auth success");
    } catch {
      console.error("Auth failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <Heading>Register</Heading>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
          disabled={isLoading}
          backgroundColor="white"
        />
        <FormLabel>Email</FormLabel>
      </FormControl>
      <FormControl>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          disabled={isLoading}
          backgroundColor="white"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          disabled={isLoading}
          backgroundColor="white"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          disabled={isLoading}
          backgroundColor="white"
        />
      </FormControl>
      <Button onClick={handleRegister} colorScheme="blue">
        {isLoading && <Spinner />}
        {isLoading ? "Registering..." : "Register"}
      </Button>
      <Text>
        Already have an account?{" "}
        <ChakraLink color="blue.500" as={ReactRouterLink} to="/login">
          Login here.
        </ChakraLink>
      </Text>
    </form>
  );
}
