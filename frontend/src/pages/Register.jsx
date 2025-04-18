import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  function handleRegister() {
    registerUser(username, email, password, confirmPassword);
  }

  function handleNav() {
    navigate("/login");
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
        <FormLabel>Email</FormLabel>
        <Input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        <FormLabel>Password</FormLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <FormLabel>Password</FormLabel>
        <Input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
        />
        <Button onClick={handleRegister} colorScheme="blue">
          Register
        </Button>
        <Text onClick={handleNav}>Already have an account? Login here.</Text>
      </FormControl>
    </VStack>
  );
}
