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

import { Input } from "@/components/ui/input";

import { Loader2, Search } from "lucide-react";

import AdminSideBar from "../../features/admin/AdminSideBar";
import AdminMobileSideBar from "../../features/admin/AdminMobileSideBar";
import useLogout from "@/hooks/useLogout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROLES_LIST } from "@/lib/config";
// import BreadCrumbGenerator from "../BreadCrumbGenerator";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import { toast } from "@/hooks/use-toast";
import BreadCrumbGenerator from "../BreadCrumbGenerator";

function AdminLayout() {
  const [logoutLoader, setLogoutLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();

  const user = useSelector(selectCurrentUser);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [location]);

  const crumbs = location.pathname.split("/").filter((crumb) => {
    if (crumb !== "" && crumb != ROLES_LIST.ADMIN) {
      return crumb;
    }
  });

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
              <div className="flex items-center justify-center">
                <img
                  src="/huwoma_logo.png"
                  className=" h-6 aspect-auto mx-auto"
                />
              </div>
              {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search Customers"
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              /> */}
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
      </div>
      {/* <AlertDialog open={logoutLoader}>
        <AlertDialogContent className="w-[200px]">
          <div className="flex justify-center items-center text-gray-600">
            <Loader2 className="h-6 w-6 animate-spin mr-4" />
            <span className="text-sm whitespace-nowrap">Logging Out</span>
          </div>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}

export default AdminLayout;
