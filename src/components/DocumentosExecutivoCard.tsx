import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  User
} from 'lucide-react';

interface DocumentosExecutivoCardProps {
  imobiliaria: {
    id: string;
    usuario_id: string;
    cartao_cnpj?: string | null;
    comprovante_endereco?: string | null;
    cartao_creci?: string | null;
    status_cartao_cnpj: 'pendente' | 'verificando' | 'verificado';
    status_comprovante_endereco: 'pendente' | 'verificando' | 'verificado';
    status_cartao_creci: 'pendente' | 'verificando' | 'verificado';
    data_verificacao_cartao_cnpj?: string | null;
    data_verificacao_comprovante_endereco?: string | null;
    data_verificacao_cartao_creci?: string | null;
    usuario: {
      nome: string;
      email: string;
    };
  };
  onUploadSuccess: () => void;
  onUpdateStatus: (perfilId: string, documentType: string, status: string, dataVerificacao?: string) => void;
}

const DocumentosExecutivoCard: React.FC<DocumentosExecutivoCardProps> = ({
  imobiliaria,
  onUploadSuccess,
  onUpdateStatus
}) => {
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();
  const [fileInputKeys, setFileInputKeys] = useState({
    cartao_cnpj: 0,
    comprovante_endereco: 0,
    cartao_creci: 0
  });

  const getStatusConfig = (status: 'pendente' | 'verificando' | 'verificado') => {
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { path } = await uploadFile(file, `documentos/${imobiliaria.usuario_id}`);
      
      // Atualizar o perfil com o novo documento
      const { error } = await supabase
        .from('perfil_usuario')
        .update({ [documentType]: path })
        .eq('id', imobiliaria.id);

      if (error) throw error;

      toast({
        title: "Documento enviado!",
        description: "Documento enviado com sucesso para a imobiliária.",
      });

      // Reset do input file
      setFileInputKeys(prev => ({
        ...prev,
        [documentType]: prev[documentType] + 1
      }));
      
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

  const handleViewDocument = (arquivo: string) => {
    if (arquivo) {
      const { data } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(arquivo);
      window.open(data.publicUrl, '_blank');
    }
  };

  const handleStatusChange = (
    documentType: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci',
    status: 'verificando' | 'verificado'
  ) => {
    const dataVerificacao = status === 'verificado' ? new Date().toISOString() : undefined;
    onUpdateStatus(imobiliaria.id, documentType, status, dataVerificacao);
  };

  const documentos = [
    {
      tipo: 'cartao_cnpj' as const,
      titulo: 'Cartão CNPJ',
      descricao: 'Documento de identificação da empresa',
      arquivo: imobiliaria.cartao_cnpj,
      status: imobiliaria.status_cartao_cnpj,
      dataVerificacao: imobiliaria.data_verificacao_cartao_cnpj
    },
    {
      tipo: 'comprovante_endereco' as const,
      titulo: 'Comprovante de Endereço',
      descricao: 'Comprovante de endereço da empresa',
      arquivo: imobiliaria.comprovante_endereco,
      status: imobiliaria.status_comprovante_endereco,
      dataVerificacao: imobiliaria.data_verificacao_comprovante_endereco
    },
    {
      tipo: 'cartao_creci' as const,
      titulo: 'Cartão CRECI',
      descricao: 'Registro no Conselho Regional de Corretores',
      arquivo: imobiliaria.cartao_creci,
      status: imobiliaria.status_cartao_creci,
      dataVerificacao: imobiliaria.data_verificacao_cartao_creci
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          {imobiliaria.usuario.nome}
        </CardTitle>
        <CardDescription>
          {imobiliaria.usuario.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documentos.map((doc) => {
          const statusConfig = getStatusConfig(doc.status);
          
          return (
            <div key={doc.tipo} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.titulo}</p>
                    <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                  </div>
                </div>
                
                {doc.dataVerificacao && doc.status === 'verificado' && (
                  <p className="text-xs text-muted-foreground">
                    Verificado em: {new Date(doc.dataVerificacao).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {statusConfig.badge}
                
                <div className="flex gap-2">
                  {doc.arquivo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.arquivo!)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {doc.status !== 'verificado' && (
                    <>
                      <input
                        key={fileInputKeys[doc.tipo]}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, doc.tipo)}
                        className="hidden"
                        id={`upload-${doc.tipo}-${imobiliaria.id}`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`upload-${doc.tipo}-${imobiliaria.id}`)?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? 'Enviando...' : doc.arquivo ? 'Substituir' : 'Enviar'}
                      </Button>
                    </>
                  )}

                  {doc.arquivo && doc.status === 'verificando' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(doc.tipo, 'verificado')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Verificar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DocumentosExecutivoCard;