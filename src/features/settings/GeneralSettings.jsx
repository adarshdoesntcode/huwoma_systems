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
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser, setUser } from "../auth/authSlice";
import { Badge } from "@/components/ui/badge";
import { roleByCode } from "@/lib/utils";
import { ROLES_LIST } from "@/lib/config";
import { Label } from "@/components/ui/label";
import { useUpdateAdminProfileMutation } from "./settingsApiSlice";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { useIsSuper } from "@/hooks/useSuper";

function GeneralSettings() {
  const isSuper = useIsSuper();

  return (
    <div className="grid gap-6">
      <AdminName />
      {isSuper && <AdminEmail />}
      <AdminContact />
      <AdminPassword />
    </div>
  );
}

function AdminName() {
  const user = useSelector(selectCurrentUser);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullname: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateAdminProfile({
        id: user._id,
        fullname: data.fullname,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        dispatch(setUser({ user: { user: res.data.data } }));

        toast({
          title: "Name Updated!",
          description: res.data.data.fullname,
          duration: 2000,
        });
        reset();
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex text-xl sm:text-2xl items-center gap-4">
          {user.fullname}
          <Badge>{roleByCode(ROLES_LIST, user.role[0])}</Badge>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Used to identify you in the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="name-change"
          className="grid gap-2"
        >
          <Label>
            {errors.fullname ? (
              <span className="text-destructive">
                {errors.fullname.message}
              </span>
            ) : (
              <span>Change Name</span>
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
        </form>
      </CardContent>
      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </Button>
        ) : (
          <Button disabled={!isDirty} type="submit" form="name-change">
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AdminEmail() {
  const user = useSelector(selectCurrentUser);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateAdminProfile({
        id: user._id,
        email: data.email,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        dispatch(setUser({ user: { user: res.data.data } }));

        toast({
          title: "Email Updated!",
          description: "You will be logged out",
          duration: 2000,
        });
        reset();
        setTimeout(() => dispatch(logOut()), 2000);
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex text-xl sm:text-2xl items-center gap-4">
          Email
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Current : {user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="email-change"
          className="grid gap-2"
        >
          <Label>
            {errors.email ? (
              <span className="text-destructive">{errors.email.message}</span>
            ) : (
              <span>Change Email</span>
            )}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="off"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
            className={errors.email ? "border-destructive" : ""}
          />
        </form>
      </CardContent>
      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" disabled={!isDirty}>
              Save
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {errors.email ? (
                  <span className="text-destructive">
                    {errors.email.message}
                  </span>
                ) : (
                  <span>Your will be logged out</span>
                )}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              You will be logged out upon email change and need to relogin
            </AlertDialogDescription>
            <AlertDialogFooter className="flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <>
                  {isSubmitting ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </Button>
                  ) : (
                    <Button
                      disabled={!isDirty}
                      type="submit"
                      form="email-change"
                    >
                      Confirm
                    </Button>
                  )}
                </>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

function AdminContact() {
  const user = useSelector(selectCurrentUser);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateAdminProfile({
        id: user._id,
        phoneNumber: data.phoneNumber,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        dispatch(setUser({ user: { user: res.data.data } }));

        toast({
          title: "Contact Updated!",
          description: res.data.data.phoneNumber,
          duration: 2000,
        });
        reset();
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex text-xl sm:text-2xl items-center gap-4">
          Contact
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Current : {user.phoneNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="contact-change"
          className="grid gap-2"
        >
          <Label>
            {errors.phoneNumber ? (
              <span className="text-destructive">
                {errors.phoneNumber.message}
              </span>
            ) : (
              <span>Change Contact</span>
            )}
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            autoComplete="off"
            placeholder="+977"
            {...register("phoneNumber", {
              required: "Number is required",
              validate: (value) =>
                String(value).length === 10 || "Number must be 10 digits",
            })}
            className={errors.phoneNumber ? "border-destructive" : ""}
          />
        </form>
      </CardContent>
      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </Button>
        ) : (
          <Button disabled={!isDirty} type="submit" form="contact-change">
            Save
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function AdminPassword() {
  const user = useSelector(selectCurrentUser);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updateAdminProfile] = useUpdateAdminProfileMutation();

  const {
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateAdminProfile({
        id: user._id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Password Updated!",
          description: "Successfully",
          duration: 2000,
        });
        reset();
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl ">Password</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Provide current password with your new password
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-2 sm:pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="password-change"
          className="flex flex-col gap-4"
        >
          <div className="grid  items-center gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">
                {errors.currentPassword ? (
                  <span className="text-red-500">
                    {errors.currentPassword.message}
                  </span>
                ) : (
                  <span>Current Password</span>
                )}
              </Label>
              <div className="relative">
                {showPassword ? (
                  <Eye
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                  />
                )}

                <Input
                  id="currentPassword"
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  {...register("currentPassword", {
                    required: "Password is required",
                  })}
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>
          <div className="grid  items-center gap-4">
            <div className="grid gap-2">
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
            <div className="grid  items-center gap-4">
              <div className="grid gap-2">
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                    />
                  ) : (
                    <EyeOff
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        {isSubmitting ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Changing
          </Button>
        ) : (
          <Button disabled={!isDirty} type="submit" form="password-change">
            Change
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default GeneralSettings;
