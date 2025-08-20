import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { AspectRatio } from "./ui/aspect-ratio";

export default function PhotoGallery({ photos }) {
  return (
    <PhotoProvider>
      {photos.map((photo, index) => (
        <FallbackImage key={index} image={photo} index={index} />
      ))}
    </PhotoProvider>
  );
}

export function FallbackImage({ image, index }) {
  const [src, setSrc] = useState(image.primaryUrl);
  const [errorHandled, setErrorHandled] = useState(false);

  const handleError = () => {
    if (!errorHandled && image.fallbackUrl) {
      setSrc(image.fallbackUrl);
      setErrorHandled(true);
    }
  };

  return (
    <PhotoView src={src}>
      <AspectRatio ratio={16 / 11}>
        <img
          src={src}
          alt={`Image ${index}`}
          className="object-cover w-full h-full transition-all rounded-md cursor-pointer hover:scale-105"
          onError={handleError}
          loading="lazy"
        />
      </AspectRatio>
    </PhotoView>
  );
}
