import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import Header from "../components/Header";

export default function Landing() {
  const bgColor = useColorModeValue("white", "gray.800");
  const buttonHover = "blue.600";

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Hero Section */}
      <Container maxW="container.lg" py={20}>
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={12}>
          <VStack align="start" spacing={6} flex={1}>
            <Heading as="h1" size="2xl" lineHeight="1.2">
              Track Your Fitness Journey with{" "}
              <Text as="span" color="blue.500">
                FitLog
              </Text>
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Effortlessly log your workouts, monitor your progress, and achieve
              your fitness goals with our intuitive tracking platform.
            </Text>
            <Flex gap={4} mt={4}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="blue"
                _hover={{ bg: buttonHover }}
              >
                Get Started for Free
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                variant="outline"
                colorScheme="blue"
              >
                Try Demo
              </Button>
            </Flex>
          </VStack>
          <Box flex={1} display={{ base: "none", md: "block" }}>
            <Box
              bgGradient="linear(to-r, blue.50, blue.100)"
              h="400px"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={8}
            >
              <Text fontSize="xl" color="blue.600" fontWeight="medium">
                Workout Dashboard Preview
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* Features Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="container.lg">
          <VStack spacing={16}>
            <VStack textAlign="center" spacing={4} maxW="2xl" mx="auto">
              <Text color="blue.500" fontWeight="semibold">
                WHY CHOOSE FITLOG
              </Text>
              <Heading as="h2" size="xl">
                Everything You Need to Succeed
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Our platform is designed to help you stay consistent and
                motivated on your fitness journey.
              </Text>
            </VStack>

            <Flex direction={{ base: "column", md: "row" }} gap={8} w="full">
              {[
                {
                  title: "Track Workouts",
                  description:
                    "Log your exercises, sets, reps, and weights with ease.",
                },
                {
                  title: "Monitor Progress",
                  description:
                    "Visualize your improvement with detailed statistics and charts.",
                },
                {
                  title: "Stay Motivated",
                  description:
                    "Set goals and celebrate your achievements along the way.",
                },
              ].map((feature, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  flex={1}
                  _hover={{
                    transform: "translateY(-4px)",
                    transition: "all 0.2s",
                  }}
                >
                  <VStack align="start" spacing={4}>
                    <Box
                      w="12"
                      h="12"
                      bg="blue.50"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xl" color="blue.500">
                        {index + 1}
                      </Text>
                    </Box>
                    <Heading as="h3" size="md">
                      {feature.title}
                    </Heading>
                    <Text color="gray.600">{feature.description}</Text>
                  </VStack>
                </Box>
              ))}
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bgGradient="linear(to-r, blue.500, blue.600)">
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center" color="white">
            <Heading as="h2" size="xl">
              Ready to Transform Your Fitness Journey?
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Join thousands of users who are already achieving their fitness
              goals with FitLog.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="whiteAlpha"
              _hover={{ bg: "whiteAlpha.300" }}
              px={8}
              py={6}
              fontSize="lg"
            >
              Start Your Free Account
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="gray.800" color="white" py={8}>
        <Container maxW="container.lg">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
          >
            <Text>
              &copy; {new Date().getFullYear()} FitLog. All rights reserved.
            </Text>
            <Flex gap={6} mt={{ base: 4, md: 0 }}>
              <Text as="a" href="#" _hover={{ color: "blue.300" }}>
                Terms
              </Text>
              <Text as="a" href="#" _hover={{ color: "blue.300" }}>
                Privacy
              </Text>
              <Text as="a" href="#" _hover={{ color: "blue.300" }}>
                Contact
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
