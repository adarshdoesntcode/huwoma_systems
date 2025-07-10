import { useState } from "react";

export default function SmartImage({
  primaryUrl,
  fallbackUrl,
  alt = "",
  className = "",
}) {
  const [src, setSrc] = useState(primaryUrl);
  const [hasErrored, setHasErrored] = useState(false);

  const handleError = () => {
    if (!hasErrored && fallbackUrl) {
      setSrc(fallbackUrl);
      setHasErrored(true);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}
