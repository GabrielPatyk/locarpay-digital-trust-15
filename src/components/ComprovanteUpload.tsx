
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface ComprovanteUploadProps {
  onUploadSuccess: (filePath: string) => void;
  disabled?: boolean;
}

const ComprovanteUpload: React.FC<ComprovanteUploadProps> = ({ onUploadSuccess, disabled = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file, 'comprovantes-pagamento');
      onUploadSuccess(result.path);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          disabled={disabled}
        >
          <Upload className="mr-2 h-4 w-4" />
          Anexar Comprovante
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Anexar Comprovante de Pagamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Envie o comprovante do pagamento da sua fiança.</p>
            <ul className="mt-2 list-disc list-inside text-xs">
              <li>Formatos aceitos: JPG, PNG, PDF</li>
              <li>Tamanho máximo: 3MB</li>
            </ul>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <Button 
              onClick={handleButtonClick}
              disabled={isUploading}
              className="mb-2"
            >
              {isUploading ? 'Enviando...' : 'Selecionar Arquivo'}
            </Button>
            <p className="text-xs text-gray-500">
              Clique para selecionar o arquivo
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComprovanteUpload;
