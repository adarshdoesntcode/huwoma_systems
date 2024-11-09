import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Dot, Edit, QrCode, Wrench } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";

function RigCard({ rig, className }) {
  const canvasRef = useRef(null);
  const downloadContent = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const imageURL = canvas.toDataURL("image/png");

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `${rig?.rigName}_QR.png`;
      link.click();
    });
  };

  return (
    <Card className={cn("p-2 sm:p-4", className)}>
      <div className="flex">
        <div className="w-8/12 border-r pr-2 flex flex-col justify-between">
          <div>
            <CardHeader className=" p-2 ">
              <CardTitle className="flex items-center justify-between gap-4 ">
                <div className="flex items-center gap-4 ">{rig?.rigName}</div>
                <div>
                  <Badge
                    variant={rig?.rigStatus === "On Track" ? "" : "outline"}
                  >
                    {rig?.rigStatus}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 text-muted-foreground text-xs  ">
              <p>Raced by {rig?.rigTransactions?.length} drivers</p>
              <p>On track since {format(rig?.createdAt, "MMM d, yyyy")}</p>
            </CardContent>
          </div>
          <div className="flex justify-between items-end p-2  pb-1">
            <Dot
              strokeWidth={15}
              className={cn(
                "w-5 h-5 text-muted-foreground transition-all",
                rig?.rigStatus === "On Track"
                  ? "text-green-500  drop-shadow-md "
                  : ""
              )}
            />
            <Dialog>
              <DialogTrigger asChild>
                <QrCode className="hover:scale-110 cursor-pointer transition-all" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle></DialogTitle>
                  <DialogDescription></DialogDescription>

                  <div
                    ref={canvasRef}
                    className="flex flex-col items-center justify-center gap-8 p-6"
                  >
                    <div>
                      <img
                        src="/simracingbyhuwoma.webp"
                        className="w-1/3 mx-auto"
                      />
                    </div>
                    <div className="border p-4 rounded-lg shadow-lg">
                      <QRCode
                        value={`https://huwoma.vercel.app/race/${rig?._id}`}
                      />
                    </div>
                    <div className="font-medium uppercase">{rig?.rigName}</div>
                  </div>
                  <Button onClick={downloadContent}>Download QR</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="w-4/12 aspect-auto flex items-center justify-center">
          <img src="rig.webp" />
        </div>
      </div>
    </Card>
  );
}

export default RigCard;
