import { Button } from "@/components/ui/button";
import { ResumeIcon } from "@radix-ui/react-icons";
import { Loader2, LoaderIcon, PauseIcon, PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  usePauseRaceMutation,
  useResumeRaceMutation,
} from "./simRacingApiSlice";
import { toast } from "@/hooks/use-toast";

function RaceTimeLapsed({
  start,
  pauseHistory = [],
  isPaused = false,
  transactionId,
  isFetching,
  isMutating,
  setIsMutating,
  showLoader,
  setMutatingId,
}) {
  const [pauseRace] = usePauseRaceMutation();
  const [resumeRace] = useResumeRaceMutation();

  const handlePause = async () => {
    setIsMutating(true);
    setMutatingId(transactionId);
    try {
      const res = await pauseRace({ transactionId });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      // if (!res.error) {
      //   toast({
      //     title: "Race Paused!",
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

  const handleResume = async () => {
    setIsMutating(true);
    setMutatingId(transactionId);
    try {
      const res = await resumeRace({ transactionId });
      if (res.error) {
        throw new Error(res.error.data.message);
      }
      // if (!res.error) {
      //   toast({
      //     title: "Race Resumed!",
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
    <div className="flex items-center gap-4">
      <RaceTimer
        start={start}
        pauseHistory={pauseHistory}
        isPaused={isPaused}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={isPaused ? handleResume : handlePause}
        disabled={isMutating || isFetching}
      >
        {isPaused ? (
          showLoader ? (
            <LoaderIcon className="w-4 h-4 animate-spin" title="Resume" />
          ) : (
            <PlayIcon className="w-4 h-4" title="Resume" />
          )
        ) : showLoader ? (
          <LoaderIcon className="w-4 h-4 animate-spin" title="Pause" />
        ) : (
          <PauseIcon className="w-4 h-4" title="Pause" />
        )}
      </Button>
    </div>
  );
}

const RaceTimer = ({ start, pauseHistory = [], isPaused = false }) => {
  const calculateTimeLapsed = () => {
    const now = new Date();

    let totalPausedTime = 0;

    pauseHistory.forEach(({ pausedAt, resumedAt }) => {
      const paused = new Date(pausedAt);
      const resumed = resumedAt ? new Date(resumedAt) : now;
      totalPausedTime += resumed - paused;
    });

    const diffInMs = now - new Date(start) - totalPausedTime;
    const totalSeconds = Math.max(0, Math.floor(diffInMs / 1000));

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `${days > 0 ? `${days}:` : ""}${String(
      hours
    ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;

    return formattedTime;
  };

  const [timeLapsed, setTimeLapsed] = useState(calculateTimeLapsed);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;
      setTimeLapsed(calculateTimeLapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [start, pauseHistory, isPaused]);

  return <div className="text-base font-medium text-center">{timeLapsed}</div>;
};

export default RaceTimeLapsed;
