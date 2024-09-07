import {
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
  Megaphone,
  Origami,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { ROLES_LIST } from "@/lib/config";
import { isTabActive } from "@/lib/utils";
import CurrentClock from "../../components/CurrentClock";

function AdminSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const date = new Date();

  return (
    <div className="hidden  border-r /40 md:block">
      <div className="sticky top-0 flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <div className="flex items-center ">
            <img src="huwoma_logo.png" className="w-8/12 mb-1 mx-auto" />
          </div>
        </div>
        <div className="flex-1">
          <nav className="grid  text-slate-600 items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to={`/${ROLES_LIST.admin}/dashboard`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "dashboard")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              to={`/${ROLES_LIST.admin}/events`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "events")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4`}
            >
              <Droplets className="h-4 w-4" />
              Car Wash
              <div className="ml-auto flex shrink-0 items-center justify-center">
                3
              </div>
            </Link>
            <Link
              to={`/${ROLES_LIST.admin}/defense`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "defense")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4`}
            >
              <Car className="h-4 w-4" />
              Sim Racing
              <div className="ml-auto flex shrink-0 items-center justify-center">
                3
              </div>
            </Link>
            <Link
              to={`/${ROLES_LIST.admin}/projects`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "projects")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4`}
            >
              <CircleParking className="h-4 w-4" />
              Parking
              <div className="ml-auto flex shrink-0 items-center justify-center">
                26
              </div>
            </Link>
            <Link
              to={`/${ROLES_LIST.admin}/students`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "students")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4`}
            >
              <ChartLine className="h-4 w-4" />
              Analystics
              <div className="ml-auto flex shrink-0 items-center justify-center">
                1156
              </div>
            </Link>
            <Link
              to={`/supervisors`}
              className={`flex items-center gap-3 rounded-md  px-3 py-2.5 ${
                isTabActive(currentPath, "supervisors")
                  ? "bg-slate-950 text-white"
                  : "hover:text-slate-950"
              } text-primary transition-all hover:pl-4 `}
            >
              <Wrench className="h-4 w-4" />
              Configurations
              <div className="ml-auto flex shrink-0 items-center justify-center">
                26
              </div>
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
