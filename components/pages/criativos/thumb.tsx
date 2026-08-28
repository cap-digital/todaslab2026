"use client";

import { useState } from "react";
import { Flower } from "@/components/ui";

/**
 * Thumbnail de anúncio com fallback: as URLs vêm de CDNs variados do Facebook
 * (por isso <img> nativa + referrerPolicy). Se quebrar (ou não existir),
 * mostra um gradiente da marca com uma Flower lilás.
 */
export function Thumb({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-green-soft to-purple-soft ${className}`}
      >
        <Flower className="h-14 w-14 text-lilac" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setBroken(true)}
      className={`object-cover ${className}`}
    />
  );
}
