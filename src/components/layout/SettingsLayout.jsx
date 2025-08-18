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
        <div className="flex items-center gap-4 mb-4 text-xl font-semibold tracking-tight">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          Settings
        </div>
        <div className="grid items-start w-full max-w-3xl gap-6 mx-auto ">
          <nav className="flex flex-wrap gap-5 text-sm text-muted-foreground">
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
                to={"/settings/car-grag"}
                className={({ isActive }) =>
                  isActive
                    ? "font-bold text-primary underline underline-offset-4 border-b-2 border-transparent"
                    : " text-primary border-b-2 border-transparent"
                }
              >
                Garage
              </NavLink>
            )}

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
