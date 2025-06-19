import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Link as ChakraLink,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { Link as ReactRouterLink } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();

  async function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(username, password);
      console.log("Auth success");
    } catch {
      console.error("Auth failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <Heading>Login</Heading>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
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
      <Button type="submit" colorScheme="blue">
        {isLoading && <Spinner />}
        {isLoading ? "Loggin in..." : "Login"}
      </Button>
      <Text>
        No account?{" "}
        <ChakraLink color="blue.500" as={ReactRouterLink} to="/register">
          Sign up here.
        </ChakraLink>
      </Text>
    </form>
  );
}
