import { UploadDropzone } from "@/utils/uploadthing";
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";

export function ImageUploader({ value, onChange }: { value?: string; onChange: (url?: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {error &&
        <div className="text-center text-red-500 font-semibold">{error}</div>
      }
      {value ? (
        <div className="relative group">
          <div className="flex items-center relative justify-center">
            <Image
              src={value}
              alt="Profile image"
              width={90}
              height={90}
              quality={90}
              sizes="100vw"
              className="rounded-full object-cover aspect-square relative"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-0 right-10 group-hover:opacity-100 transition-opacity"
              onClick={() => onChange(undefined)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <UploadDropzone
            endpoint="profileImage"
            className="w-48 h-32"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              if (res?.[0]?.ufsUrl) {
                onChange(res[0].ufsUrl);
                setError(null);
              } else {
                setError("O upload foi concluído, mas não retornou uma URL");
              }
              setIsUploading(false);
            }}
            appearance={{
              label: "text-primary hover:text-primary/90",
              uploadIcon: "text-primary",
            }}
          />

        </div>
      )}
      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader className="h-4 w-4 animate-spin" />
          <span>Enviando imagem...</span>
        </div>
      )}
    </div>
  );
}