import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

function SubmitButton({ condition, loadingText, buttonText, ...props }) {
  if (condition) {
    return (
      <Button {...props} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}..
      </Button>
    );
  } else {
    return <Button {...props}>{buttonText}</Button>;
  }
}

export default SubmitButton;
