import React, { useState, useEffect } from "react";

const TimeLapsed = ({ createdAt }) => {
  const [timeLapsed, setTimeLapsed] = useState("00:00:00");

  useEffect(() => {
    const calculateTimeLapsed = () => {
      const now = new Date();
      const diffInMs = now - new Date(createdAt);

      const totalSeconds = Math.floor(diffInMs / 1000);
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

    // Set initial time immediately
    setTimeLapsed(calculateTimeLapsed());

    const interval = setInterval(() => {
      setTimeLapsed(calculateTimeLapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return <div className="text-base font-medium text-center">{timeLapsed}</div>;
};

export default TimeLapsed;
