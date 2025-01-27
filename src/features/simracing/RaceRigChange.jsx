import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useChangeRigMutation } from "./simRacingApiSlice";
import { Loader } from "lucide-react";

function RaceRigChange({
  rigs,
  currentRig,
  transaction,
  isFetching,
  isMutating,
  setIsMutating,
  setChangeRigId,
  showLoader,
}) {
  const [selectedRig, setSelectedRig] = useState(currentRig);

  const [changeRig] = useChangeRigMutation();

  const handleChangeRig = async (data) => {
    const newRigId = data;
    setIsMutating(true);
    setChangeRigId(transaction);
    try {
      const res = await changeRig({
        transactionId: transaction,
        newRigId: newRigId,
        oldRigId: currentRig,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      // if (!res.error) {
      //   toast({
      //     title: "Rig Changed!",
      //     description: `Successfully`,
      //     duration: 2000,
      //   });
      // }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <Select
      value={selectedRig}
      onValueChange={handleChangeRig}
      disabled={isFetching || isMutating}
    >
      <SelectTrigger className="w-[100px]">
        {showLoader ? (
          <Loader className="animate-spin w-4 h-4" />
        ) : (
          <SelectValue placeholder="Select" />
        )}
      </SelectTrigger>
      <SelectContent>
        {rigs?.map((rig) => (
          <SelectItem key={rig._id} value={rig._id}>
            {rig.rigName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default RaceRigChange;
