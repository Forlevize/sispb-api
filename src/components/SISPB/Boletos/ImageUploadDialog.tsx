
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (imageUrl: string) => void;
}

export default function ImageUploadDialog({ open, onOpenChange, onConfirm }: ImageUploadDialogProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to select a file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.includes('image/')) {
        toast.error("Tipo de arquivo inválido", {
          description: "Por favor, selecione apenas arquivos de imagem."
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "O tamanho máximo permitido é 5MB."
        });
        return;
      }

      // Create preview URL
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  // Function to confirm upload
  const handleConfirmUpload = () => {
    if (previewImage) {
      onConfirm(previewImage);
    } else {
      toast.error("Nenhuma imagem selecionada");
    }
  };

  // Reset preview when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anexar Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            {previewImage ? (
              <div className="relative w-full max-w-md">
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[300px] object-contain rounded-md"
                />
                <Button 
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-white"
                  onClick={() => {
                    setPreviewImage(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Clique para selecionar ou arraste uma imagem</p>
                <p className="text-xs text-gray-500">PNG, JPG ou JPEG (máx. 5MB)</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={previewImage ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
              onChange={handleFileSelect}
            />
            
            {!previewImage && (
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar Arquivo
              </Button>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmUpload}
            disabled={!previewImage}
            className="bg-[#00c6a7] hover:bg-[#00c6a7]/90"
          >
            Confirmar Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
