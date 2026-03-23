import { cn } from "@/lib/utils";
import {
  MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_BYTES,
  MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_MB,
  MAX_VEHICLE_IMAGE_FILE_SIZE_MB,
  optimizeVehicleImageForUpload,
} from "@/lib/vehicleImageUpload";
import React, { memo, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Badge } from "./badge";
import {
  Camera,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image,
  Loader2,
  X,
} from "lucide-react";
import heic2any from "heic2any";
import { isMobile } from "react-device-detect";

const MAX_FILES = 10;

const FilePreviewCard = memo(
  ({
    image,
    previewUrl,
    onRemove,
    isFrontCover,
    draggableEnabled,
    isDragOver,
    isDragging,
    canMoveUp,
    canMoveDown,
    onMoveUp,
    onMoveDown,
    onDragStart,
    onDragEnter,
    onDragEnd,
    onDrop,
  }) => {
    const isExisting = image.type === "existing";
    const file = isExisting ? null : image.file;

    return (
      <div
        draggable={draggableEnabled}
        onDragStart={(e) => onDragStart(e, image.id)}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => onDragEnter(image.id)}
        onDrop={(e) => onDrop(e, image.id)}
        onDragEnd={onDragEnd}
        className={cn(
          "relative flex flex-row items-center w-full gap-4 p-2 pr-12 border shadow-md rounded-xl transition-colors",
          draggableEnabled && "cursor-grab active:cursor-grabbing",
          isDragOver && "border-primary ring-1 ring-primary/30",
          isDragging && "opacity-60",
        )}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="absolute p-1 transition-colors rounded-full right-2 top-2 shrink-0 hover:bg-gray-200 "
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
        {draggableEnabled ? (
          <div className="items-center justify-center hidden sm:flex text-neutral-400">
            <GripVertical className="w-4 h-4" />
          </div>
        ) : null}
        {previewUrl && (
          <div className="relative w-20 h-20 overflow-hidden rounded-lg shrink-0">
            <img
              src={previewUrl}
              loading="lazy"
              alt={file ? file.name : "Uploaded image"}
              className="object-cover w-full h-full"
            />
            {isFrontCover ? (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                Front
              </span>
            ) : null}
          </div>
        )}
        <div className="flex flex-col justify-between flex-1 h-20 overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="flex-1 w-0 overflow-hidden">
              <Badge variant={isExisting ? "secondary" : "outline"}>
                {isExisting ? "Uploaded" : "New"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-neutral-600 ">
            {isExisting ? (
              <p className="px-1.5 py-0.5 text-xs rounded-md bg-gray-100 ">
                image/{image.urls.primaryUrl.split(".").pop()}
              </p>
            ) : (
              <p className="px-1.5 py-0.5 text-xs rounded-md bg-gray-100 ">
                {file?.type}
              </p>
            )}
          </div>
        </div>
        {draggableEnabled ? (
          <div className="absolute flex items-center gap-1 right-2 bottom-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(image.id);
              }}
              disabled={!canMoveUp}
              aria-label="Move image up"
              className={cn(
                "rounded-md p-1 transition-colors",
                canMoveUp
                  ? "text-neutral-500 hover:bg-gray-200"
                  : "cursor-not-allowed text-neutral-300",
              )}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(image.id);
              }}
              disabled={!canMoveDown}
              aria-label="Move image down"
              className={cn(
                "rounded-md p-1 transition-colors",
                canMoveDown
                  ? "text-neutral-500 hover:bg-gray-200"
                  : "cursor-not-allowed text-neutral-300",
              )}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);

FilePreviewCard.displayName = "FilePreviewCard";

