import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { FiLogOut, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";

export default function Header() {
  const { isAuthenticated, logoutUser } = useAuth();
  const location = useLocation();
  const activeBg = "blue.50";
  const activeColor = "blue.600";

  const handleLogout = async () => {
    await logoutUser();
  };

  const NavButton = ({ to, icon, label, exact = false }) => {
    const isActive = exact
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <Tooltip label={label} placement="bottom">
        <Button
          as={RouterLink}
          to={to}
          variant="ghost"
          size="sm"
          px={3}
          h={8}
          color={isActive ? activeColor : "currentColor"}
          bg={isActive ? activeBg : "transparent"}
          _hover={{
            bg: isActive ? activeBg : "gray.100",
          }}
          leftIcon={icon}
          justifyContent="flex-start"
          fontWeight="medium"
        >
          {label}
        </Button>
      </Tooltip>
    );
  };

  return (
    <Box
      as="nav"
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      py={2}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl" px={4}>
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={6}>
            <Heading
              as="h1"
              size="md"
              color="blue.500"
              fontWeight="bold"
              letterSpacing="-0.5px"
              mr={6}
            >
              <RouterLink to={isAuthenticated ? "/workouts" : "/"}>
                FitLog
              </RouterLink>
            </Heading>

            {isAuthenticated && (
              <Flex gap={1}>
                <NavButton
                  to="/workouts"
                  icon={<FiCalendar size={16} />}
                  label="Upcoming"
                  exact
                />
                <NavButton
                  to="/finished-workouts"
                  icon={<FiCheckCircle size={16} />}
                  label="Completed"
                  exact
                />
                <NavButton
                  to="/statistics"
                  icon={<BsGraphUp size={16} />}
                  label="Statistics"
                  exact
                />
              </Flex>
            )}
          </Flex>

          <Flex align="center" gap={2}>
            {isAuthenticated ? (
              <Tooltip label="Logout">
                <IconButton
                  aria-label="Logout"
                  icon={<FiLogOut />}
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  fontSize="lg"
                  isRound
                />
              </Tooltip>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  size="sm"
                  colorScheme="blue"
                >
                  Log In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                  size="sm"
                  variant="solid"
                >
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
