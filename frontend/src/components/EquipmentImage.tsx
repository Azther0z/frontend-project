"use client";

import Image from "next/image";
import { useState } from "react";
import { imageSourceUrl, imageUrlError } from "@/libs/image-url";

export default function EquipmentImage({ src, name, loading = "lazy", onStatusChange }: {
  src: string;
  name: string;
  loading?: "eager" | "lazy";
  onStatusChange?: (status: "loaded" | "error") => void;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  if (imageUrlError(src) || status === "error") {
    return <div aria-label={`Image unavailable for ${name}`} className="equipment-image-frame equipment-image-fallback" role="img">Image unavailable</div>;
  }
  return <figure className="equipment-image-frame">
    <Image
      alt={name}
      className="equipment-image"
      height={500}
      loading={loading}
      onError={() => { setStatus("error"); onStatusChange?.("error"); }}
      onLoad={() => { setStatus("loaded"); onStatusChange?.("loaded"); }}
      referrerPolicy="no-referrer"
      src={imageSourceUrl(src)}
      // User-provided hosts load directly in the browser, without a server image proxy.
      unoptimized
      width={800}
    />
    {status === "loading" && <figcaption>Loading image…</figcaption>}
  </figure>;
}
