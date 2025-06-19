import { Spinner, VStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <VStack>
        <Spinner />
        <Text>Loading...</Text>
      </VStack>
    );
  }

  if (isAuthenticated) {
    return children;
  } else if (!isAuthenticated && !loading) {
    navigate("/login");
  }
}
