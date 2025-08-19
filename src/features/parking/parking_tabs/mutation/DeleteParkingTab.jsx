import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  useCancelParkingTabMutation,
  useTerminateParkingTabMutation,
} from "../../parkingApiSlice";

export const DeleteParkingTab = ({ showDelete, setShowDelete, tab }) => {
  const [terminateParkingTab, { isLoading }] = useTerminateParkingTabMutation();

  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    try {
      if (!tab) return;
      const res = await terminateParkingTab({
        tabId: tab._id,
      });
      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Tab Deleted!",
          description: "Successfully",
          duration: 2000,
        });
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
    <AlertDialog open={showDelete} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Do you want to terminate ${tab.tabOwnerName}'s tab ?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will terminate this tab and
            cancel all the transactions in it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Terminating
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Terminate
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
