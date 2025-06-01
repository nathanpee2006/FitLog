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

  // FIXME:
  // When access token is expired, a 401 status code is received and the callRefresh function is ran
  // But before the access token is refreshed and state is updated, isAuthenticated may briefly be false or unset.
  // the page renders during this moment, but the data isn’t there (undefined), causing .map() to break or render nothing.
  if (isAuthenticated) {
    return children;
  } else if (!isAuthenticated && true) {
    return children;
  } else {
    navigate("/login");
  }
}
