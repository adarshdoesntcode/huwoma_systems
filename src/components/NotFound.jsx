import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMAGE_DATA } from "@/lib/config";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import SupportDialog from "./ui/SupportDialog";

const NotFound = () => {
  const navigate = useNavigate();
  const [showSupport, setShowSupport] = useState(false);

  const goBack = () => navigate(-1);

  return (
    <div
      className="min-h-screen bg-fixed bg-center"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <div className="grid grid-cols-12 mx-auto max-w-7xl">
        <div className="flex self-center justify-between col-span-12 p-4">
          <Link to={"/"} className="flex items-center gap-2">
            <img
              src={IMAGE_DATA.huwoma_logo}
              loading="lazy"
              alt="logo"
              width={120}
            />
          </Link>
          <div>
            <Button
              variant="ghost"
              onClick={() => setShowSupport((prev) => !prev)}
            >
              Support
            </Button>
            <SupportDialog open={showSupport} setOpen={setShowSupport} />
          </div>
        </div>
        <Card className="mt-[25vh] col-span-12 w-[400px] max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center"> 404</CardTitle>
            <CardTitle className="text-2xl text-center"> Not Found !</CardTitle>
            <CardDescription className="text-center ">
              You page you are requesting does not exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => goBack()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
