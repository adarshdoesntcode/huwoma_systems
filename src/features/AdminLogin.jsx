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
import { IMAGE_DATA } from "@/lib/config";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const home_path = window.location.origin;

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
        dispatch(setCredentials({ ...userData }));
        reset();
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.log(error);
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
      <div className="flex gap-14 flex-col">
        <div className="col-span-12 max-w-lg  mx-auto text-center">
          <div className="flex gap-2 text-center  text-muted-foreground text-sm flex-col items-center justify-center">
            <img src={IMAGE_DATA.huwoma_logo} className="w-48 sm:w-64" />
            Management System
          </div>
        </div>

        <Card className="col-span-12 w-[350px] lg:w-[400px] max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
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
                      className="ml-auto font-normal leading-none cursor-pointer inline-block py-0 text-sm underline"
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button className="w-full" asChild>
                <a
                // to={getGoogleOAuthURL(
                //   GOOGLE_OAUTH_REDIRECT_URL,
                //   ROLES_LIST.admin,
                //   home_path
                // )}
                >
                  Login with Google
                </a>
              </Button>
              <div className="  mx-auto text-center  text-muted-foreground text-xs">
                <p>Use a registered Google Account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-12 max-w-lg mx-auto text-center  text-muted-foreground text-xs">
          <Button variant="link" asChild>
            <Link to={"/support"}>Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
