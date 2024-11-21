import {
  Car,
  ChartLine,
  CircleParking,
  Droplets,
  Home,
  Megaphone,
  Mic,
  Wrench,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { isTabActive } from "@/lib/utils";
import CurrentClock from "../../components/CurrentClock";
import { IMAGE_DATA } from "@/lib/config";

function AdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const date = new Date();

  return (
    <div
      className="hidden  border-r  bg-center bg-fixed md:block"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center justify-center w-full">
            <img src={IMAGE_DATA.huwoma_logo} className="h-7" />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid  text-muted items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to={`/dashboard`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "dashboard")
                  ? "bg-foreground text-white"
                  : "hover:text-primary"
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to={`/carwash`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "carwash")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Droplets className="h-4 w-4" />
              Car Wash
              {/* <div className="ml-auto flex shrink-0 items-center justify-center">
                3
              </div> */}
            </Link>
            <Link
              to={`/simracing`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "simracing")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Car className="h-4 w-4" />
              Sim Racing
              {/* <div className="ml-auto flex shrink-0 items-center justify-center">
                3
              </div> */}
            </Link>
            <Link
              to={`/parking`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "parking")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <CircleParking className="h-4 w-4" />
              Parking
              {/* <div className="ml-auto flex shrink-0 items-center justify-center">
                26
              </div> */}
            </Link>
            <Link
              to={`/broadcast`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "analytics")
                  ? "bg-foreground text-white"
                  : "hover:text-primary "
              } text-muted-foreground transition-all hover:pl-4`}
            >
              <Megaphone className="h-4 w-4" />
              Broadcast
              {/* <div className="ml-auto flex shrink-0 items-center justify-center">
                1156
              </div> */}
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-4 ">
          <CurrentClock date={date} />
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;
