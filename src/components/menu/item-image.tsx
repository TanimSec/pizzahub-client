"use client";

import Image from "next/image";
import { useState } from "react";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ItemImage({ src, alt, className, priority, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-secondary text-primary/60", className)} role="img" aria-label={alt}>
        <Pizza className="size-10" />
      </div>
    );
  }
  return (
    <div className={cn("relative overflow-hidden bg-secondary", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} className="object-cover" />
    </div>
  );
}
