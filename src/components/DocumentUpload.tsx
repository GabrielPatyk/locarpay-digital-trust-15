import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onUploadSuccess: (filePath: string) => void;
  disabled?: boolean;
  label?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onUploadSuccess, 
  disabled = false,
  label = "Upload Documento"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, 'documentos-assinaturas');
      onUploadSuccess(result.path);
      toast({
        title: "Upload realizado!",
        description: "Documento enviado com sucesso.",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o documento.",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button 
        variant="outline"
        size="sm"
        onClick={handleButtonClick}
        disabled={disabled || isUploading}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? 'Enviando...' : label}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

export default DocumentUpload;