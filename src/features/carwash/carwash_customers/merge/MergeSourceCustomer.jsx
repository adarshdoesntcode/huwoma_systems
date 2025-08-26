import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import { useMergeSourcerAndTargetCustomerMutation } from "../../carwashApiSlice";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
function MergeSourceCustomer({
  selectedTargetCustomer,
  targetCustomer,
  setSelectedTargetVehicle,
  handleClose,
}) {
  const [deleteSource, setDeleteSource] = useState(true);
  const [mergeSourcerAndTargetCustomer, { isLoading: isMerging }] =
    useMergeSourcerAndTargetCustomerMutation();

  const handleMerge = async () => {
    const payload = {
      sourceCustomerId: selectedTargetCustomer._id,
      targetCustomerId: targetCustomer._id,
      deleteSource,
    };

    try {
      const res = await mergeSourcerAndTargetCustomer(payload);
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Customer Merged!",
          description: "Customer transactions merged successfully",
        });
        handleClose();
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
    <>
      <DialogHeader>
        <DialogTitle>Merging With</DialogTitle>
        <DialogDescription>
          {selectedTargetCustomer.customerName} will be merged with{" "}
          {targetCustomer.customerName}
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[60vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border rounded-md shadow-md">
          <div className="flex items-center gap-4">
            <Avatar className="hidden w-12 h-12 sm:block">
              <AvatarFallback>
                <Contact />
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="text-md ">
                {selectedTargetCustomer.customerName}
              </div>
              <div className="flex flex-col text-xs">
                {selectedTargetCustomer.customerContact}
              </div>
            </div>
          </div>
          <div className="text-xs">
            Transactions
            <Badge variant={"secondary"} className={"ml-2"}>
              {selectedTargetCustomer.customerTransactions.length}{" "}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between px-2 py-4">
          <Label>
            Delete {selectedTargetCustomer.customerName} after merge
          </Label>
          <Switch checked={deleteSource} onCheckedChange={setDeleteSource} />
        </div>
        <div className="p-4 text-xs border rounded-md text-amber-500 bg-amber-50 border-amber-100">
          Make sure to check the details of the customer before merging. This
          action cannot be undone
        </div>
      </div>
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={() => setSelectedTargetVehicle("")}
          >
            Back
          </Button>
          <SubmitButton
            condition={isMerging}
            onClick={handleMerge}
            loadingText={"Loading..."}
            buttonText={"Merge"}
            type="button"
            disabled={isMerging}
          />
        </div>
      </DialogFooter>
    </>
  );
}

export default MergeSourceCustomer;
