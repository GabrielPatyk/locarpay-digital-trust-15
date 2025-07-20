
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { 
  FileCheck, 
  ExternalLink, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ContratoParceriaStatus = () => {
  const { contrato, isLoading } = useContratoParceria();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-primary" />
            Contrato de Parceria LocarPay
          </CardTitle>
          <CardDescription>
            Carregando informações do contrato...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!contrato) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-primary" />
            Contrato de Parceria LocarPay
          </CardTitle>
          <CardDescription>
            Aguardando criação do contrato...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-600">
              Seu contrato está sendo processado. Por favor, aguarde alguns instantes.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPendente = contrato.status_assinatura === 'pendente';
  const isAssinado = contrato.status_assinatura === 'assinado';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="mr-2 h-5 w-5 text-primary" />
          Contrato de Parceria LocarPay
        </CardTitle>
        <CardDescription>
          Status da assinatura do contrato de parceria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status da Assinatura</p>
            <p className="text-sm text-gray-600">
              Situação atual do seu contrato de parceria
            </p>
          </div>
          <Badge className={
            isPendente 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }>
            {isPendente ? (
              <>
                <AlertTriangle className="mr-1 h-3 w-3" />
                Pendente Assinatura
              </>
            ) : (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Assinado
              </>
            )}
          </Badge>
        </div>

        {isPendente && (
          <div className="border-t pt-4">
            {contrato.link_assinatura ? (
              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Seu contrato está pronto para assinatura.
                </p>
                <Button 
                  onClick={() => window.open(contrato.link_assinatura, '_blank')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Assinar Documento
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3 py-4">
                <Clock className="mx-auto h-8 w-8 text-yellow-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    Link em processamento
                  </p>
                  <p className="text-sm text-gray-600">
                    O link para assinatura está sendo gerado e pode levar alguns minutos. 
                    Por favor, aguarde.
                  </p>
                </div>
                <Button disabled className="bg-gray-300">
                  <Clock className="mr-2 h-4 w-4" />
                  Aguardando Link
                </Button>
              </div>
            )}
          </div>
        )}

        {isAssinado && (
          <div className="border-t pt-4">
            <div className="text-center space-y-3">
              <CheckCircle className="mx-auto h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-green-800">
                  Contrato Assinado com Sucesso!
                </p>
                <p className="text-sm text-gray-600">
                  Sua parceria com a LocarPay está ativa.
                </p>
              </div>
              {contrato.documento_assinado_url && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(contrato.documento_assinado_url, '_blank')}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Ver Contrato
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContratoParceriaStatus;
