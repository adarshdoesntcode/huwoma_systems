import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { UploadProgressCard } from "@/components/ui/upload-progress-card";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";
import {
    getVehicleImageUploadErrorMessage,
    uploadVehicleImages,
} from "@/lib/vehicleImageUpload";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";

function PublicVehicleImagesForm({
    setFormStep,
    managedImages,
    setManagedImages,
    setFinalImageUrls,
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);

    const handleAddFiles = (newFiles) => {
        const newImageItems = newFiles.map((file) => ({
            id: `${file.name}-${crypto.randomUUID()}`,
            type: "new",
            file: file,
        }));
        setManagedImages((prev) => [...prev, ...newImageItems]);
    };

    const handleRemoveImage = (idToRemove) => {
        setManagedImages((prev) => prev.filter((image) => image.id !== idToRemove));
    };

    const handleNext = async () => {
        if (isUploading) {
            return;
        }

        if (managedImages.length === 0) {
            toast({
                title: "Error",
                description: "Please upload at least one image",
                variant: "destructive",
            });
            return;
        }

        const filesToUpload = managedImages
            .filter((img) => img.type === "new")
            .map((img) => img.file);

        if (filesToUpload.length === 0) {
            const finalUrls = managedImages.map((img) => img.urls);
            setFinalImageUrls(finalUrls);
            setFormStep(3);
            return;
        }

        setIsUploading(true);
        setUploadProgress({
            phase: "starting",
            percent: 0,
            uploadedFiles: 0,
            totalFiles: filesToUpload.length,
            currentBatch: 0,
            totalBatches: 0,
        });

        try {
            const uploadedUrlData = await uploadVehicleImages({
                files: filesToUpload,
                url: `${API_BASE_URL}/garage/public-upload-image`,
                onProgress: (progressData) => {
                    setUploadProgress(progressData);
                },
            });

            let uploadIndex = 0;
            const fullyUpdatedImages = managedImages.map((image) => {
                if (image.type === "new") {
                    const newUrlData = uploadedUrlData[uploadIndex];
                    uploadIndex++;
                    return {
                        id: image.id,
                        type: "existing",
                        urls: newUrlData,
                    };
                }
                return image;
            });

            setManagedImages(fullyUpdatedImages);

            const finalUrls = fullyUpdatedImages.map((img) => img.urls);
            setFinalImageUrls(finalUrls);
            setFormStep(3);
        } catch (error) {
            toast({
                title: "Error",
                description: getVehicleImageUploadErrorMessage(error),
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(null);
        }
    };

    return (
        <div className="flex flex-col gap-4 duration-500 slide-in-from-right-5 animate-in">
            {isUploading ? <UploadProgressCard progress={uploadProgress} /> : null}
            <div className="w-full max-w-4xl mx-auto border rounded-lg border-neutral-200">
                <FileUpload
                    images={managedImages}
                    onAddFiles={handleAddFiles}
                    onRemoveImage={handleRemoveImage}
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => setFormStep(1)}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button type="button" onClick={handleNext} disabled={isUploading}>
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

export default PublicVehicleImagesForm;
