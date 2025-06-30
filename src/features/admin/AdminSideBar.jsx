import {
  Activity,
  ArrowLeftRight,
  Car,
  CircleParking,
  Droplets,
  Home,
  KeySquare,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { isTabActive } from "@/lib/utils";
import CurrentClock from "../../components/CurrentClock";
import { IMAGE_DATA, ROLES_LIST } from "@/lib/config";
import { useRole } from "@/hooks/useRole";

function AdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const date = new Date();
  const role = useRole();

  return (
    <div
      className="hidden bg-fixed bg-center border-r md:block"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <div className="sticky top-0 flex flex-col h-full max-h-screen gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center justify-center w-full">
            <img src={IMAGE_DATA.huwoma_logo} loading="lazy" className="h-7" />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium text-muted lg:px-4">
            {role !== ROLES_LIST.STAFF && (
              <Link
                to={`/dashboard`}
                className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                  isTabActive(currentPath, "dashboard")
                    ? "bg-foreground text-white"
                    : "hover:text-primary"
                } text-muted-foreground transition-all hover:pl-4`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            <Link
              to={`/carwash`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "carwash")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Droplets className="w-4 h-4" />
              Car Wash
              {/* <div className="flex items-center justify-center ml-auto shrink-0">
                3
              </div> */}
            </Link>
            {role !== ROLES_LIST.STAFF && (
              <Link
                to={`/simracing`}
                className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                  isTabActive(currentPath, "simracing")
                    ? "bg-foreground text-white"
                    : "hover:text-primary "
                } text-muted-foreground transition-all hover:pl-4`}
              >
                <Car className="w-4 h-4" />
                Sim Racing
                {/* <div className="flex items-center justify-center ml-auto shrink-0">
   3
 </div> */}
              </Link>
            )}

            <Link
              to={`/parking`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "parking")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <CircleParking className="w-4 h-4" />
              Parking
              {/* <div className="flex items-center justify-center ml-auto shrink-0">
                26
              </div> */}
            </Link>
            {/* <Link
              to={`/broadcast`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "analytics")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Megaphone className="w-4 h-4" />
              Broadcast

            </Link> */}
            {role === ROLES_LIST.SUPERADMIN && (
              <Link
                to={`/garage`}
                className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                  isTabActive(currentPath, "garage")
                    ? "bg-foreground text-white"
                    : "hover:text-primary "
                } text-muted-foreground transition-all hover:pl-4`}
              >
                <KeySquare className="w-4 h-4" />
                Car Garage
                {/* <div className="flex items-center justify-center ml-auto shrink-0">
                26
              </div> */}
              </Link>
            )}

            {role !== ROLES_LIST.STAFF && (
              <Link
                to={`/activity`}
                className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                  isTabActive(currentPath, "activity")
                    ? "bg-foreground text-white"
                    : "hover:text-primary "
                } text-muted-foreground transition-all hover:pl-4`}
              >
                <Activity className="w-4 h-4" />
                System Activity
                {/* <div className="flex items-center justify-center ml-auto shrink-0">
                            1156
                          </div> */}
              </Link>
            )}
          </nav>
        </div>

        <div className="p-4 mt-auto ">
          <CurrentClock date={date} />
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;
