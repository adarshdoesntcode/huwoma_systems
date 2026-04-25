import { Card, CardContent, CardHeader } from "@/components/ui/card";

function PublicEntryLoadingState() {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-4xl px-4 py-4 mx-auto sm:py-10">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="w-40 rounded-md h-7 bg-slate-200 animate-pulse" />
            <div className="w-56 h-3 rounded bg-slate-100 animate-pulse [animation-delay:120ms]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-12 rounded-xl bg-slate-100 animate-pulse [animation-delay:140ms]" />
            <div className="h-24 rounded-xl bg-slate-100 animate-pulse [animation-delay:220ms]" />
            <div className="h-24 rounded-xl bg-slate-100 animate-pulse [animation-delay:300ms]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublicEntryLoadingState;
