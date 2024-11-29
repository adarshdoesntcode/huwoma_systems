import { useNavigate } from "react-router-dom";
import { useRollBackFromCompletedMutation } from "../carwashApiSlice";
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

function ConfirmRollbackFromComplete({
  showRollbackFromComplete,
  setShowRollbackFromComplete,
  rollBackId,
  setRollBackId,
  origin,
}) {
  const [rollBackFromCompleted, { isLoading }] =
    useRollBackFromCompletedMutation();

  const handleCloseDelete = () => {
    setShowRollbackFromComplete(false);
    setRollBackId(null);
  };

  const navigate = useNavigate();

  const handleRollbackFromComplete = async () => {
    try {
      if (!rollBackId) return;
      const res = await rollBackFromCompleted({
        transactionId: rollBackId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Rolled Back",
          description: "to Ready for Pickup",
          duration: 2000,
        });
        if (origin === "carwash") {
          navigate("/carwash", { state: { tab: "pickup" }, replace: true });
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
    <AlertDialog
      open={showRollbackFromComplete}
      onOpenChange={handleCloseDelete}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
          <AlertDialogDescription>
            This will rollback this transaction from Completed to Ready for
            Pickup
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
            <Button variant="destructive" onClick={handleRollbackFromComplete}>
              Rollback <Undo2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmRollbackFromComplete;
