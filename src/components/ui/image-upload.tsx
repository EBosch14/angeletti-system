"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disable?: boolean;
  value: string[];
  multipleFiles?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
  disable,
  multipleFiles,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    console.log(result);

    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-52 h-52 rounded-md overflow-hidden">
            <div className="absolute top-2 right-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemove(url)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" src={url} alt="Image" />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="bihdrzfq"
        options={{
          multiple: multipleFiles ? true : false,
          maxFiles: multipleFiles ? 10 : 1,
          folder: "ADT",
        }}>
        {(options) => {
          const onClick = () => {
            options.open();
          };
          return (
            <Button
              type="button"
              variant="secondary"
              onClick={onClick}
              disabled={disable}>
              <ImagePlusIcon className="h-4 w-4 mr-2" />
              Selecciona una imagen
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