export const FileUpload = ({
  images,
  onAddFiles,
  onRemoveImage,
  onReorderImages,
}) => {
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [previews, setPreviews] = useState({});
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [dragOverImageId, setDragOverImageId] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    const currentImageIds = new Set(
      images.filter((img) => img.type === "new").map((img) => img.id),
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
            error,
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
  const handleGalleryClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    galleryInputRef.current?.click();
  };
  const handleCameraClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    cameraInputRef.current?.click();
  };

  const handleDragStart = (event, imageId) => {
    if (!onReorderImages) {
      return;
    }
    event.stopPropagation();
    setDraggedImageId(imageId);
  };

  const handleDragEnter = (imageId) => {
    if (!onReorderImages || !draggedImageId || draggedImageId === imageId) {
      return;
    }
    setDragOverImageId(imageId);
  };

  const handleDrop = (event, targetImageId) => {
    event.preventDefault();
    event.stopPropagation();
    if (
      onReorderImages &&
      draggedImageId &&
      targetImageId &&
      draggedImageId !== targetImageId
    ) {
      onReorderImages(draggedImageId, targetImageId);
    }
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  const handleDragEnd = (event) => {
    event.stopPropagation();
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  const handleMoveImage = (imageId, direction) => {
    if (!onReorderImages) {
      return;
    }
    const currentIndex = images.findIndex((image) => image.id === imageId);
    if (currentIndex < 0) {
      return;
    }

    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const targetImageId = images[targetIndex]?.id;
    if (!targetImageId) {
      return;
    }

    onReorderImages(imageId, targetImageId);
  };

  const processFiles = async (acceptedFiles) => {
    if (images.length + acceptedFiles.length > MAX_FILES) {
      setUploadErrors([`Cannot upload. Max ${MAX_FILES} files.`]);
      return;
    }

    setIsConverting(true);
    try {
      const processedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          let normalizedFile = file;
          const isHeic =
            file.type === "image/heic" ||
            file.type === "image/heif" ||
            file.name.toLowerCase().endsWith(".heic") ||
            file.name.toLowerCase().endsWith(".heif");

          if (isHeic) {
            const convertedResult = await heic2any({
              blob: normalizedFile,
              toType: "image/jpeg",
              quality: 0.9,
            });
            const convertedBlob = Array.isArray(convertedResult)
              ? convertedResult[0]
              : convertedResult;
            const fileName =
              normalizedFile.name.replace(/\.[^/.]+$/, "") + ".jpg";
            normalizedFile = new File([convertedBlob], fileName, {
              type: "image/jpeg",
              lastModified: new Date().getTime(),
            });
          }

          return optimizeVehicleImageForUpload(normalizedFile);
        }),
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
  };

  const handleCameraCapture = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadErrors([]);
      await processFiles(files);
    }
    // Reset input to allow capturing the same file again
    e.target.value = "";
  };

  const handleGallerySelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadErrors([]);
      await processFiles(files);
    }
    e.target.value = "";
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        const errors = fileRejections.map(({ file, errors }) => {
          const mainError = errors[0];
          if (mainError.code === "file-too-large")
            return `Error: ${file.name} is too large. Max size is ${MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_MB}MB.`;
          if (mainError.code === "file-invalid-type")
            return `Error: ${file.name} is not a valid image type.`;
          return `Error with ${file.name}: ${mainError.message}`;
        });
        setUploadErrors(errors);
        return;
      }

      setUploadErrors([]);
      await processFiles(acceptedFiles);
    },
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
    maxSize: MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_BYTES,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <div
        onClick={(e) => {
          // Prevent triggering file select if camera button was clicked
          if (
            e.target.closest("[data-camera-button]") ||
            e.target.closest("[data-gallery-button]") ||
            e.target.closest("[data-upload-list]")
          ) {
            return;
          }
          if (isMobile) {
            return;
          }
          handleClick();
        }}
        className="relative w-full p-4 transition-transform duration-200 bg-white shadow-sm cursor-pointer sm:p-10 rounded-xl group/file"
      >
        <input {...getInputProps()} ref={fileInputRef} className="hidden" />

        {/* Hidden camera input for mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGallerySelect}
          className="hidden"
        />

        {isConverting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm ">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="mt-2 text-sm font-medium">Optimizing images...</p>
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
            JPG, PNG, WEBP, HEIC / Originals up to{" "}
            {MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_MB}MB
          </p>
          <p className="relative z-20 mt-1 font-sans text-xs font-normal text-center text-neutral-400 dark:text-neutral-400">
            We auto-optimize each photo to fit {MAX_VEHICLE_IMAGE_FILE_SIZE_MB}
            MB upload limits
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
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul className="mt-2 text-sm list-disc list-inside">
                {uploadErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload and Camera buttons */}
          <div className="flex items-center justify-center w-full gap-4 mt-10">
            <div
              data-gallery-button
              onClick={handleGalleryClick}
              className={cn(
                "relative border hover:scale-[1.1] shadow-xl z-40 flex items-center justify-center h-32 w-full max-w-[8rem] rounded-xl transition-transform duration-200",
                isDragActive &&
                  "scale-110 border-2 border-dashed border-primary",
              )}
            >
              <Image className="w-8 h-8 text-neutral-400" />
            </div>

            {/* Camera button - only visible on mobile */}
            {isMobile && (
              <div
                data-camera-button
                onClick={handleCameraClick}
                className="relative border hover:scale-[1.1] shadow-xl z-40 flex flex-col items-center justify-center h-32 w-full max-w-[8rem] rounded-xl transition-transform duration-200 "
              >
                <Camera className="w-8 h-8 text-neutral-400" />
              </div>
            )}
          </div>

          <div
            data-upload-list
            className="relative w-full max-w-xl p-4 mx-auto mt-10 border rounded-xl border-neutral-200 bg-neutral-50/70 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-neutral-700">
                Image Order
              </p>
              <p className="text-xs text-muted-foreground">
                First image becomes cover
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {images.length === 0 ? (
                <div className="px-4 py-6 text-sm text-center bg-white border border-dashed rounded-lg border-neutral-300 text-neutral-500">
                  Uploaded images will appear here
                </div>
              ) : null}
              {images.map((image, imageIndex) => {
                return (
                  <FilePreviewCard
                    key={image.id}
                    image={image}
                    previewUrl={
                      image.type === "existing"
                        ? image.urls.primaryUrl
                        : previews[image.id]
                    }
                    isFrontCover={images[0]?.id === image.id}
                    draggableEnabled={Boolean(onReorderImages)}
                    isDragOver={dragOverImageId === image.id}
                    isDragging={draggedImageId === image.id}
                    canMoveUp={imageIndex > 0}
                    canMoveDown={imageIndex < images.length - 1}
                    onMoveUp={(id) => handleMoveImage(id, "up")}
                    onMoveDown={(id) => handleMoveImage(id, "down")}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onRemove={onRemoveImage}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
