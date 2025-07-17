import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type ContratoPendente = Tables<'contratos_imobiliaria_locarpay'>;

interface ContractPendingModalProps {
  isOpen: boolean;
  contrato: ContratoPendente;
}

const ContractPendingModal: React.FC<ContractPendingModalProps> = ({ 
  isOpen, 
  contrato 
}) => {
  const handleAssinarContrato = () => {
    if (contrato.link_assinatura) {
      window.open(contrato.link_assinatura, '_blank');
    }
  };

  return (
    <>
      {/* Overlay que bloqueia toda a plataforma */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[9998]" 
          style={{ 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        />
      )}
      
      <Dialog 
        open={isOpen} 
        onOpenChange={() => {}} 
        modal
      >
      <DialogContent 
        className="max-w-2xl p-0 z-[9999] bg-white border-2 border-orange-200" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header com ícone de alerta */}
        <DialogHeader className="p-8 pb-6 text-center bg-gradient-to-b from-orange-50 to-white">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
            CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA ENTRE LOCARPAY E IMOBILIÁRIA
          </DialogTitle>
          
          <DialogDescription className="text-lg text-gray-700 mt-4 leading-relaxed">
            A assinatura do contrato é obrigatória para continuar utilizando a plataforma.
            <br />
            No momento, o contrato ainda <strong className="text-red-600">não foi assinado</strong>.
            <br />
            A plataforma permanecerá bloqueada até a conclusão da assinatura.
          </DialogDescription>
        </DialogHeader>

        {/* Corpo do modal */}
        <div className="p-8 pt-6">
          {contrato.link_assinatura ? (
            // Se há link de assinatura disponível
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-700 font-medium">
                  Link de assinatura disponível!
                </p>
                <p className="text-gray-600 mt-2">
                  Clique no botão abaixo para acessar o sistema de assinatura eletrônica.
                </p>
              </div>
              
              <Button
                onClick={handleAssinarContrato}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                📝 Assinar Contrato
              </Button>
            </div>
          ) : (
            // Se não há link de assinatura
            <div className="text-center">
              <div className="mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <p className="text-orange-800 font-medium text-lg mb-3">
                    Estamos validando suas informações.
                  </p>
                  <p className="text-orange-700 leading-relaxed">
                    O link de assinatura do contrato ainda não está disponível.
                    <br />
                    Pedimos um prazo de até <strong>2 horas</strong> para a geração do link, mas ele pode ser disponibilizado antes disso.
                    <br />
                    <br />
                    <strong>Fique atento ao seu e-mail e também à plataforma para acompanhar a liberação.</strong>
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>A plataforma será desbloqueada automaticamente após a assinatura do contrato.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer informativo */}
        <div className="bg-gray-50 p-6 border-t">
          <div className="flex items-center justify-center text-sm text-gray-600">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Acesso à plataforma bloqueado até assinatura do contrato</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default ContractPendingModal;