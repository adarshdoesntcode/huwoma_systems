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

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  // const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <div className="flex bg-[url('/hero-pattern.webp')] pt-12 sm:pt-0 items-start sm:items-center justify-center h-screen">
      <div className="flex gap-10 flex-col">
        <div className="col-span-12 max-w-lg  mx-auto text-center">
          <div className="flex gap-2 text-center  text-slate-400 text-sm flex-col items-center justify-center">
            <img src="logo.png" className="w-[75px]" />
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
              <form
                // onSubmit={  handleSubmit(onSubmit)}

                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {errors.email ? (
                      <span className="text-red-500">
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
                      // pattern: {
                      //   value: /^[^\d@]+@ncit\.edu\.np$/,
                      //   message: "Invalid email address",
                      // },
                    })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">
                      {errors.password ? (
                        <span className="text-red-500">
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
                        className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer text-gray-400 right-3 top-2.5 h-5 w-5"
                      />
                    )}

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className={errors.password ? "border-red-500" : ""}
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

              {/* <ResetPassword
              forgotPassword={forgotPassword}
              setForgotPassword={setForgotPassword}
              role={ROLES_LIST.admin}
            /> */}

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">
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
              <div className="  mx-auto text-center  text-slate-400 text-xs">
                <p>Use a registered Google Account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-12 max-w-lg mx-auto text-center  text-slate-400 text-xs">
          <p>For the love of cars.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
