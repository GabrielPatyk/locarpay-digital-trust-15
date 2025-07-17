
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MediaUploadProps {
  onMediasChange: (urls: string[]) => void;
  initialMedias?: string[];
  maxFiles?: number;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onMediasChange, 
  initialMedias = [], 
  maxFiles = 5 
}) => {
  const [medias, setMedias] = useState<string[]>(initialMedias);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Função para sanitizar nome do arquivo
  const sanitizeFileName = (fileName: string): string => {
    // Remove caracteres especiais e acentos, mantém apenas letras, números, pontos e hifens
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Substitui caracteres especiais por underscore
      .toLowerCase();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;
    
    if (medias.length + files.length > maxFiles) {
      toast({
        title: "Limite excedido",
        description: `Você pode enviar no máximo ${maxFiles} mídias.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Verificar tamanho do arquivo (máximo 3MB)
        if (file.size > 3 * 1024 * 1024) {
          throw new Error(`Arquivo ${file.name} muito grande. Máximo permitido: 3MB`);
        }

        // Verificar tipo do arquivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Tipo de arquivo não permitido para ${file.name}. Aceitos: JPG, PNG, WEBP`);
        }

        // Sanitizar nome do arquivo
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileName = `${Date.now()}-${Math.random()}-${sanitizedFileName}`;
        const filePath = `${user?.id}/${fileName}`;

        console.log('Fazendo upload do arquivo:', filePath);

        const { data, error } = await supabase.storage
          .from('imoveis-midias')
          .upload(filePath, file);

        if (error) {
          console.error('Erro no upload:', error);
          throw error;
        }

        console.log('Upload realizado com sucesso:', data);

        const { data: urlData } = supabase.storage
          .from('imoveis-midias')
          .getPublicUrl(filePath);

        console.log('URL pública gerada:', urlData.publicUrl);
        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newMedias = [...medias, ...uploadedUrls];
      
      setMedias(newMedias);
      onMediasChange(newMedias);

      toast({
        title: "Upload realizado com sucesso!",
        description: `${uploadedUrls.length} mídia(s) enviada(s).`,
      });
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Limpar o input para permitir selecionar os mesmos arquivos novamente se necessário
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMedia = async (urlToRemove: string, index: number) => {
    try {
      // Tentar remover do storage se for uma URL do Supabase
      if (urlToRemove.includes('supabase')) {
        const pathMatch = urlToRemove.match(/\/storage\/v1\/object\/public\/imoveis-midias\/(.+)$/);
        if (pathMatch) {
          const filePath = pathMatch[1];
          console.log('Removendo arquivo do storage:', filePath);
          await supabase.storage
            .from('imoveis-midias')
            .remove([filePath]);
        }
      }

      const newMedias = medias.filter((_, i) => i !== index);
      setMedias(newMedias);
      onMediasChange(newMedias);

      toast({
        title: "Mídia removida",
        description: "A mídia foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao remover mídia:', error);
      toast({
        title: "Erro ao remover mídia",
        description: "Não foi possível remover a mídia.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Mídias do Imóvel (máximo {maxFiles})</Label>
        <p className="text-sm text-gray-500 mb-2">
          Formatos aceitos: JPG, PNG, WEBP - Tamanho máximo: 3MB cada
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-center">
            <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <Button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || medias.length >= maxFiles}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Enviando...' : 'Selecionar Mídias'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              {medias.length}/{maxFiles} mídias enviadas
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {medias.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {medias.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Mídia ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', url);
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkw4IDEySDExVjhIMTNWMTJIMTZMMTIgMTZaIiBmaWxsPSIjOUI5Qjk5Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUI5Qjk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FcnJvPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
              <button
                type="button"
                onClick={() => removeMedia(url, index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
