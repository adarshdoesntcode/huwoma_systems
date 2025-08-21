import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCheck, ChevronRight, CircleCheck } from "lucide-react";
import { useGetBuyersIntrestsQuery } from "../../garageApiSlice";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import Interests from "../../components/Interests";
import ApiError from "@/components/error/ApiError";
function SelectInterestForm({
  selectedInterest,
  selectedBuyer,
  setSelectedInterest,
  setFormStep,
}) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetBuyersIntrestsQuery({
      contactNumber: selectedBuyer.contactNumber,
      customerId: selectedBuyer._id,
    });

  const handleNext = () => {
    setFormStep(2);
  };

  return (
    <div className="duration-500 slide-in-from-right-5 animate-in">
      <Card>
        <CardHeader className="pb-4">
          <div className="w-full ">
            <CardTitle className="text-base font-semibold sm:text-lg">
              Fulfill a Buyer Interest
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Check if any interests match the selling vehicle
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center flex-1">
              <Loader />
            </div>
          )}
          {isSuccess && data && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.data.map((interest) => (
                <div key={interest._id}>
                  <SelectInterestCard
                    interest={interest}
                    selectedInterest={selectedInterest}
                    setSelectedInterest={setSelectedInterest}
                  />
                </div>
              ))}
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center flex-1">
              <ApiError error={error} refetch={refetch} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              type="button"
              onClick={() => setFormStep(0)}
            >
              Back
            </Button>

            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export const SelectInterestCard = ({
  interest,
  selectedInterest,
  setSelectedInterest,
}) => {
  const handleInterestSelect = () => {
    if (selectedInterest?._id === interest._id) {
      setSelectedInterest(null);
      return;
    }
    setSelectedInterest(interest);
  };

  return (
    <Card
      key={interest._id}
      onClick={handleInterestSelect}
      className="h-full duration-300 cursor-pointer hover:shadow-lg animate-in fade-in-10 slide-in-from-bottom-1"
    >
      <CardHeader className="p-4 ">
        <div className="flex items-center justify-between">
          <div className="py-1 text-xs text-muted-foreground">
            ID: {interest._id}
          </div>
          {selectedInterest?._id === interest._id && (
            <div className="p-1 rounded-full bg-primary">
              <CheckCheck className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        <Separator />
        <Interests interest={interest} showBudget={true} />
      </CardContent>
    </Card>
  );
};

export default SelectInterestForm;
