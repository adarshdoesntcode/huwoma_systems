import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function NavBackButton({ buttonText, navigateTo, navigateOpt = {} }) {
  const navigate = useNavigate();
  return (
    <div className="text-lg font-semibold tracking-tight flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => navigate(navigateTo, navigateOpt)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      {buttonText}
    </div>
  );
}

export default NavBackButton;
