import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentosExecutivo } from '@/hooks/useDocumentosExecutivo';
import DocumentosExecutivoCard from './DocumentosExecutivoCard';
import { 
  FileText,
  Users
} from 'lucide-react';

const DocumentosImobiliariaExecutivo = () => {
  const { imobiliarias, isLoading, refetch, updateDocumentStatus } = useDocumentosExecutivo();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Documentos das Imobiliárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!imobiliarias || imobiliarias.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Documentos das Imobiliárias
          </CardTitle>
          <CardDescription>
            Gerencie os documentos das imobiliárias que você cadastrou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhuma imobiliária encontrada.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              As imobiliárias que você cadastrar aparecerão aqui.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTotalPendentes = () => {
    return imobiliarias.reduce((total, imob) => {
      let pendentes = 0;
      if (imob.status_cartao_cnpj === 'pendente') pendentes++;
      if (imob.status_comprovante_endereco === 'pendente') pendentes++;
      if (imob.status_cartao_creci === 'pendente') pendentes++;
      return total + pendentes;
    }, 0);
  };

  const getTotalVerificando = () => {
    return imobiliarias.reduce((total, imob) => {
      let verificando = 0;
      if (imob.status_cartao_cnpj === 'verificando') verificando++;
      if (imob.status_comprovante_endereco === 'verificando') verificando++;
      if (imob.status_cartao_creci === 'verificando') verificando++;
      return total + verificando;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Documentos das Imobiliárias
          </CardTitle>
          <CardDescription>
            Gerencie os documentos das imobiliárias que você cadastrou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{imobiliarias.length}</div>
              <div className="text-sm text-muted-foreground">Total de Imobiliárias</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{getTotalPendentes()}</div>
              <div className="text-sm text-muted-foreground">Documentos Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{getTotalVerificando()}</div>
              <div className="text-sm text-muted-foreground">Aguardando Verificação</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {imobiliarias.map((imobiliaria) => (
          <DocumentosExecutivoCard
            key={imobiliaria.id}
            imobiliaria={imobiliaria}
            onUploadSuccess={refetch}
            onUpdateStatus={(perfilId, documentType, status, dataVerificacao) => 
              updateDocumentStatus({ 
                perfilId, 
                documentType: documentType as any, 
                status: status as any, 
                dataVerificacao 
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentosImobiliariaExecutivo;