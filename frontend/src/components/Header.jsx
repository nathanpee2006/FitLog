import { Heading, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function Header() {
  const { isAuthenticated, logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <HStack>
      <Heading>FitLog</Heading>
      {isAuthenticated ? (
        <>
          <Link to="/workouts">Workouts</Link>
          <Link onClick={handleLogout}>Logout</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </HStack>
  );
}
