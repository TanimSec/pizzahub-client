"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  file: File | null;
  onChange: (file: File | null) => void;
  currentUrl?: string | null;
  fallback?: string;
}

export function AvatarPicker({ file, onChange, currentUrl, fallback = "U" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleSelect(selected?: File) {
    if (!selected) return;
    if (!ALLOWED.includes(selected.type)) return void toast.error("Use a JPG, PNG or WEBP image");
    if (selected.size > MAX_BYTES) return void toast.error("Image must be 5 MB or smaller");
    onChange(selected);
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage src={preview ?? currentUrl ?? undefined} alt="Profile preview" />
        <AvatarFallback className="bg-secondary text-lg font-semibold">{fallback}</AvatarFallback>
      </Avatar>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Camera /> {file || currentUrl ? "Change photo" : "Add photo"}
        </Button>
        {file && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
            <X /> Remove
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="sr-only"
        aria-label="Upload profile photo"
        onChange={(e) => {
          handleSelect(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
