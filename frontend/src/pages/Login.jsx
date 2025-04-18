import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  function handleLogin() {
    loginUser(username, password);
  }

  function handleNav() {
    navigate("/register");
  }

  return (
    <VStack>
      <FormControl>
        <FormLabel>Username</FormLabel>
        <Input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          type="text"
        />
        <FormLabel>Password</FormLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <Button onClick={handleLogin} colorScheme="blue">
          Login
        </Button>
        <Text onClick={handleNav}>No account? Sign up here.</Text>
      </FormControl>
    </VStack>
  );
}
