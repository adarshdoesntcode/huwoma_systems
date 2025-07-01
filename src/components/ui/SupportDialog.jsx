import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, User } from "lucide-react";

function SupportDialog({ open, setOpen }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support Contact</DialogTitle>
          <DialogDescription>
            Reach out to the support person using the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Adarsh Das</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href="mailto:adarsh_das@icloud.com"
              className="text-sm underline text-muted-foreground hover:text-primary underline-offset-4"
            >
              adarsh_das@icloud.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a
              href="tel:+9779818576955"
              className="text-sm underline text-muted-foreground hover:text-primary underline-offset-4"
            >
              +977 9818576955
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SupportDialog;
