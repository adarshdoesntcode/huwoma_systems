import { ChevronLeft, LeafyGreen } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function NavBackButton({ buttonText, navigateTo, navigateOpt = {} }) {
  const navigate = useNavigate();
  console.log(navigateOpt);
  return (
    <div className="">
      <Button
        variant="outline"
        size="sm"
        className="text-sm pl-2"
        onClick={() => navigate(navigateTo, { ...navigateOpt })}
      >
        <ChevronLeft className="h-5 w-5 mr-1" />

        {buttonText}
      </Button>
    </div>
  );
}

export default NavBackButton;
