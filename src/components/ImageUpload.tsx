
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  userName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  userName = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Converter para base64 para demonstração
      // Em produção, você faria upload para Supabase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageChange(base64);
        toast({
          title: "Imagem carregada!",
          description: "Sua foto de perfil foi atualizada.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar a imagem.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        {currentImage ? (
          <AvatarImage src={currentImage} alt="Foto de perfil" />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-lg">
            {userName ? getInitials(userName) : <User className="h-8 w-8" />}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div>
        <Button
          variant="outline"
          disabled={uploading}
          className="relative overflow-hidden"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Carregando...' : 'Alterar Foto'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG até 5MB
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
