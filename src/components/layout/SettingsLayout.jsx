import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useIsSuper } from "@/hooks/useSuper";

import { ROLES_LIST } from "@/lib/config";

import { useRole } from "@/hooks/useRole";

export function SettingsLayout() {
  const navigate = useNavigate();
  const isSuper = useIsSuper();
  const role = useRole();

  if (role !== ROLES_LIST.SUPERADMIN && role !== ROLES_LIST.ADMIN) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div>
      <main className="flex flex-col gap-4">
        <div className="text-xl font-semibold tracking-tight flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          Settings
        </div>
        <div className="mx-auto grid w-full max-w-3xl items-start gap-6 ">
          <nav className="flex gap-5 flex-wrap text-sm text-muted-foreground">
            <NavLink
              to={"/settings/general"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4  "
                  : " text-primary "
              }
            >
              General
            </NavLink>
            <NavLink
              to={"/settings/c-wash"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent "
                  : " text-primary border-b-2 border-transparent"
              }
            >
              CarWash
            </NavLink>
            <NavLink
              to={"/settings/s-racing"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                  : " text-primary border-b-2 border-transparent"
              }
            >
              SimRacing
            </NavLink>
            <NavLink
              to={"/settings/park"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                  : " text-primary border-b-2 border-transparent"
              }
            >
              Parking
            </NavLink>
            {isSuper && (
              <NavLink
                to={"/settings/admins"}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                    : " text-primary border-b-2 border-transparent"
                }
              >
                Admins
              </NavLink>
            )}
            <NavLink
              to={"/settings/payments"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                  : " text-primary border-b-2 border-transparent"
              }
            >
              Payments
            </NavLink>
            <NavLink
              to={"/settings/pos"}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                  : " text-primary border-b-2 border-transparent"
              }
            >
              POS
            </NavLink>
          </nav>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SettingsLayout;
