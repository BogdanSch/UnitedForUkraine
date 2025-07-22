import { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

interface IProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/notAuthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
