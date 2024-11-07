import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Loader2 } from "lucide-react";

import AdminSideBar from "../../features/admin/AdminSideBar";
import AdminMobileSideBar from "../../features/admin/AdminMobileSideBar";
import useLogout from "@/hooks/useLogout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROLES_LIST } from "@/lib/config";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials, roleByCode } from "@/lib/utils";
import { useEffect, useState } from "react";

import { toast } from "@/hooks/use-toast";
import BreadCrumbGenerator from "../BreadCrumbGenerator";
import { Badge } from "../ui/badge";

function AdminLayout() {
  const [logoutLoader, setLogoutLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);

  const logout = useLogout();

  const handlelogout = async () => {
    try {
      setLogoutLoader(true);
      await logout();
      setLogoutLoader(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const crumbs = location.pathname.split("/").filter((crumb) => {
    if (crumb !== "" && crumb != ROLES_LIST.ADMIN) {
      return crumb;
    }
  });

  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <AdminSideBar />
        <div className="flex flex-col">
          <header className="flex sticky top-0 h-14 items-center gap-4 z-50 bg-slate-100/50 backdrop-filter backdrop-blur-lg px-4 lg:h-[60px] lg:px-6">
            <AdminMobileSideBar />
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden lg:block">
                  {user.fullname ? user.fullname : "Admin"}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden lg:block" />
                <BreadCrumbGenerator role={"admin"} crumbs={crumbs} />
              </BreadcrumbList>
            </Breadcrumb>

            <div className="relative ml-auto flex-1 md:grow-0">
              <div className="flex items-center justify-center sm:hidden">
                <img
                  src="/huwoma_logo.png"
                  className=" h-6 aspect-auto mx-auto"
                />
              </div>
              <div className="hidden sm:block">
                <Badge>{roleByCode(ROLES_LIST, user.role[0])}</Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photo} />
                  <AvatarFallback className="bg-slate-200">
                    {getInitials(user.fullname)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handlelogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col  p-4 pt-2 lg:px-6 bg-slate-50">
            <Outlet />
          </main>
        </div>
        <div
          className={`fixed inset-0 z-50 w-dvw  bg-muted-foreground/30 h-svh flex items-center justify-center ${
            logoutLoader ? "block" : "hidden"
          }`}
        >
          <div className="w-[200px] bg-white rounded-md shadow-lg px-4 py-6">
            <div className="flex justify-center items-center ">
              <Loader2 className="h-6 w-6 animate-spin mr-4" />
              <span className="text-sm whitespace-nowrap">Logging Out</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;
