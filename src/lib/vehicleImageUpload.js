import axios from "axios";

export const MAX_VEHICLE_IMAGE_FILE_SIZE_MB = 4;
export const MAX_VEHICLE_IMAGE_FILE_SIZE_BYTES =
  MAX_VEHICLE_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_MB = 30;
export const MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_BYTES =
  MAX_RAW_VEHICLE_IMAGE_FILE_SIZE_MB * 1024 * 1024;
export const MAX_VEHICLE_IMAGE_BATCH_SIZE_BYTES =
  MAX_VEHICLE_IMAGE_FILE_SIZE_BYTES;
const TARGET_VEHICLE_IMAGE_FILE_SIZE_BYTES = Math.floor(
  MAX_VEHICLE_IMAGE_FILE_SIZE_BYTES * 0.95
);

const AUTO_OPTIMIZE_MAX_DIMENSION = 2048;
const MIN_COMPRESSION_QUALITY = 0.4;
const QUALITY_STEP = 0.08;
const SCALE_STEP = 0.85;
const MIN_SCALE = 0.2;
const MAX_OPTIMIZATION_ATTEMPTS = 14;

const toJpegFileName = (fileName) => {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  return `${baseName}.jpg`;
};

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    image.src = objectUrl;
  });
};

const createJpegBlob = async (image, width, height, quality) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to initialize image compression.");
  }

  // Force a white background so transparent PNG/WebP don't get black fill in JPEG output.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to compress image."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality
    );
  });
};

export const optimizeVehicleImageForUpload = async (file) => {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.size <= TARGET_VEHICLE_IMAGE_FILE_SIZE_BYTES) {
    return file;
  }

  const image = await loadImage(file);
  const sourceWidth = image.naturalWidth;
  const sourceHeight = image.naturalHeight;
  const largestSide = Math.max(sourceWidth, sourceHeight);
  const initialScale =
    largestSide > AUTO_OPTIMIZE_MAX_DIMENSION
      ? AUTO_OPTIMIZE_MAX_DIMENSION / largestSide
      : 1;

  let scale = initialScale;
  let quality = 0.86;
  let bestBlob = null;

  for (let attempt = 0; attempt < MAX_OPTIMIZATION_ATTEMPTS; attempt++) {
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const blob = await createJpegBlob(image, width, height, quality);

    if (!bestBlob || blob.size < bestBlob.size) {
      bestBlob = blob;
    }

    if (blob.size <= TARGET_VEHICLE_IMAGE_FILE_SIZE_BYTES) {
      return new File([blob], toJpegFileName(file.name), {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }

    if (quality > MIN_COMPRESSION_QUALITY) {
      quality = Math.max(MIN_COMPRESSION_QUALITY, quality - QUALITY_STEP);
    } else {
      scale *= SCALE_STEP;
      if (scale < MIN_SCALE) {
        break;
      }
    }
  }

  if (bestBlob && bestBlob.size <= MAX_VEHICLE_IMAGE_FILE_SIZE_BYTES) {
    return new File([bestBlob], toJpegFileName(file.name), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }

  throw new Error(
    `Could not optimize ${file.name} enough for upload. Please use a smaller image.`
  );
};

const createUploadBatches = (
  files,
  maxBatchSizeBytes = MAX_VEHICLE_IMAGE_BATCH_SIZE_BYTES
) => {
  const batches = [];
  let currentBatch = [];
  let currentBatchSize = 0;

  files.forEach((file) => {
    if (file.size > MAX_VEHICLE_IMAGE_FILE_SIZE_BYTES) {
      throw new Error(
        `${file.name} is too large. Max size is ${MAX_VEHICLE_IMAGE_FILE_SIZE_MB}MB.`
      );
    }

    if (
      currentBatch.length > 0 &&
      currentBatchSize + file.size > maxBatchSizeBytes
    ) {
      batches.push(currentBatch);
      currentBatch = [];
      currentBatchSize = 0;
    }

    currentBatch.push(file);
    currentBatchSize += file.size;
  });

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
};

export const uploadVehicleImages = async ({
  files,
  url,
  headers = {},
  withCredentials = false,
  onProgress,
}) => {
  const batches = createUploadBatches(files);
  const uploadedImageUrls = [];
  const totalFiles = files.length;
  const totalBatches = batches.length;
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  let uploadedFiles = 0;
  let uploadedBytes = 0;

  const emitProgress = (payload) => {
    if (!onProgress) {
      return;
    }
    const normalizedPercent = Math.max(0, Math.min(100, payload.percent || 0));
    onProgress({
      ...payload,
      percent: normalizedPercent,
    });
  };

  emitProgress({
    phase: "starting",
    percent: 0,
    uploadedFiles,
    totalFiles,
    currentBatch: 0,
    totalBatches,
  });

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const formData = new FormData();
    const batchBytes = batch.reduce((sum, file) => sum + file.size, 0);
    batch.forEach((file) => {
      formData.append("files", file);
    });

    emitProgress({
      phase: "uploading",
      percent: totalBytes ? (uploadedBytes / totalBytes) * 100 : 0,
      uploadedFiles,
      totalFiles,
      currentBatch: batchIndex + 1,
      totalBatches,
    });

    const response = await axios.post(url, formData, {
      headers,
      withCredentials,
      onUploadProgress: (event) => {
        const loadedInBatch = Math.min(event.loaded || 0, batchBytes);
        const sentBytes = uploadedBytes + loadedInBatch;
        emitProgress({
          phase: "uploading",
          percent: totalBytes ? (sentBytes / totalBytes) * 100 : 0,
          uploadedFiles,
          totalFiles,
          currentBatch: batchIndex + 1,
          totalBatches,
        });
      },
    });

    uploadedImageUrls.push(...(response.data?.data || []));
    uploadedFiles += batch.length;
    uploadedBytes += batchBytes;

    emitProgress({
      phase: "uploading",
      percent: totalBytes ? (uploadedBytes / totalBytes) * 100 : 100,
      uploadedFiles,
      totalFiles,
      currentBatch: batchIndex + 1,
      totalBatches,
    });
  }

  emitProgress({
    phase: "complete",
    percent: 100,
    uploadedFiles: totalFiles,
    totalFiles,
    currentBatch: totalBatches,
    totalBatches,
  });

  return uploadedImageUrls;
};

export const getVehicleImageUploadErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Failed to upload images. Please try smaller files."
  );
};
