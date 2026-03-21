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
    const publicPortalUrl = `${window.location.origin}/garagebyhuwoma`;

    const handleCloseShare = () => {
        setShowShare(false);
        setIsCopied(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(publicPortalUrl);

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
                        {publicPortalUrl}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-center">
                    <QRCode size={128} className="border rounded-md p-1 shadow-sm" value={publicPortalUrl} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleCopy} variant="outline" disabled={isCopied}>
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
                    <Button asChild className="mb-2 sm:ml-2">
                        <a
                            href={publicPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer external"
                        >
                            Visit <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default GaragePublicPortal;
