import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { setCredentials } from "./auth/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./auth/authApiSlice";
import { useToast } from "@/hooks/use-toast";
import { ResetPassword } from "@/components/ResetPassword";
import {
  GOOGLE_OAUTH_REDIRECT_URL,
  IMAGE_DATA,
  ROLES_LIST,
} from "@/lib/config";
import { getGoogleOAuthURL } from "@/lib/utils";
import SupportDialog from "@/components/ui/SupportDialog";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const from = location.state?.from?.pathname || `/dashboard`;

  const onSubmit = async ({ email, password }) => {
    try {
      const userData = await login({
        email,
        password,
      });

      if (userData.error) {
        if (userData.error.status === 401)
          throw new Error("Email or password is incorrect.");
      }

      if (!userData.error) {
        const role = userData.data.user.role[0];
        dispatch(setCredentials({ ...userData }));
        reset();
        if (role === ROLES_LIST.STAFF) {
          navigate("/carwash", { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };
  return (
    <div
      className={`flex  pt-12 sm:pt-0 items-start sm:items-center justify-center h-screen`}
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <div className="flex flex-col gap-14">
        <div className="max-w-lg col-span-12 mx-auto text-center">
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-center text-muted-foreground">
            <img
              src={IMAGE_DATA.huwoma_logo}
              loading="lazy"
              className="w-48 sm:w-64"
            />
            Management System
          </div>
        </div>

        <Card className="col-span-12 w-[350px] lg:w-[400px] max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              Login
            </CardTitle>
            <CardDescription>
              Enter your administrator email below to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">
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
                    type="email"
                    placeholder="example@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {errors.password ? (
                        <span className="text-destructive">
                          {errors.password.message}
                        </span>
                      ) : (
                        <span>Password</span>
                      )}
                    </Label>
                    <p
                      onClick={() => setForgotPassword(true)}
                      className="inline-block py-0 ml-auto text-sm font-normal leading-none underline cursor-pointer"
                    >
                      Reset password?
                    </p>
                  </div>
                  <div className="relative">
                    {showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer text-muted-foreground right-3 top-2.5 h-5 w-5"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer text-muted-foreground right-3 top-2.5 h-5 w-5"
                      />
                    )}

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={errors.password ? "border-destructive" : ""}
                    />
                  </div>
                </div>
                {isSubmitting ? (
                  <Button variant="secondary" disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging In
                  </Button>
                ) : (
                  <Button variant="secondary" type="submit" className="w-full">
                    Login
                  </Button>
                )}
              </form>

              <ResetPassword
                forgotPassword={forgotPassword}
                setForgotPassword={setForgotPassword}
              />

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-background text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link to={getGoogleOAuthURL(GOOGLE_OAUTH_REDIRECT_URL)}>
                  Login with Google
                </Link>
              </Button>
              <div className="mx-auto text-xs text-center text-muted-foreground">
                <p>Use a registered Google Account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-lg col-span-12 mx-auto text-xs text-center text-muted-foreground">
          <Button
            variant="ghost"
            onClick={() => setShowSupport((prev) => !prev)}
          >
            Support
          </Button>

          <SupportDialog open={showSupport} setOpen={setShowSupport} />
        </div>
      </div>
    </div>
  );
}

export default Login;
