import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IMAGE_DATA, ROLES_LIST } from "@/lib/config";
import {
  Activity,
  CalendarDays,
  Car,
  Cctv,
  ChartLine,
  CircleParking,
  Droplets,
  FileCheck,
  FolderGit2,
  GraduationCap,
  Home,
  KeySquare,
  Megaphone,
  Menu,
  Origami,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { isTabActive } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

function AdminMobileSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = useRole();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium text-muted-foreground">
          {/* <div className="items-center hidden gap-2 text-base font-semibold lg:flex ">
            <img src={IMAGE_DATA.huwoma_logo} width={100} />
          </div> */}
          <div className="flex items-center gap-2 lg:hidden ">
            <img src={IMAGE_DATA.huwoma_logo} width={100} />
          </div>
          {role !== ROLES_LIST.STAFF && (
            <SheetClose asChild>
              <Link
                to={`/dashboard`}
                className={`mx-[-0.65rem] mt-4 flex items-center ${
                  isTabActive(currentPath, "dashboard")
                    ? "bg-foreground text-white"
                    : ""
                }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
              >
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
            </SheetClose>
          )}

          <SheetClose asChild>
            <Link
              to={`/carwash`}
              className={`mx-[-0.65rem]  flex items-center ${
                isTabActive(currentPath, "carwash")
                  ? "bg-foreground text-white"
                  : ""
              }  gap-4 rounded-xl px-3 py-2 ${
                role === ROLES_LIST.STAFF && "mt-4"
              } text-muted-foreground hover:text-foreground`}
            >
              <Droplets className="w-5 h-5" />
              Car Wash
              {/* <Badge
                variant="secondary"
                className="flex items-center justify-center ml-auto rounded-full shrink-0"
              >
                3
              </Badge> */}
            </Link>
          </SheetClose>
          {role !== ROLES_LIST.STAFF && (
            <SheetClose asChild>
              <Link
                to={`/simracing`}
                className={`mx-[-0.65rem]  flex items-center ${
                  isTabActive(currentPath, "simracing")
                    ? "bg-foreground text-white"
                    : ""
                }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
              >
                <Car className="w-5 h-5" />
                Sim Racing
                {/* <Badge
                  variant="secondary"
                  className="flex items-center justify-center ml-auto rounded-full shrink-0"
                >
                  3
                </Badge> */}
              </Link>
            </SheetClose>
          )}

          <SheetClose asChild>
            <Link
              to={`/parking`}
              className={`mx-[-0.65rem]  flex items-center ${
                isTabActive(currentPath, "parking")
                  ? "bg-foreground text-white"
                  : ""
              }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
            >
              <CircleParking className="w-5 h-5" />
              Parking
              {/* <Badge
                variant="secondary"
                className="flex items-center justify-center ml-auto rounded-full shrink-0"
              >
                6
              </Badge> */}
            </Link>
          </SheetClose>
          {/* <SheetClose asChild>
            <Link
              to={`/broadcast`}
              className={`mx-[-0.65rem]  flex items-center ${
                isTabActive(currentPath, "analytics")
                  ? "bg-foreground text-white"
                  : ""
              }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
            >
              <Megaphone className="w-5 h-5" />
              Broadcast

            </Link>
          </SheetClose> */}
          {role === ROLES_LIST.SUPERADMIN && (
            <SheetClose asChild>
              <Link
                to={`/garage`}
                className={`mx-[-0.65rem]  flex items-center ${
                  isTabActive(currentPath, "garage")
                    ? "bg-foreground text-white"
                    : ""
                }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
              >
                <KeySquare className="w-5 h-5" />
                Car Garage
                {/* <Badge
                  variant="secondary"
                  className="flex items-center justify-center ml-auto rounded-full shrink-0"
                >
                  2336
                </Badge> */}
              </Link>
            </SheetClose>
          )}
          {role !== ROLES_LIST.STAFF && (
            <SheetClose asChild>
              <Link
                to={`/activity`}
                className={`mx-[-0.65rem]  flex items-center ${
                  isTabActive(currentPath, "activity")
                    ? "bg-foreground text-white"
                    : ""
                }  gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground`}
              >
                <Activity className="w-5 h-5" />
                System Activity
                {/* <Badge
                  variant="secondary"
                  className="flex items-center justify-center ml-auto rounded-full shrink-0"
                >
                  2336
                </Badge> */}
              </Link>
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default AdminMobileSideBar;
