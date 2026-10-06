import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/lib/store";

export function ProtectRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}