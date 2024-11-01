import NavBackButton from "@/components/NavBackButton";
import {
  useCreateCutomerMutation,
  useFindCustomerMutation,
  useTransactionBookingMutation,
} from "./carwashApiSlice";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { add, format } from "date-fns";
import {
  Album,
  BookOpenCheck,
  Calendar as CalendarIcon,
  ChevronRight,
} from "lucide-react";

import { cn, generateBillNo } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResetIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "lucide-react";
import SubmitButton from "@/components/SubmitButton";
import { TimePicker } from "@/components/ui/time-picker";
import { useNavigate } from "react-router-dom";

function CarwashNewBooking() {
  const [customer, setCoustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState(false);
  const [findCustomer] = useFindCustomerMutation();
  const [createCutomer] = useCreateCutomerMutation();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    if (newCustomer) {
      try {
        const res = await createCutomer({
          customerContact: data.customerContact,
          customerName: data.customerName,
        });
        if (res.error) {
          throw new Error(res.error.data.message);
        }
        if (!res.error) {
          setCoustomer(res.data.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    } else if (!newCustomer) {
      try {
        const res = await findCustomer({
          customerContact: data.customerContact,
        });
        if (res.error) {
          if (res.error.status === 404) {
            setNewCustomer(true);
          } else {
            throw new Error(res.error.data.message);
          }
        }
        if (!res.error) {
          setCoustomer(res.data.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Something went wrong!!",
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-xl items-start gap-4 ">
      <NavBackButton buttonText={"Car Wash Booking"} navigateTo={-1} />
      {customer ? (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    <Contact />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-md">
                    {customer.customerName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {customer.customerContact}
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCoustomer(null);
                  reset();
                }}
              >
                Reset <ResetIcon className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">Customer</CardTitle>
            <CardDescription>Customer for new booking</CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4"
              id="customer"
            >
              <div className="grid gap-2">
                <Label>
                  {errors.customerContact ? (
                    <span className="text-destructive">
                      {errors.customerContact.message}
                    </span>
                  ) : (
                    <span>Customer Number</span>
                  )}
                </Label>
                <Input
                  onWheel={(e) => e.target.blur()}
                  id="serviceRate"
                  type="number"
                  placeholder="+977"
                  {...register("customerContact", {
                    required: "Number is required",
                    valueAsNumber: true,
                    validate: (value) =>
                      String(value).length === 10 || "Number must be 10 digits",
                  })}
                  className={errors.serviceRate ? "border-destructive" : ""}
                />
              </div>
              {newCustomer && (
                <div className="grid gap-2">
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
                    id="customerName"
                    type="text"
                    placeholder="Name"
                    {...register("customerName", {
                      required: "Name is required",
                    })}
                    className={errors.customerName ? "border-destructive" : ""}
                  />
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
            <div className="flex w-full items-center justify-between gap-4">
              <div>
                {newCustomer && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      reset();
                      setNewCustomer(false);
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
              <SubmitButton
                condition={isSubmitting}
                loadingText={newCustomer ? "Creating" : "Finding"}
                buttonText={
                  newCustomer ? (
                    <>
                      Create <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )
                }
                type="submit"
                form="customer"
              />
            </div>
          </CardFooter>
        </Card>
      )}
      {customer && <BookingTime customer={customer} />}
    </div>
  );
}

const BookingTime = ({ customer }) => {
  const [date, setDate] = useState(new Date());
  const [transactionBooking, { isLoading }] = useTransactionBookingMutation();
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!date) return;
    try {
      const res = await transactionBooking({
        billNo: generateBillNo(),
        bookingDeadline: date.toISOString(),
        customerId: customer._id,
      });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        toast({
          title: "Booking Successful!",
          description: `Bill No: ${res.data.data.billNo}`,
        });
        navigate("/carwash", { state: { tab: "booking" }, replace: true });
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
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Booking Time</CardTitle>
        <CardDescription>
          Booking will terminate 15 mins after the deadline
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
        <div className="flex flex-col sm:flex-row gap-2 mt-2 items-start justify-between sm:items-center">
          <Label>Select Date</Label>
          <DateTimePicker date={date} setDate={setDate} />
        </div>
      </CardContent>
      <CardFooter className="border-t px-4 sm:px-6  py-4 flex justify-end">
        <SubmitButton
          condition={isLoading}
          loadingText="Booking"
          buttonText={
            <>
              Book <Album className="w-4 h-4 ml-2" />
            </>
          }
          onClick={onSubmit}
          disabled={!date}
        />
      </CardFooter>
    </Card>
  );
};

function DateTimePicker({ date, setDate }) {
  const handleSelect = (newDay) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full sm:w-[230px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PP   hh:mm a") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => handleSelect(d)}
          initialFocus
          fromDate={new Date()}
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={setDate} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CarwashNewBooking;
