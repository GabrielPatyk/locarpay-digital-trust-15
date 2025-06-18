import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/types/user';

interface ContractModalProps {
  isOpen: boolean;
  user: User;
  onAccept: () => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, user, onAccept }) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    if (isAtBottom && !hasScrolledToEnd) {
      setHasScrolledToEnd(true);
    }
  };

  const handleSignatureProcess = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('https://esignatures.io/api/contracts?token=28e1b771-3f76-4c66-834c-43209ca93aaa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: '9c7a86e4-4e05-470f-9a3a-dc5c815f3df4',
          signers: [
            {
              name: user.name,
              email: user.email
            }
          ],
          redirect_url: 'https://locarpay.com.br/sucesso-assinatura'
        })
      });

      const data = await response.json();

      if (data?.contract?.url) {
        // Call the original onAccept function before redirecting
        onAccept();
        window.location.href = data.contract.url;
      } else {
        throw new Error('URL de assinatura não encontrada na resposta');
      }
    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert(`Erro ao processar assinatura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setHasScrolledToEnd(false);
  }, [isOpen]);

  const contractText = `
CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA ENTRE LOCARPAY E IMOBILIÁRIA

Pelo presente instrumento particular, as partes a seguir identificadas:

LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA, pessoa jurídica de direito privado, inscrita no CNPJ nº 00.000.000/0001-00, com sede na Av. Exemplo, 123 - Centro, Curitiba/PR, neste ato representada por seu representante legal infra-assinado, doravante denominada simplesmente LOCARPAY;

${user.companyName || user.name}, pessoa jurídica de direito privado, inscrita no CNPJ nº ${user.cnpj || 'A DEFINIR'}, com sede na ${user.address || 'A DEFINIR'}, neste ato representada por ${user.fullName || user.name}, doravante denominada simplesmente IMOBILIÁRIA;

Têm entre si, justas e contratadas, as seguintes cláusulas e condições:

CLÁUSULA PRIMEIRA – DO OBJETO
A LOCARPAY disponibilizará à IMOBILIÁRIA acesso à sua plataforma digital de gestão de garantias locatícias, a qual oferece soluções de análise de crédito, emissão de apólices de fiança locatícia, geração de relatórios, bem como demais funcionalidades descritas em manual técnico próprio.

CLÁUSULA SEGUNDA – DAS RESPONSABILIDADES DA LOCARPAY
A LOCARPAY se compromete a:
a) Manter a plataforma disponível 24 horas por dia, 7 dias por semana, exceto em casos de manutenção programada;
b) Garantir a segurança dos dados inseridos na plataforma;
c) Prestar suporte técnico durante horário comercial;
d) Processar as solicitações de análise de crédito conforme metodologia própria.

CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DA IMOBILIÁRIA
A IMOBILIÁRIA se compromete a:
a) Zelar pelo uso correto da plataforma;
b) Responsabilizar-se pela veracidade das informações inseridas;
c) Manter a confidencialidade dos acessos;
d) Cumprir todas as normas e procedimentos estabelecidos pela LOCARPAY.

CLÁUSULA QUARTA – DA REMUNERAÇÃO
Os serviços prestados pela LOCARPAY serão remunerados conforme tabela de preços vigente, disponível na plataforma e passível de alteração mediante comunicação prévia de 30 (trinta) dias.

CLÁUSULA QUINTA – DA CONFIDENCIALIDADE
As partes se comprometem a manter sigilo absoluto sobre todas as informações obtidas em razão deste contrato, não podendo divulgá-las a terceiros sem autorização expressa.

CLÁUSULA SEXTA – DO PRAZO
Este contrato terá prazo indeterminado, podendo ser rescindido por qualquer das partes mediante aviso prévio de 30 (trinta) dias.

CLÁUSULA SÉTIMA – DAS ALTERAÇÕES
Qualquer alteração neste contrato deverá ser formalizada por escrito e aceita por ambas as partes.

CLÁUSULA OITAVA – DA RESCISÃO
O presente contrato poderá ser rescindido:
a) Por mútuo acordo entre as partes;
b) Por inadimplemento de qualquer das cláusulas aqui estabelecidas;
c) Por decisão unilateral, mediante aviso prévio.

CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS
Este contrato constitui o acordo integral entre as partes, revogando todos os entendimentos anteriores relativos ao objeto aqui tratado.

CLÁUSULA DÉCIMA – DO FORO
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de Curitiba/PR, com renúncia expressa a qualquer outro.

E por estarem assim justas e contratadas, firmam o presente instrumento em 2 (duas) vias de igual teor e forma.

Curitiba/PR, ${getCurrentDate()}.

______________________________
LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA
João Exemplo
Diretor Comercial

______________________________
${user.companyName || user.name}
${user.fullName || user.name}
Representante Legal
  `;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-[#0C1C2E]">
            Contrato de Parceria LOCARPAY
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Por favor, leia todo o contrato para continuar
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 flex-1">
          <ScrollArea 
            className="h-[60vh] w-full border rounded-md p-4"
            onScrollCapture={handleScroll}
          >
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {contractText}
            </div>
          </ScrollArea>
        </div>

        <div className="p-6 pt-4 border-t">
          {!hasScrolledToEnd && (
            <p className="text-sm text-amber-600 mb-4 text-center">
              Role até o final do documento para aceitar o contrato
            </p>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={handleSignatureProcess}
              disabled={!hasScrolledToEnd || isProcessing}
              className="bg-[#F4D573] text-[#0C1C2E] hover:bg-[#BC942C] hover:text-white font-semibold px-8 py-2"
            >
              {isProcessing ? 'Processando...' : 'Aceitar e Continuar com a Assinatura'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;
