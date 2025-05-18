import { selectCurrentUser } from "@/features/auth/authSlice";

import { useSelector } from "react-redux";

export const useRole = () => {
  const user = useSelector(selectCurrentUser);
  return user?.role[0];
};
