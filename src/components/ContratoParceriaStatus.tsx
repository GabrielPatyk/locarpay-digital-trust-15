
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  ExternalLink 
} from 'lucide-react';

const ContratoParceriaStatus = () => {
  const { contrato, isLoading } = useContratoParceria();

  if (isLoading) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Contrato de Parceria LocarPay</p>
          <p className="text-sm text-gray-600">Carregando status...</p>
        </div>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAssinado = contrato?.status_assinatura === 'assinado';
  const temLinkAssinatura = contrato?.url_contrato;

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">Contrato de Parceria LocarPay</p>
        <p className="text-sm text-gray-600">Status da assinatura do contrato de parceria</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge className={isAssinado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
          {isAssinado ? (
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
        
        {isAssinado && temLinkAssinatura && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(contrato.url_contrato!, '_blank')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Ver Contrato
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        
        {!isAssinado && (
          <div className="text-right">
            {temLinkAssinatura ? (
              <Button
                onClick={() => window.open(contrato.url_contrato!, '_blank')}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Assinar Documento
                <ExternalLink className="h-3 w-3" />
              </Button>
            ) : (
              <div className="text-sm text-gray-500 max-w-xs">
                Estamos gerando o link de assinatura. Isso pode levar alguns minutos. 
                Por favor, atualize a página em breve.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContratoParceriaStatus;
