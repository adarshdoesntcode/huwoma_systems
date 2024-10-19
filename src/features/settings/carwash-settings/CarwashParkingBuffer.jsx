import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";

function CarwashParkingBuffer() {
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const onUpdate = (data) => {
    console.log(data);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking Buffer</CardTitle>
        <CardDescription>
          Time buffer between service completion and the initiation of parking.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="parkingbuffer-form"
          onSubmit={handleSubmit(onUpdate)}
          className="flex items-center justify-between"
        >
          <Label>
            {errors.parkingBuffer ? (
              <span className="text-destructive">
                {errors.parkingBuffer.message}
              </span>
            ) : (
              <span>Time Buffer</span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              onWheel={(e) => e.target.blur()}
              id="parkingBuffer"
              type="number"
              placeholder="0"
              {...register("parkingBuffer", {
                required: "A time is required",
              })}
              className={errors.parkingBuffer ? "border-destructive" : ""}
            />
            <Label>minutes</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button type="submit" form="parkingbuffer-form">
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CarwashParkingBuffer;
