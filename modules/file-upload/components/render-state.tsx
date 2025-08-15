"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <p>{progress.toFixed(0)}%</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading ...</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  onDelete,
  isDeleting,
}: {
  previewUrl: string;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div>
      <Image
        src={previewUrl}
        alt="preview"
        fill
        className="object-contain p-2"
      />
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>
      <p className="text-sm text-muted-foreground">
        Something went wrong while uploading your file.
      </p>
      <Button variant="outline" className="mt-4" type="button">
        Try Again
      </Button>
    </div>
  );
}

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Drop your file here or{" "}
        <span className="text-primary font-medium cursor-pointer">
          click to upload
        </span>
      </p>
      <Button variant="outline" className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
}
