import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentoImobiliariaUploadProps {
  onUploadSuccess: () => void;
  disabled?: boolean;
  label?: string;
  imobiliariaId: string;
  tipoDocumento: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci';
}

const DocumentoImobiliariaUpload: React.FC<DocumentoImobiliariaUploadProps> = ({ 
  onUploadSuccess, 
  disabled = false,
  label = "Upload Documento",
  imobiliariaId,
  tipoDocumento
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload do arquivo
      const result = await uploadFile(file, 'documentos-assinaturas');
      
      // Atualizar o perfil da imobiliária com o documento
      const { error } = await supabase
        .from('perfil_usuario')
        .update({ [tipoDocumento]: result.path })
        .eq('usuario_id', imobiliariaId);

      if (error) throw error;

      onUploadSuccess();
      toast({
        title: "Upload realizado!",
        description: "Documento enviado com sucesso.",
      });
      
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

export default DocumentoImobiliariaUpload;