import { useState } from "react";
import {
  useCreateAdminMutation,
  useCreatePaymentModeMutation,
  useDeleteAdminMutation,
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
} from "../settingsApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import ApiError from "@/components/error/ApiError";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roleByCode } from "@/lib/utils";
import { ROLES_LIST } from "@/lib/config";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useIsSuper } from "@/hooks/useSuper";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { Navigate } from "react-router-dom";
import { set } from "lodash";

function AdminsSettings() {
  const isSuper = useIsSuper();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const user = useSelector(selectCurrentUser);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState("");

  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetAllAdminsQuery();

  let content;

  if (!isSuper) {
    return <Navigate to="/settings" />;
  }

  if (isLoading || isFetching) {
    content = (
      <div className="pb-2">
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
        <div className="border-t py-3  flex gap-4">
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
          <Skeleton className="h-10 w-1/6" />
          <Skeleton className="h-10 w-2/6" />
        </div>
      </div>
    );
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
          No Admins
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">SN</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="pl-1  hidden sm:table-cell">
                  Contact
                </TableHead>
                <TableHead className="text-center hidden sm:table-cell">
                  Role
                </TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((admin, index) => {
                return (
                  <TableRow
                    key={admin._id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedAdmin(admin);
                      setDetailsOpen(true);
                    }}
                  >
                    <TableCell className="p-1 pl-4 hidden sm:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium p-4 ">
                      {admin.fullname}
                    </TableCell>
                    <TableCell className="sm:p-1 p-4  hidden sm:table-cell">
                      <div>
                        <p className="text-xs">{admin.phoneNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-center p-1 hidden sm:table-cell">
                      <Badge
                        variant={
                          roleByCode(
                            ROLES_LIST,
                            admin.role[0]
                          ).toLowerCase() === "superadmin"
                            ? ""
                            : "secondary"
                        }
                      >
                        {roleByCode(ROLES_LIST, admin.role[0])}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right p-1">
                      <div className="flex gap-2 items-center justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAdmin(admin);
                            setEditOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        {user._id !== admin._id && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAdmin(admin);
                              setDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} />;
  }
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl">Administrators </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure admins for the system
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">{content}</CardContent>
      {deleteOpen && (
        <ConfirmDelete
          setDeleteOpen={setDeleteOpen}
          deleteOpen={deleteOpen}
          selectedAdmin={selectedAdmin}
          setSelectedAdmin={setSelectedAdmin}
        />
      )}
      {editOpen && (
        <EditAdmin
          setEditOpen={setEditOpen}
          editOpen={editOpen}
          selectedAdmin={selectedAdmin}
        />
      )}
      {createOpen && (
        <CreateAdmin createOpen={createOpen} setCreateOpen={setCreateOpen} />
      )}
      {detailsOpen && (
        <ConfigDetails
          setDetailsOpen={setDetailsOpen}
          detailsOpen={detailsOpen}
          selectedAdmin={selectedAdmin}
        />
      )}

      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Add Admin</Button>
      </CardFooter>
    </Card>
  );
}

function ConfigDetails({ setDetailsOpen, detailsOpen, selectedAdmin }) {
  return (
    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
      <DialogContent className="p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedAdmin?.fullname}{" "}
            {
              <Badge
                variant={
                  roleByCode(
                    ROLES_LIST,
                    selectedAdmin.role[0]
                  ).toLowerCase() === "superadmin"
                    ? ""
                    : "secondary"
                }
              >
                {roleByCode(ROLES_LIST, selectedAdmin.role[0])}
              </Badge>
            }
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <span>Email</span>
                <span>{selectedAdmin?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Contact</span>
                <span>{selectedAdmin?.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Admin Since</span>
                <span>{format(selectedAdmin?.createdAt, "d MMM, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setDetailsOpen(false);
            }}
          >
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateAdmin({ createOpen, setCreateOpen }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("ADMIN");
  const [createAdmin, { isLoading: isSubmitting }] = useCreateAdminMutation();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!role) return;
    try {
      const res = await createAdmin({
        fullname: data.fullname,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: ROLES_LIST[role],
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setCreateOpen(false);
        reset();
        toast({
          title: "Admin Created",
          description: "They must change the password",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Create New Admin </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 px-2 pb-2"
            id="admin-form"
          >
            <div className="space-y-1">
              <Label>
                {errors.fullname ? (
                  <span className="text-destructive">
                    {errors.fullname.message}
                  </span>
                ) : (
                  <span>Name</span>
                )}
              </Label>
              <Input
                id="fullname"
                type="text"
                autoComplete="off"
                placeholder="Name"
                {...register("fullname", {
                  required: "Name is required",
                })}
                className={errors.fullname ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>
                {errors.email ? (
                  <span className="text-destructive">
                    {errors.email.message}
                  </span>
                ) : (
                  <span>Email</span>
                )}
              </Label>
              <Input
                id="email"
                type="text"
                autoComplete="off"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={errors.email ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>
                {errors.phoneNumber ? (
                  <span className="text-destructive">
                    {errors.phoneNumber.message}
                  </span>
                ) : (
                  <span>Contact</span>
                )}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="off"
                placeholder="+977"
                {...register("phoneNumber", {
                  required: "Contact is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a 10 digit contact number",
                  },
                  valueAsNumber: true,
                })}
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPassword">
                {errors.newPassword ? (
                  <span className="text-red-500">
                    {errors.newPassword.message}
                  </span>
                ) : (
                  <span>New Password</span>
                )}
              </Label>
              <div className="relative">
                {showNewPassword ? (
                  <Eye
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                )}

                <Input
                  id="newPassword"
                  autoComplete="off"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                      message:
                        "Password must contain 1 lowercase, 1 uppercase, 1 number, and 1 special character",
                    },
                  })}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">
                {errors.confirmPassword ? (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                ) : (
                  <span>Confirm Password</span>
                )}
              </Label>
              <div className="relative">
                {showConfirmPassword ? (
                  <Eye
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                )}

                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="off"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "The passwords do not match",
                  })}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
              </div>
            </div>
          </form>
        </div>
        <DialogFooter>
          {isSubmitting ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating
            </Button>
          ) : (
            <Button type="submit" form="admin-form">
              Create
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDelete({
  deleteOpen,
  setDeleteOpen,
  selectedAdmin,
  setSelectedAdmin,
}) {
  const [deleteAdmin, { isLoading }] = useDeleteAdminMutation();

  const handleDelete = async () => {
    try {
      if (!selectedAdmin) return;
      const res = await deleteAdmin({
        adminId: selectedAdmin._id,
      });
      setDeleteOpen(false);
      if (res.error) {
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        setSelectedAdmin({});

        toast({
          title: "Admin Removed!",
          description: res.data.data.fullname,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will remove your payment mode
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EditAdmin({ selectedAdmin, editOpen, setEditOpen }) {
  const [role, setRole] = useState(
    roleByCode(ROLES_LIST, selectedAdmin.role[0])
  );

  const [updateAdmin, { isLoading: isSubmitting }] = useUpdateAdminMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await updateAdmin({
        ...data,
        role: ROLES_LIST[role],
        adminId: selectedAdmin._id,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        setEditOpen(false);
        reset();
        toast({
          title: "Admin Updated",
          description: "Account may logout",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Edit Payemnt Mode</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="space-y-1">
              <Label>
                {errors.fullname ? (
                  <span className="text-destructive">
                    {errors.fullname.message}
                  </span>
                ) : (
                  <span>Name</span>
                )}
              </Label>
              <Input
                id="fullname"
                type="text"
                autoComplete="off"
                defaultValue={selectedAdmin.fullname}
                placeholder="Name"
                {...register("fullname", {
                  required: "Name is required",
                })}
                className={errors.fullname ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>
                {errors.email ? (
                  <span className="text-destructive">
                    {errors.email.message}
                  </span>
                ) : (
                  <span>Email</span>
                )}
              </Label>
              <Input
                id="email"
                type="text"
                autoComplete="off"
                placeholder="Email"
                defaultValue={selectedAdmin.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={errors.email ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>
                {errors.phoneNumber ? (
                  <span className="text-destructive">
                    {errors.phoneNumber.message}
                  </span>
                ) : (
                  <span>Contact</span>
                )}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                autoComplete="off"
                placeholder="+977"
                defaultValue={selectedAdmin.phoneNumber}
                {...register("phoneNumber", {
                  required: "Contact is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a 10 digit contact number",
                  },
                  valueAsNumber: true,
                })}
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              {isSubmitting ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </Button>
              ) : (
                <Button type="submit">Save</Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminsSettings;
