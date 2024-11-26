import { Button } from "../ui/button";

function ApiError({ error, refetch }) {
  console.error(error);
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground bg-inherit  py-6 ">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-semibold ">Oops! Something went wrong.</h3>
        <p className="text-sm text-muted-foreground">
          {error.status || `STATUS ${error.originalStatus}`}
        </p>
        {error?.data?.message && (
          <div className="mt-4"> {JSON.stringify(error?.data?.message)}</div>
        )}

        {refetch && (
          <Button
            className="mt-4"
            size="sm"
            onClick={() => {
              refetch();
            }}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}

export default ApiError;
