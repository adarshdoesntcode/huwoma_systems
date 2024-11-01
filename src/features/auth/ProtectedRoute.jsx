import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "./authSlice";
import { useEffect, useState } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";

import PersistLoader from "@/components/PersistLoader";
import { toast } from "@/hooks/use-toast";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
        toast({
          variant: "destructive",
          title: err.response.status === 401 ? "Token Expired" : "Unauthorized",
          description: err.message,
        });
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !user && !token ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, [isLoading, refresh, token, user]);

  return isLoading ? (
    <PersistLoader />
  ) : user?.role?.find(
      (role) => allowedRoles[0] === role || allowedRoles[1] === role
    ) ? (
    <Outlet />
  ) : token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to={"/login"} state={{ from: location }} replace />
  );
};
export default ProtectedRoute;
