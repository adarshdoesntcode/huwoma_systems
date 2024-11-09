import React, { useState, useEffect } from "react";

const TimeLapsed = ({ createdAt }) => {
  const [timeLapsed, setTimeLapsed] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLapsed = new Date(now - createdAt);
      const hours = String(timeLapsed.getUTCHours()).padStart(2, "0");
      const minutes = String(timeLapsed.getUTCMinutes()).padStart(2, "0");
      const seconds = String(timeLapsed.getUTCSeconds()).padStart(2, "0");
      const formattedTimeLapsed = `${hours}:${minutes}:${seconds}`;
      setTimeLapsed(formattedTimeLapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  return <div className="font-medium text-base text-center">{timeLapsed}</div>;
};

export default TimeLapsed;
