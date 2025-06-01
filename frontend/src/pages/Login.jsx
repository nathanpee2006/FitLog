import {
  Center,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { Link as ReactRouterLink } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();

  function handleLogin() {
    loginUser(username, password);
  }

  return (
    <Center marginBlock="250px">
      <VStack width="480px" spacing="5px">
        <Heading>Login</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
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
        <Button onClick={handleLogin} colorScheme="blue">
          Login
        </Button>
        <Text>
          No account?{" "}
          <ChakraLink color="blue.500" as={ReactRouterLink} to="/register">
            Sign up here.
          </ChakraLink>
        </Text>
      </VStack>
    </Center>
  );
}
