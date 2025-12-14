import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import QRCode from "react-qr-code";

function GaragePublicPortal({ setShowShare, showShare }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCloseShare = () => {
        setShowShare(false);
        setIsCopied(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(
            `${window.location.origin}/garagebyhuwoma`
        );

        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <AlertDialog open={showShare} onOpenChange={handleCloseShare}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Copy the public portal link</AlertDialogTitle>
                    <AlertDialogDescription className="p-3 text-sm text-center break-all border rounded-md bg-muted">
                        {`${window.location.origin}/garagebyhuwoma`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-center">
                    <QRCode size={128} className="border rounded-md p-1 shadow-sm" value={`${window.location.origin}/garagebyhuwoma`} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleCopy} disabled={isCopied}>
                        {isCopied ? (
                            <>
                                Copied!
                                <Check className="w-4 h-4 ml-2" />
                            </>
                        ) : (
                            <>
                                Copy Link
                                <Copy className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                    <Button onClick={() => window.open(`${window.location.origin}/garagebyhuwoma`, "_blank")}>
                        Visit <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default GaragePublicPortal;
