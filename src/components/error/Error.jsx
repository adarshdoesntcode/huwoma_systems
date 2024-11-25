import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground bg-inherit py-6 ">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-semibold ">Oops! Something went wrong.</h3>

        <div className="mt-4">
          {error && (
            <>
              <p>{error.statusText || error.message}</p>
            </>
          )}
          {JSON.stringify(error)}
        </div>
      </div>
    </div>
  );
};

export default Error;
