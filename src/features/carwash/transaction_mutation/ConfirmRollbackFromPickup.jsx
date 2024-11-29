import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Undo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRollBackFromPickupMutation } from "../carwashApiSlice";

function ConfirmRollbackFromPickup({
  showRollbackFromPickup,
  setShowRollbackFromPickup,
  rollBackId,
  setRollBackId,
  origin,
}) {
  const [rollBackFromPickup, { isLoading }] = useRollBackFromPickupMutation();
  const navigate = useNavigate();
  const handleCloseDelete = () => {
    setShowRollbackFromPickup(false);
    setRollBackId(null);
  };

  const handleRollbackFromPickup = async () => {
    try {
      if (!rollBackId) return;
      const res = await rollBackFromPickup({
        transactionId: rollBackId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Rolled back",
          description: "to In Queue",
          duration: 2000,
        });
        if (origin === "carwash") {
          navigate("/carwash", { state: { tab: "queue" }, replace: true });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog open={showRollbackFromPickup} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
          <AlertDialogDescription>
            This will rollback this transaction from Ready for Pickup to In
            Queue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rolling back...
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleRollbackFromPickup}>
              Rollback <Undo2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ConfirmRollbackFromPickup;
