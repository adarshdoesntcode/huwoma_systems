import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { BetweenHorizontalStart, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import {
  useNewParkingTabMutation,
  useStartParkingMutation,
} from "./parkingApiSlice";
import { useNavigate } from "react-router-dom";

function NewParkingTab({ className }) {
  const [modelOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [newParkingTab] = useNewParkingTabMutation();

  const onSubmit = async (data) => {
    try {
      const res = await newParkingTab({
        ...data,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Tab Created!",
          description: "You can add pending transactions to this tab",
          duration: 2000,
        });
        reset();
        setModalOpen(false);
        navigate(`/parking`, { state: { tab: "ontab" }, replace: true });
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
    <Dialog open={modelOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <span>New Tab</span>
          <PlusCircle className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a tab for a customer</DialogTitle>
          <DialogDescription>
            All the pending transactions will be added to this customer
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          <form
            className="grid gap-5 p-2"
            onSubmit={handleSubmit(onSubmit)}
            id="new-parking-tab-form"
          >
            <div className="grid gap-3">
              <Label>
                {errors.customerName ? (
                  <span className="text-destructive">
                    {errors.customerName.message}
                  </span>
                ) : (
                  <span>Customer Name</span>
                )}
              </Label>
              <Input
                autoFocus
                id="customerName"
                type="text"
                placeholder="Name"
                autoComplete="off"
                {...register("customerName", {
                  required: "Name is required",
                  pattern: {
                    value: /^[a-zA-Z\s]*$/,
                    message: "Invalid Name",
                  },
                  onChange: (e) => {
                    const words = e.target.value.split(" ");
                    const newWords = words.map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1)
                    );
                    const newValue = newWords.join(" ");
                    if (e.target.value !== newValue) {
                      e.target.value = newValue;
                    }
                  },
                })}
                className={errors.customerName ? "border-destructive" : ""}
              />
            </div>
            <div className="grid gap-3">
              <Label>
                {errors.customerContact ? (
                  <span className="text-destructive">
                    {errors.customerContact.message}
                  </span>
                ) : (
                  <span>Contact Number</span>
                )}
              </Label>
              <Input
                onWheel={(e) => e.target.blur()}
                type="tel"
                inputMode="numeric"
                placeholder="+977"
                autoComplete="off"
                {...register("customerContact", {
                  // required: "Number is required",

                  validate: (value) =>
                    String(value).length === 10 || "Number must be 10 digits",
                })}
                className={errors.customerContact ? "border-destructive" : ""}
              />
            </div>
          </form>
        </div>

        <DialogFooter>
          <SubmitButton
            condition={isSubmitting}
            loadingText={
              <>
                Start Tab <BetweenHorizontalStart className="w-4 h-4 ml-2" />
              </>
            }
            buttonText={
              <>
                Start Tab <BetweenHorizontalStart className="w-4 h-4 ml-2" />
              </>
            }
            form="new-parking-tab-form"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewParkingTab;
