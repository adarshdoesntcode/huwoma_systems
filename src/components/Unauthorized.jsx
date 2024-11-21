import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMAGE_DATA } from "@/lib/config";

import { Link, useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div
      className="min-h-screen  bg-center bg-fixed"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <div className="grid grid-cols-12 max-w-7xl mx-auto">
        <div className="col-span-12  self-center p-4 flex justify-between">
          <Link to={"/"} className="flex items-center  gap-2">
            <img
              src={IMAGE_DATA.huwoma_logo}
              loading="lazy"
              alt="logo"
              width={120}
            />
          </Link>
          <div>
            <Button variant="link">Support</Button>
          </div>
        </div>
        <Card className="mt-[25vh] col-span-12 w-[400px] max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl text-center"> 401</CardTitle>
            <CardTitle className="text-2xl text-center">
              Unauthorized !
            </CardTitle>
            <CardDescription className="text-center ">
              You cannot access this page.
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

export default Unauthorized;
