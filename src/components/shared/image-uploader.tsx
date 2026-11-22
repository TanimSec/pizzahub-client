"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { errorMessage } from "@/lib/api-error";
import { uploadImage } from "@/lib/uploads";
import { Spinner } from "./spinner";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  error?: string;
}

export function ImageUploader({ value, onChange, max = 5, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    if (room <= 0) return void toast.error(`You can upload up to ${max} images`);
    const picked = Array.from(files).slice(0, room);
    const uploaded: string[] = [];

    for (const file of picked) {
      if (!ALLOWED.includes(file.type)) {
        toast.error(`${file.name}: use a JPG, PNG or WEBP image`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name}: image must be 5 MB or smaller`);
        continue;
      }
      setUploading((n) => n + 1);
      try {
        uploaded.push(await uploadImage(file));
      } catch (err) {
        toast.error(`Upload failed for ${file.name}: ${errorMessage(err)}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (uploaded.length) onChange([...value, ...uploaded]);
  }

  return (
    <div className="space-y-2">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {value.map((url, i) => (
          <li key={url} className="relative aspect-square overflow-hidden rounded-xl border bg-secondary">
            <Image src={url} alt={`Uploaded image ${i + 1}`} fill sizes="160px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              aria-label={`Remove image ${i + 1}`}
              className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow hover:bg-destructive hover:text-white"
            >
              <X className="size-4" />
            </button>
            {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">Cover</span>}
          </li>
        ))}
        {value.length < max && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading > 0}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
            >
              {uploading > 0 ? <Spinner className="size-6" /> : <ImagePlus className="size-6" />}
              {uploading > 0 ? "Uploading..." : "Add image"}
            </button>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        multiple
        className="sr-only"
        aria-label="Upload menu item images"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP up to 5 MB. {value.length}/{max} images. The first image is the cover.
      </p>
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
