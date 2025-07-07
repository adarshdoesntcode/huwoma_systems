import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/config";
import axios from "axios";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

function FormTwo({
  setFormStep,
  managedImages,
  setManagedImages,
  setFinalImageUrls,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector((state) => state.auth.token);

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
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/garage/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      const uploadedUrlData = response.data.data;

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
        message: "Failed to upload images",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 duration-500 slide-in-from-right-5 animate-in">
      <div className="w-full max-w-4xl mx-auto border rounded-lg border-neutral-200 ">
        <FileUpload
          images={managedImages}
          onAddFiles={handleAddFiles}
          onRemoveImage={handleRemoveImage}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => setFormStep(1)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
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

export default FormTwo;
