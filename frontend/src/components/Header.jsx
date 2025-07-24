import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Header() {
  const { isAuthenticated, logoutUser } = useAuth();
  const bgColor = useColorModeValue("white", "gray.800");

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Box
      as="nav"
      bg={bgColor}
      boxShadow="sm"
      py={4}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg" color="blue.500">
            <RouterLink to={isAuthenticated ? "/workouts" : "/"}>
              FitLog
            </RouterLink>
          </Heading>
          <Flex gap={4} align="center">
            {isAuthenticated ? (
              <>
                <Button
                  as={RouterLink}
                  to="/workouts"
                  variant="ghost"
                  colorScheme="blue"
                >
                  Upcoming Workouts
                </Button>
                <Button
                  as={RouterLink}
                  to="/finished-workouts"
                  variant="ghost"
                  colorScheme="blue"
                >
                  Finished Workouts
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  colorScheme="blue"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  colorScheme="blue"
                >
                  Log In
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="blue">
                  Sign Up
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
