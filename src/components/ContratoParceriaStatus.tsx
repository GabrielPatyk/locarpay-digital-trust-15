
import React from 'react';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

const ContratoParceriaStatus = () => {
  const { contrato, loading } = useContratoParceria();

  if (loading) {
    return (
      <Card id="contrato-parceria">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-primary" />
            Contrato de Parceria LocarPay
          </CardTitle>
          <CardDescription>
            Carregando status do contrato...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contrato) {
    return (
      <Card id="contrato-parceria">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-primary" />
            Contrato de Parceria LocarPay
          </CardTitle>
          <CardDescription>
            Erro ao carregar informações do contrato
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleAssinarContrato = () => {
    if (contrato.link_assinatura) {
      window.open(contrato.link_assinatura, '_blank');
    }
  };

  const handleVerContrato = () => {
    if (contrato.documento_assinado_url) {
      window.open(contrato.documento_assinado_url, '_blank');
    }
  };

  return (
    <Card id="contrato-parceria">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-primary" />
          Contrato de Parceria LocarPay
        </CardTitle>
        <CardDescription>
          Status e ações relacionadas ao seu contrato de parceria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status da Assinatura</p>
            <p className="text-sm text-gray-600">
              {contrato.status_assinatura === 'pendente' 
                ? 'Seu contrato está aguardando assinatura' 
                : 'Contrato assinado e ativo'
              }
            </p>
          </div>
          <Badge className={
            contrato.status_assinatura === 'assinado' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }>
            {contrato.status_assinatura === 'assinado' ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Assinado
              </>
            ) : (
              <>
                <AlertTriangle className="mr-1 h-3 w-3" />
                Pendente
              </>
            )}
          </Badge>
        </div>

        {contrato.status_assinatura === 'pendente' && (
          <div className="space-y-3">
            <Button 
              onClick={handleAssinarContrato}
              disabled={!contrato.link_assinatura}
              className="bg-primary hover:bg-primary/90"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Assinar Documento
            </Button>
            
            {!contrato.link_assinatura && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  O link de assinatura está sendo gerado. Isso pode levar alguns minutos. 
                  Atualize a página em breve.
                </p>
              </div>
            )}
          </div>
        )}

        {contrato.status_assinatura === 'assinado' && (
          <Button 
            onClick={handleVerContrato}
            variant="outline"
            disabled={!contrato.documento_assinado_url}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Contrato
          </Button>
        )}

        <div className="text-xs text-gray-500 pt-2">
          <p>Criado em: {new Date(contrato.created_at).toLocaleDateString('pt-BR')}</p>
          {contrato.updated_at !== contrato.created_at && (
            <p>Atualizado em: {new Date(contrato.updated_at).toLocaleDateString('pt-BR')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContratoParceriaStatus;
