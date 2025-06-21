
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, updateUser } = useAuth();

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

    // Validar tamanho (máximo 3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 3MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Converter para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        if (user?.id) {
          // Salvar no banco de dados usando a função atualizar_imagem_perfil
          const { data, error } = await supabase.rpc('atualizar_imagem_perfil', {
            p_usuario_id: user.id,
            p_imagem_url: base64
          });

          if (error) {
            console.error('Erro ao salvar imagem:', error);
            toast({
              title: "Erro ao salvar",
              description: "Não foi possível salvar a imagem no banco de dados.",
              variant: "destructive",
            });
            return;
          }

          // Atualizar o contexto do usuário
          updateUser({
            ...user,
            imagem_perfil: base64
          });

          onImageChange(base64);
          toast({
            title: "Imagem salva!",
            description: "Sua foto de perfil foi atualizada e salva com sucesso.",
          });
        }
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
          PNG, JPG até 3MB
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
