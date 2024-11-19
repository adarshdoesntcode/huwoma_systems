import { selectCurrentUser } from "@/features/auth/authSlice";
import { ROLES_LIST } from "@/lib/config";

import { useSelector } from "react-redux";

export const useIsSuper = () => {
  const user = useSelector(selectCurrentUser);
  return user?.role.includes(ROLES_LIST.SUPERADMIN);
};
