import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IMAGE_DATA } from "@/lib/config";
import { Image } from "@unpic/react";
import { Origami } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
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
            <Image src={IMAGE_DATA.huwoma_logo} alt="logo" width={120} />
          </Link>
          <div>
            <Button variant="link">Support</Button>
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
