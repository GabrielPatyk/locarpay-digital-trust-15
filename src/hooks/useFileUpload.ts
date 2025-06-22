
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, path: string) => {
    setIsUploading(true);
    try {
      // Verificar tamanho do arquivo (máximo 3MB)
      if (file.size > 3 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo permitido: 3MB');
      }

      // Verificar tipo do arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Aceitos: JPG, PNG, PDF');
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, file);

      if (error) throw error;

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      toast({
        title: "Upload realizado com sucesso!",
        description: "Comprovante enviado e aguardando verificação.",
      });

      return { path: filePath, url: urlData.publicUrl };
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};
