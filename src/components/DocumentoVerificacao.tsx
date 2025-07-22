import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText
} from 'lucide-react';

interface DocumentoVerificacaoProps {
  tipo: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci';
  titulo: string;
  descricao: string;
  arquivo?: string | null;
  status: 'pendente' | 'verificando' | 'verificado';
  dataVerificacao?: string | null;
  onUploadSuccess: () => void;
}

const DocumentoVerificacao: React.FC<DocumentoVerificacaoProps> = ({
  tipo,
  titulo,
  descricao,
  arquivo,
  status,
  dataVerificacao,
  onUploadSuccess
}) => {
  const { user } = useAuth();
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();
  const [fileInputKey, setFileInputKey] = useState(0);

  const getStatusConfig = () => {
    switch (status) {
      case 'verificado':
        return {
          badge: <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Verificado</Badge>,
          color: 'text-green-600'
        };
      case 'verificando':
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" />Verificando</Badge>,
          color: 'text-yellow-600'
        };
      default:
        return {
          badge: <Badge className="bg-red-100 text-red-800"><AlertTriangle className="mr-1 h-3 w-3" />Pendente</Badge>,
          color: 'text-red-600'
        };
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      const { path } = await uploadFile(file, `documentos/${user.id}`);
      
      // Atualizar o perfil com o novo documento
      const { error } = await supabase
        .from('perfil_usuario')
        .update({ [tipo]: path })
        .eq('usuario_id', user.id);

      if (error) throw error;

      toast({
        title: "Documento enviado!",
        description: "Documento enviado com sucesso. Aguarde a verificação.",
      });

      // Reset do input file
      setFileInputKey(prev => prev + 1);
      onUploadSuccess();
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar documento.",
        variant: "destructive",
      });
    }
  };

  const handleViewDocument = () => {
    if (arquivo) {
      const { data } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(arquivo);
      window.open(data.publicUrl, '_blank');
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">{titulo}</p>
            <p className="text-sm text-muted-foreground">{descricao}</p>
          </div>
        </div>
        
        {dataVerificacao && status === 'verificado' && (
          <p className="text-xs text-muted-foreground">
            Verificado em: {new Date(dataVerificacao).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {statusConfig.badge}
        
        <div className="flex gap-2">
          {arquivo && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDocument}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          {status !== 'verificado' && (
            <>
              <input
                key={fileInputKey}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id={`upload-${tipo}`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(`upload-${tipo}`)?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Enviando...' : arquivo ? 'Substituir' : 'Enviar'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentoVerificacao;