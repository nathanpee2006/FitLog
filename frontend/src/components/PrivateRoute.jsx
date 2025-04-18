import { Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Heading>Loading...</Heading>;
  }

  if (isAuthenticated) {
    return children;
  } else {
    navigate("/login");
  }
}
