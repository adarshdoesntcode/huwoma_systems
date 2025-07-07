import { cn } from "@/lib/utils";
import React, { memo, useEffect, useRef, useState } from "react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import { Badge } from "./badge";
import { CheckCheck, Loader2 } from "lucide-react";
import heic2any from "heic2any";

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const FilePreviewCard = memo(({ image, previewUrl, onRemove }) => {
  const isExisting = image.type === "existing";
  const file = isExisting ? null : image.file;

  return (
    <div className="flex flex-row items-center w-full gap-4 p-2 pr-4 border shadow-md rounded-xl ">
      {previewUrl && (
        <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
          <img
            src={previewUrl}
            loading="lazy"
            alt={file ? file.name : "Uploaded image"}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 h-20 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 w-0 overflow-hidden">
            <p className="text-sm font-medium truncate text-neutral-700 ">
              {isExisting ? image.id.split("-")[0] : file?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(image.id);
            }}
            className="p-1 transition-colors rounded-full shrink-0 hover:bg-gray-200 "
          >
            <IconX className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-neutral-600 ">
          {isExisting ? (
            <div className="p-1 bg-green-500 rounded-full">
              <CheckCheck className="w-3 h-3 text-white" />
            </div>
          ) : (
            <p className="px-1.5 py-0.5 text-xs rounded-md bg-gray-100 ">
              {file?.type}
            </p>
          )}
          <Badge variant={isExisting ? "secondary" : "outline"}>
            {isExisting ? "Uploaded" : "New"}
          </Badge>
        </div>
      </div>
    </div>
  );
});

FilePreviewCard.displayName = "FilePreviewCard";

export const FileUpload = ({ images, onAddFiles, onRemoveImage }) => {
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [previews, setPreviews] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentImageIds = new Set(
      images.filter((img) => img.type === "new").map((img) => img.id)
    );

    const urlsToRevoke = [];
    const newPreviews = {};

    Object.keys(previews).forEach((id) => {
      if (currentImageIds.has(id)) {
        newPreviews[id] = previews[id];
      } else {
        urlsToRevoke.push(previews[id]);
      }
    });

    images.forEach((image) => {
      if (image.type === "new" && !newPreviews[image.id] && image.file) {
        try {
          newPreviews[image.id] = URL.createObjectURL(image.file);
        } catch (error) {
          console.error(
            "Failed to create object URL for:",
            image.file.name,
            error
          );
        }
      }
    });

    setPreviews(newPreviews);

    urlsToRevoke.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to revoke object URL:", url, error);
      }
    });

    return () => {
      Object.values(newPreviews).forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Failed to revoke object URL on cleanup:", url, error);
        }
      });
    };
  }, [images]);

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        const errors = fileRejections.map(({ file, errors }) => {
          const mainError = errors[0];
          if (mainError.code === "file-too-large")
            return `Error: ${file.name} is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`;
          if (mainError.code === "file-invalid-type")
            return `Error: ${file.name} is not a valid image type.`;
          return `Error with ${file.name}: ${mainError.message}`;
        });
        setUploadErrors(errors);
        return;
      }

      setUploadErrors([]);
      if (images.length + acceptedFiles.length > MAX_FILES) {
        setUploadErrors([`Cannot upload. Max ${MAX_FILES} files.`]);
        return;
      }

      setIsConverting(true);
      try {
        const processedFiles = await Promise.all(
          acceptedFiles.map(async (file) => {
            const isHeic =
              file.type === "image/heic" ||
              file.type === "image/heif" ||
              file.name.toLowerCase().endsWith(".heic");
            if (isHeic) {
              const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.9,
              });
              const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              return new File([convertedBlob], fileName, {
                type: "image/jpeg",
                lastModified: new Date().getTime(),
              });
            }
            return file;
          })
        );
        onAddFiles(processedFiles);
      } catch (error) {
        console.error("File processing error:", error);
        setUploadErrors([
          "Failed to process some files, especially HEIC. Please try again.",
        ]);
      } finally {
        setIsConverting(false);
      }
    },
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div
        onClick={handleClick}
        className="relative w-full p-10 transition-transform duration-200 shadow-lg cursor-pointer rounded-xl group/file"
      >
        <input {...getInputProps()} ref={fileInputRef} className="hidden" />

        {isConverting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm ">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-2 text-sm font-medium">Converting images...</p>
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans text-base font-bold text-neutral-700 dark:text-neutral-300">
            Upload Vehicle Images
          </p>
          <p className="relative z-20 mt-2 font-sans text-base font-normal text-center text-neutral-400 dark:text-neutral-400">
            Drag & drop images here, or click to select
          </p>
          <p className="relative z-20 mt-2 font-sans text-sm font-normal text-neutral-400 dark:text-neutral-400">
            JPG, PNG, WEBP, HEIC / Max 10MB
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {MAX_FILES - images.length} uploads remaining
          </p>
          {uploadErrors.length > 0 && (
            <div className="z-20 w-full max-w-xl p-4 mx-auto my-4 border rounded-md bg-destructive/10 border-destructive/20 text-destructive">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Upload Errors</h4>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadErrors([]);
                  }}
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
              <ul className="mt-2 text-sm list-disc list-inside">
                {uploadErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {!isConverting && (
            <div
              className={cn(
                "relative border  hover:scale-[1.1] shadow-xl z-40 flex items-center justify-center h-32 mt-10 w-full max-w-[8rem] mx-auto rounded-xl transition-transform duration-200",
                isDragActive &&
                  "scale-110 border-2 border-dashed border-primary"
              )}
            >
              <IconUpload className="w-8 h-8 text-neutral-400" />
            </div>
          )}

          <div className="relative w-full max-w-xl mx-auto mt-6 space-y-4">
            {images.map((image) => (
              <FilePreviewCard
                key={image.id}
                image={image}
                previewUrl={
                  image.type === "existing"
                    ? image.urls.primaryUrl
                    : previews[image.id]
                }
                onRemove={onRemoveImage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
