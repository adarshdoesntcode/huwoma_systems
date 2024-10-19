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

function CarwashCount() {
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
        <CardTitle>Wash Count</CardTitle>
        <CardDescription>Free wash after the number of wash</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="carwashcount-form"
          onSubmit={handleSubmit(onUpdate)}
          className="flex items-center justify-between"
        >
          <Label>
            {errors.washCount ? (
              <span className="text-destructive">
                {errors.washCount.message}
              </span>
            ) : (
              <span>Free Wash After</span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              onWheel={(e) => e.target.blur()}
              id="washCount"
              type="number"
              placeholder="0"
              {...register("washCount", {
                required: "Count is required",
              })}
              className={errors.washCount ? "border-destructive" : ""}
            />
            <Label>washes</Label>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button type="submit" form="carwashcount-form">
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CarwashCount;
