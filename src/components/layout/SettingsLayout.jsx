import { ChevronLeft, CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, Outlet, useNavigate } from "react-router-dom";

export function SettingsLayout() {
  const navigate = useNavigate();
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
          <nav className="flex gap-4 flex-wrap text-sm text-muted-foreground">
            <Link href="#" className="font-semibold text-primary">
              General
            </Link>
            <Link href="#">CarWash</Link>
            <Link href="#">SimRacing</Link>
            <Link href="#">Parking</Link>
            <Link href="#">Admins</Link>
            <Link href="#">Payments</Link>
          </nav>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default SettingsLayout;
