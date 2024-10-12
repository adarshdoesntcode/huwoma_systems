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
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { Badge } from "@/components/ui/badge";
import { roleByCode } from "@/lib/utils";
import { ROLES_LIST } from "@/lib/config";
import { Label } from "@/components/ui/label";

function GeneralSettings() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            {user.fullname}{" "}
            <Badge
              variant={user.role[0] === ROLES_LIST.SUPERADMIN ? "" : "outline"}
            >
              {roleByCode(ROLES_LIST, user.role[0])}
            </Badge>
          </CardTitle>
          <CardDescription>
            Used to identify your store in the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label>Change Name</Label>
            <Input placeholder="Name" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button>Update</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            The directory within your project, in which your plugins are
            located.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Current Password</Label>
              <Input />
            </div>
            <div className="grid gap-2">
              <Label>New Password</Label>
              <Input />
            </div>
            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <Input />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 flex justify-end">
          <Button>Change</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default GeneralSettings;
