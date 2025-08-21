"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, constructUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./render-state";
import { trpc } from "@/lib/trpc-client";

interface FileState {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface iDropzoneProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function Dropzone({ value, onChange }: iDropzoneProps) {
  const uploadFileMutation = trpc.s3.uploadFile.useMutation();
  const deleteFileMutation = trpc.s3.deleteFile.useMutation();

  const fileUrl = constructUrl(value || "");
  const [fileState, setFileState] = useState<FileState>({
    id: null,
    file: null,
    isUploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file,
          isUploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
    }));

    try {
      const result = await uploadFileMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        isImage: true,
      });

      if (!result.presignedUrl || !result.key) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setFileState((prev) => ({
              ...prev,
              progress,
            }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              isUploading: false,
              progress: 100,
              key: result.key,
            }));
            onChange?.(constructUrl(result.key));
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Failed to upload file"));
          }
        };
        xhr.onerror = () => {
          reject(new Error("Failed to upload file"));
        };
        xhr.open("PUT", result.presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("You can only upload one file");
      }
      const tooLargeFile = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (tooLargeFile) {
        toast.error("File is too large");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5MB
    onDropRejected: rejectedFiles,
    disabled: fileState.isUploading || !!fileState.objectUrl,
  });

  function renderContent() {
    if (fileState.isUploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file!}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          onDelete={deleteFile}
        />
      );
    }
    return <RenderEmptyState isDragActive />;
  }

  async function deleteFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      if (fileState.key) {
        await deleteFileMutation.mutateAsync({ key: fileState.key });
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
      onChange?.("");
      setFileState((prev) => ({
        ...prev,
        objectUrl: undefined,
        isDeleting: false,
        error: false,
        file: null,
        id: null,
        key: undefined,
        progress: 0,
      }));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        error: true,
        isDeleting: false,
      }));
    }
  }

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-48",
        isDragActive
          ? "bg-primary/10 border-primary border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
