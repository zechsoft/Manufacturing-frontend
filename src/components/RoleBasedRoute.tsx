import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type Role = "user" | "admin" | "planning" | "production" | "quality" | "material" | "engineer";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // Handle unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle authenticated but missing user data (shouldn't happen, but type-safe)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle role-based access
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
