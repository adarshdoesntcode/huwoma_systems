import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

function FormThree({ setFormStep }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" type="button" onClick={() => setFormStep(2)}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
      {/* <Button type="button" onClick={handleNext} disabled={isUploading}>
        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Next <ChevronRight className="w-4 h-4 ml-2" />
      </Button> */}
    </div>
  );
}

export default FormThree;
