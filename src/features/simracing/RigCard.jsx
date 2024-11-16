import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Image } from "@unpic/react";

function RigCard({ rig, className }) {
  const canvasRef = useRef(null);
  const downloadContent = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const imageURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imageURL;
      link.download = `${rig?.rigName}_QR.png`;
      link.click();
    });
  };

  return (
    <Card
      className={cn(
        "p-2 sm:p-4 bg-[linear-gradient(to_right_bottom,rgba(256,256,256,1),rgba(256,256,256,.95),rgba(256,256,256,0.6)),url('/rig.webp')] bg-center sm:bg-none  bg-cover ",
        className
      )}
    >
      <div className="flex ">
        <div className="sm:w-8/12 w-full sm:border-r sm:pr-2 flex flex-col justify-between">
          <div>
            <CardHeader className=" p-2 pb-0 sm:pb-2 ">
              <CardTitle className="flex text-lg sm:text-2xl  items-center justify-between gap-4 ">
                <div className="flex items-center gap-4 ">{rig?.rigName}</div>
                <div>
                  <Badge
                    variant={rig?.rigStatus === "On Track" ? "" : "outline"}
                    className={rig?.rigStatus !== "On Track" ? "bg-white" : ""}
                  >
                    {rig?.rigStatus}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription className="text-xs">
                Raced by {rig?.completedPaidTransactionCount} drivers
                <br />
                On track since {format(rig?.createdAt, "MMM d, yyyy")}
              </CardDescription>
            </CardHeader>
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
                      <Image
                        src="/simracingbyhuwoma.webp"
                        priority
                        alt="Rig Image"
                        width={140}
                        aspectRatio={3 / 1}
                      />
                    </div>
                    <div className="border p-4 rounded-lg shadow-lg">
                      <QRCode
                        value={`https://huwoma.vercel.app/simracingbyhuwoma/startrace/${rig?._id}`}
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
        <div className="w-4/12 aspect-auto hidden sm:flex items-center  justify-center ">
          <Image
            src="/rig.webp"
            aspectRatio={16 / 10}
            width={200}
            priority
            alt="Rig Image"
          />
        </div>
      </div>
    </Card>
  );
}

export default RigCard;
