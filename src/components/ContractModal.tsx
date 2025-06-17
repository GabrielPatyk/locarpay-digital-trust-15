
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';

interface ContractModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onAccept }) => {
  const { user } = useAuth();
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 5;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const contractText = `
CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA ENTRE LOCARPAY E IMOBILIÁRIA

Pelo presente instrumento particular, as partes a seguir identificadas:

LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA, pessoa jurídica de direito privado, inscrita no CNPJ nº 00.000.000/0001-00, com sede na Av. Exemplo, 123 - Centro, Curitiba/PR, neste ato representada por seu representante legal infra-assinado, doravante denominada simplesmente LOCARPAY;

${user?.companyName || '[NOME DA EMPRESA]'}, pessoa jurídica de direito privado, inscrita no CNPJ nº ${user?.cnpj || '[CNPJ]'}, com sede na ${user?.address || '[ENDEREÇO]'}, neste ato representada por ${user?.fullName || user?.name || '[NOME COMPLETO]'}, doravante denominada simplesmente IMOBILIÁRIA;

Têm entre si, justas e contratadas, as seguintes cláusulas e condições:

CLÁUSULA PRIMEIRA – DO OBJETO
A LOCARPAY disponibilizará à IMOBILIÁRIA acesso à sua plataforma digital de gestão de garantias locatícias, a qual oferece soluções de análise de crédito, emissão de apólices de fiança locatícia, geração de relatórios, bem como demais funcionalidades descritas em manual técnico próprio.

CLÁUSULA SEGUNDA – DAS RESPONSABILIDADES DA LOCARPAY
2.1. A LOCARPAY se compromete a manter a plataforma em funcionamento, salvo em casos de manutenção programada ou força maior.
2.2. Garantir a segurança dos dados conforme a Lei Geral de Proteção de Dados (LGPD).
2.3. Prestar suporte técnico durante o horário comercial.

CLÁUSULA TERCEIRA – DAS RESPONSABILIDADES DA IMOBILIÁRIA
3.1. A IMOBILIÁRIA se compromete a zelar pelo uso correto da plataforma.
3.2. Responsabilizar-se por quaisquer informações inseridas na plataforma.
3.3. Manter a confidencialidade dos acessos e não compartilhar credenciais.
3.4. Cumprir todas as normas e regulamentações aplicáveis ao setor imobiliário.

CLÁUSULA QUARTA – DA REMUNERAÇÃO
4.1. O acesso à plataforma será disponibilizado mediante o pagamento de taxa de utilização.
4.2. Os valores e condições de pagamento serão definidos em proposta comercial específica.

CLÁUSULA QUINTA – DA PROTEÇÃO DE DADOS
5.1. As partes se comprometem a observar rigorosamente a Lei Geral de Proteção de Dados.
5.2. Os dados pessoais coletados serão utilizados exclusivamente para as finalidades deste contrato.

CLÁUSULA SEXTA – DA VIGÊNCIA
6.1. O presente contrato terá vigência por prazo indeterminado.
6.2. Qualquer das partes poderá rescindir o contrato mediante aviso prévio de 30 dias.

CLÁUSULA SÉTIMA – DA CONFIDENCIALIDADE
7.1. As partes se comprometem a manter sigilo sobre informações confidenciais.
7.2. Esta obrigação permanecerá válida mesmo após o término do contrato.

CLÁUSULA OITAVA – DAS PENALIDADES
8.1. O descumprimento das obrigações previstas neste contrato acarretará em penalidades.
8.2. As penalidades serão aplicadas conforme a gravidade da infração.

CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS
9.1. Este contrato constitui o acordo integral entre as partes.
9.2. Qualquer alteração deverá ser feita por escrito e assinada por ambas as partes.

CLÁUSULA DÉCIMA – DO FORO
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o foro da comarca de Curitiba/PR, com renúncia expressa a qualquer outro.

E por estarem assim justas e contratadas, firmam o presente instrumento em 2 (duas) vias de igual teor e forma.

Curitiba/PR, ${getCurrentDate()}.

______________________________
LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA
João Exemplo
Diretor Comercial

______________________________
${user?.companyName || '[NOME DA EMPRESA]'}
${user?.fullName || user?.name || '[NOME COMPLETO]'}
Representante Legal
  `;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-center">
            Contrato de Parceria LOCARPAY
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <ScrollArea 
            className="h-96 w-full border rounded-md p-4"
            onScrollCapture={handleScroll}
          >
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {contractText}
            </div>
          </ScrollArea>
        </div>

        <div className="p-6 pt-4 flex justify-center">
          <Button
            onClick={onAccept}
            disabled={!hasScrolledToBottom}
            className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-semibold px-8"
          >
            {hasScrolledToBottom ? 'Aceito o contrato' : 'Role até o final para aceitar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;
