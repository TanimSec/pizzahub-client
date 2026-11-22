"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ItemImage } from "./item-image";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [undefined];
  return (
    <div className="space-y-3">
      <ItemImage src={list[active]} alt={alt} priority sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full rounded-2xl border" />
      {list.length > 1 && (
        <ul className="grid grid-cols-5 gap-2" aria-label="Item images">
          {list.map((src, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn("block w-full overflow-hidden rounded-lg border-2 transition-colors", i === active ? "border-primary" : "border-transparent hover:border-primary/40")}
              >
                <ItemImage src={src} alt={`${alt} thumbnail ${i + 1}`} sizes="120px" className="aspect-square w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
