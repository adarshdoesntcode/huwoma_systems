import { ChevronLeft, LeafyGreen } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function NavBackButton({ buttonText, navigateTo, navigateOpt = {} }) {
  const navigate = useNavigate();

  return (
    <div className="">
      <Button
        variant="outline"
        size="sm"
        className="pl-2 pr-4 text-sm"
        onClick={() => navigate(navigateTo, { ...navigateOpt })}
      >
        <ChevronLeft className="h-5 w-4.5 mr-1" />

        {buttonText}
      </Button>
    </div>
  );
}

export default NavBackButton;
