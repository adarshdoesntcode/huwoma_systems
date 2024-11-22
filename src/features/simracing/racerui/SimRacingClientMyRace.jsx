import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAxios from "@/hooks/useAxios";
import { IMAGE_DATA } from "@/lib/config";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

function SimRacingClientMyRace() {
  const axiosInstance = useAxios();
  const isRequestInProgress = useRef(false);
  const [transactionDetails, setTransactionDetails] = useState("");
  const [timeLapsed, setTimeLapsed] = useState("00:00:00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!transactionDetails || error) return;

    const start = new Date(transactionDetails?.data?.start);

    const calculateTimeLapsed = () => {
      const now = new Date();
      const timeLapsed = new Date(now - start);
      const hours = String(timeLapsed.getUTCHours()).padStart(2, "0");
      const minutes = String(timeLapsed.getUTCMinutes()).padStart(2, "0");
      const seconds = String(timeLapsed.getUTCSeconds()).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    };

    setTimeLapsed(calculateTimeLapsed());

    const interval = setInterval(() => {
      setTimeLapsed(calculateTimeLapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [transactionDetails, error]);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (error) return;
      if (isRequestInProgress.current) return;
      isRequestInProgress.current = true;
      try {
        const response = await axiosInstance.get(`/myrace/transaction`);
        const data = response.data;
        if (isLoading) {
          setIsLoading(false);
        }
        setTransactionDetails(data);
      } catch (error) {
        setError(true);
        setIsLoading(false);
      } finally {
        isRequestInProgress.current = false;
      }
    };

    fetchTransaction();

    const interval = setInterval(fetchTransaction, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className=" min-h-dvh py-8 flex flex-col gap-2 items-center justify-center"
      style={{
        backgroundImage: `url(${IMAGE_DATA.background})`,
      }}
    >
      <Card className="w-[90%] max-w-[400px]">
        <CardHeader className="pb-2">
          <CardTitle className="py-2">
            <img
              src={IMAGE_DATA.simracing_logo}
              alt="logo"
              width={120}
              loading="lazy"
              className="mx-auto"
            />
          </CardTitle>
        </CardHeader>
        {isLoading ? (
          <CardContent>
            <Loader />
          </CardContent>
        ) : !error ? (
          <>
            <CardContent>
              <div className="flex items-center  py-2 pl-4 justify-between  rounded-lg gap-2 border ">
                <div className="h-full flex flex-col justify-between items-start ">
                  <div className="text-sm font-medium">
                    {transactionDetails?.data?.customer?.customerName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transactionDetails?.data?.rig?.rigName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transactionDetails?.data?.start &&
                      `Started ${format(
                        transactionDetails?.data?.start,
                        "hh:mm a"
                      )}`}
                  </div>
                </div>
                <img
                  src={IMAGE_DATA.rig}
                  alt="logo"
                  width={100}
                  loading="lazy"
                />
              </div>
              <div className="font-mono text-2xl text-primary-foreground text-center p-6 rounded-lg bg-foreground mt-6">
                {timeLapsed}
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground text-center">
              Contact the administrator to end your current session
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent>
              <div className="text-center text-3xl text-primary bg-muted font-medium border rounded-lg mt-2 p-8">
                Finished !!
              </div>
              <Button
                className="w-full mt-4"
                onClick={() => window.location.replace("about:blank")}
              >
                Close
              </Button>
            </CardContent>
            <CardFooter className="text-[10px] text-muted-foreground !text-center">
              The session has ended or you are not authorized to view this page
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default SimRacingClientMyRace;
