import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const jwtToken = useAuthStore((state) => state.jwtToken);

  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
