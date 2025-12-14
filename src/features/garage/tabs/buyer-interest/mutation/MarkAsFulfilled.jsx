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
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFulfillInterestMutation } from "@/features/garage/garageApiSlice";

function MarkAsFulfilled({
  showDialog,
  setShowDialog,
  interestId,
  setInterestId,
}) {
  const navigate = useNavigate();
  const [fulfillInterest, { isLoading }] = useFulfillInterestMutation();

  const handleCloseDialog = () => {
    setShowDialog(false);
    setInterestId(null);
  };

  const handleDelete = async () => {
    try {
      if (!interestId) return;
      const res = await fulfillInterest({
        id: interestId,
      });

      if (res.error) {
        handleCloseDialog();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDialog();
        navigate(`/garage/interest/${interestId}`, {
          replace: true,
        });
        toast({
          title: "Interest Fulfilled!",
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
    <AlertDialog open={showDialog} onOpenChange={handleCloseDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will set the preference as
            fulfilled
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Fulfilling
            </Button>
          ) : (
            <Button onClick={handleDelete}>Fulfill</Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default MarkAsFulfilled;
