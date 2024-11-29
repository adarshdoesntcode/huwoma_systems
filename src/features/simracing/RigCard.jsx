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
import { IMAGE_DATA } from "@/lib/config";

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
      style={{
        backgroundImage: `linear-gradient(to right bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)), url('${IMAGE_DATA.rig}')`,
      }}
      className={cn("p-2 sm:p-4 bg-center sm:!bg-none  bg-cover ", className)}
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
                Active Racer : {rig?.activeRacer?.customerName}
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
                    className="flex flex-col animate-in  fade-in duration-500 items-center justify-center gap-8 p-6"
                  >
                    <div>
                      <img
                        src={IMAGE_DATA.simracing_logo}
                        alt="Sim Racing Logo"
                        width={140}
                        height={50}
                        loading="lazy"
                      />
                    </div>
                    <div className="border p-4 rounded-lg shadow-lg ">
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
        <div className="w-4/12 aspect-auto hidden sm:flex animate-in  fade-in duration-500 items-center  justify-center ">
          <img
            src={IMAGE_DATA.rig}
            loading="lazy"
            width={200}
            height={125}
            alt="Rig Image"
          />
        </div>
      </div>
    </Card>
  );
}

export default RigCard;
