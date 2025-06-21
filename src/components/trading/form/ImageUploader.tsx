
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from 'react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}

const ImageUploader = ({ onUpload, isUploading }: ImageUploaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Label className="text-white mb-2 block">Upload Trade Images</Label>
      <div className="flex items-center gap-4">
        <Button type="button" onClick={handleClick} disabled={isUploading}>
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isUploading ? 'Uploading...' : 'Choose Images'}
        </Button>
        <p className="text-xs text-gray-400">Attach screenshots of your chart, setup, etc.</p>
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUploader;
