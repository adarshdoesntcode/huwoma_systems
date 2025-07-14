import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CarGarage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full gap-4 text-muted-foreground">
      <Button onClick={() => navigate("/garage/new-vehicle")}>
        New Vehicle <Plus className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

export default CarGarage;
