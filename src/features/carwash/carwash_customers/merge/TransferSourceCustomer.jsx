import SubmitButton from "@/components/SubmitButton";
import { useTransferCarwashTransactionMutation } from "../../carwashApiSlice";
import { toast } from "@/hooks/use-toast";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function TransferSourceCustomer({
  handleClose,
  selectedTransaction,
  targetCustomer,
  setTargetCustomer,
}) {
  const [transferCarwashTransaction, { isLoading: isTransfering }] =
    useTransferCarwashTransactionMutation();
  const handleTransfer = async () => {
    const payload = {
      transactionId: selectedTransaction._id,
      targetCustomerId: targetCustomer._id,
      sourceCustomerId: selectedTransaction.customer._id,
    };

    try {
      const res = await transferCarwashTransaction(payload);
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Transaction Transfered!",
          description: "Transaction transfered successfully",
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
        <DialogTitle>Transfering To </DialogTitle>
        <DialogDescription>
          Transaction {selectedTransaction.billNo} will be transfered to{" "}
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
              <div className="text-md ">{targetCustomer.customerName}</div>
              <div className="flex flex-col text-xs">
                {targetCustomer.customerContact}
              </div>
            </div>
          </div>
          <div className="text-xs">
            Transactions
            <Badge variant={"secondary"} className={"ml-2"}>
              {targetCustomer.customerTransactions.length}{" "}
            </Badge>
          </div>
        </div>
      </div>
      <DialogFooter>
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={() => setTargetCustomer("")}>
            Back
          </Button>
          <SubmitButton
            condition={isTransfering}
            onClick={handleTransfer}
            loadingText={"Loading..."}
            buttonText={"Transfer"}
            type="button"
            disabled={isTransfering}
          />
        </div>
      </DialogFooter>
    </>
  );
}

export default TransferSourceCustomer;
