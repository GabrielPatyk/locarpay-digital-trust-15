
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { User } from '@/types/user';

interface ContractModalProps {
  isOpen: boolean;
  user: User;
  onAccept: () => void;
  linkAssinatura?: string | null;
}

const ContractModal: React.FC<ContractModalProps> = ({ 
  isOpen, 
  user, 
  onAccept,
  linkAssinatura 
}) => {
  const contractContent = `
CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA
ENTRE LOCARPAY E IMOBILIÁRIA

Pelo presente instrumento particular, de um lado:

LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA, pessoa jurídica de direito privado, inscrita no CNPJ nº 95.358.016/0001-87, com sede na Terceira Avenida, Balneário Camboriú/SC, CEP 88330-083, neste ato representada por seu representante legal infra-assinado, doravante denominada simplesmente "LOCARPAY";

E, de outro lado:

${user?.name || 'IMOBILIÁRIA'}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [CNPJ DA IMOBILIÁRIA], com sede na [ENDEREÇO DA IMOBILIÁRIA], neste ato representada por seu representante legal infra-assinado, doravante denominada simplesmente "IMOBILIÁRIA";

Celebram o presente Contrato de Parceria e Disponibilização de Plataforma, mediante as seguintes cláusulas e condições:

CLÁUSULA PRIMEIRA – DO OBJETO

1.1. A LOCARPAY concederá à IMOBILIÁRIA acesso à sua plataforma digital de gestão de garantias locatícias, que oferece funcionalidades como:
a) análise de crédito de locatários;
b) emissão de apólices de fiança locatícia;
c) geração de relatórios gerenciais;
d) serviços de assinatura eletrônica de documentos com validade jurídica, incluindo sistema integrado de verificação de identidade, que contempla validação facial, de documentos e demais mecanismos de segurança;
e) demais funcionalidades descritas em manual técnico próprio.

1.2. A plataforma visa facilitar a intermediação da contratação de garantias locatícias entre locadores, locatários e a LOCARPAY, mantendo a autonomia contratual entre as partes envolvidas.

CLÁUSULA SEGUNDA – DAS GARANTIAS LOCATÍCIAS

2.1. A LOCARPAY oferecerá aos clientes indicados pela IMOBILIÁRIA garantias de fiança locatícia, conforme o art. 37, inciso I, da Lei nº 8.245/1991 (Lei do Inquilinato).

2.2. As garantias prestadas terão as seguintes características:
a) Abrangência: cobertura de obrigações inadimplidas relacionadas ao contrato de locação, como alugueis, encargos legais e multas contratuais;
b) Limites e Condições: serão estabelecidos em apólice ou termo próprio firmado entre LOCARPAY e o locatário/locador, conforme critérios de crédito e risco.

2.3. A IMOBILIÁRIA atua como mera intermediadora na indicação de interessados, não assumindo responsabilidade solidária ou subsidiária pelas garantias emitidas.

CLÁUSULA TERCEIRA – DAS OBRIGAÇÕES DA LOCARPAY

3.1. Disponibilizar acesso à plataforma à IMOBILIÁRIA, incluindo suporte técnico e treinamentos necessários.

3.2. Garantir a conformidade dos serviços com a legislação vigente, incluindo a Lei do Inquilinato e a LGPD.

3.3. Emitir os documentos comprobatórios das garantias concedidas e disponibilizar a funcionalidade de assinatura eletrônica com validade jurídica e mecanismos de verificação de identidade.

CLÁUSULA QUARTA – DAS OBRIGAÇÕES DA IMOBILIÁRIA

4.1. Utilizar a plataforma exclusivamente para os fins contratados, abstendo-se de qualquer uso indevido ou ilícito.

4.2. Fornecer dados verídicos e completos dos locadores e locatários, viabilizando a correta análise e emissão das garantias.

4.3. Informar seus clientes sobre as condições gerais das garantias oferecidas, inclusive sobre o uso da assinatura digital e a necessidade de verificação de identidade.

CLÁUSULA QUINTA – DA REMUNERAÇÃO

5.1. A IMOBILIÁRIA fará jus à seguinte remuneração:
a) Comissão de [10]% sobre o valor da locação em cada garantia contratada via plataforma;
b) A critério das partes, poderá ser pactuada mensalidade fixa ou variável, formalizada em instrumento à parte.

5.2. As condições comerciais poderão ser revistas mediante termo aditivo.

CLÁUSULA SEXTA – DA CONFIDENCIALIDADE

6.1. As partes comprometem-se a manter sigilo absoluto sobre informações comerciais, técnicas e estratégicas a que tiverem acesso, inclusive após o término do contrato.

6.2. A obrigação de confidencialidade vigorará por 5 (cinco) anos após o encerramento do contrato.

CLÁUSULA SÉTIMA – DA PROTEÇÃO DE DADOS

7.1. As partes comprometem-se a observar rigorosamente a LGPD (Lei nº 13.709/2018).

7.2. A IMOBILIÁRIA compromete-se a obter o consentimento dos clientes para tratamento e compartilhamento de dados pessoais necessários ao funcionamento da plataforma, incluindo validações de identidade e assinatura.

CLÁUSULA OITAVA – DA VIGÊNCIA E RESCISÃO

8.1. O contrato terá vigência de 12 (doze) meses, sendo renovado automaticamente por períodos iguais, salvo manifestação contrária com 30 (trinta) dias de antecedência.

8.2. O contrato poderá ser rescindido a qualquer tempo, mediante aviso prévio de 30 (trinta) dias, ou imediatamente em caso de violação de cláusulas essenciais.

CLÁUSULA NONA – DAS DISPOSIÇÕES GERAIS

9.1. A IMOBILIÁRIA reconhece que a LOCARPAY é detentora dos direitos de propriedade intelectual da plataforma.

9.2. Este contrato não estabelece vínculo empregatício, societário ou associativo entre as partes.

CLÁUSULA DÉCIMA – DO FORO

10.1. Fica eleito o foro da comarca de Balneário Camboriú/SC para dirimir quaisquer controvérsias oriundas deste contrato.

CLÁUSULA DÉCIMA PRIMEIRA – DA RESPONSABILIDADE LIMITADA

11.1. A LOCARPAY não se responsabiliza por decisões da IMOBILIÁRIA ou de seus clientes com base em informações fornecidas pela plataforma.

11.2. A IMOBILIÁRIA é responsável pelo correto uso da plataforma e pelas informações transmitidas por meio dela.

CLÁUSULA DÉCIMA SEGUNDA – DAS ATUALIZAÇÕES E DISPONIBILIDADE DA PLATAFORMA

12.1. A LOCARPAY poderá realizar atualizações e melhorias na plataforma com o objetivo de aperfeiçoar sua usabilidade, funcionalidades ou estrutura tecnológica. Nesses casos, a LOCARPAY se compromete a realizar comunicação prévia à IMOBILIÁRIA, sempre que tais atualizações impactarem diretamente a operação.

12.2. As atualizações não são obrigatórias para a IMOBILIÁRIA, podendo esta optar por não utilizá-las, ressalvadas as hipóteses em que a LOCARPAY, por questões técnicas ou legais, determine sua obrigatoriedade.

12.3. A LOCARPAY reserva-se o direito de realizar atualizações emergenciais e de segurança a qualquer momento, sem necessidade de aviso prévio, inclusive com eventuais interrupções temporárias na disponibilidade da plataforma, sem que isso configure inadimplemento contratual ou gere qualquer tipo de responsabilização.

12.4. A plataforma poderá permanecer offline temporariamente, para manutenção programada ou emergencial, independentemente de aviso prévio, sem que isso enseje direito a indenização, compensação ou qualquer penalidade à LOCARPAY.

CLÁUSULA DÉCIMA TERCEIRA – DA AUDITORIA

13.1. Qualquer das partes poderá solicitar auditoria das transações ou registros, mediante aviso prévio de 10 (dez) dias útis, por meio de profissional qualificado e sob confidencialidade.

CLÁUSULA DÉCIMA QUARTA – DA ANTICORRUPÇÃO

14.1. As partes declaram que cumprem integralmente a legislação anticorrupção, especialmente a Lei nº 12.846/2013, comprometendo-se a não oferecer, prometer ou conceder qualquer vantagem indevida.

CLÁUSULA DÉCIMA QUINTA – DAS PENALIDADES

15.1. O descumprimento de cláusulas essenciais sujeitará a parte infratora ao pagamento de multa compensatória equivalente a 10% do valor das comissões recebidas nos últimos 3 (três) meses, sem prejuízo das perdas e danos.

CLÁUSULA DÉCIMA SEXTA – DO USO INDEVIDO E SEGURANÇA DOS ACESSOS

16.1. Cada credencial de acesso (login e senha) fornecida à IMOBILIÁRIA é de uso pessoal, individual e intransferível, devendo ser utilizada apenas por seu titular, previamente cadastrado na plataforma.

16.2. É expressamente vedado o compartilhamento de acessos com terceiros, sejam internos ou externos à organização da IMOBILIÁRIA. A responsabilidade por qualquer ação executada com determinada credencial será integralmente atribuída ao seu titular.

16.3. A LOCARPAY não se responsabiliza por quaisquer ações indevidas realizadas por terceiros que tenham tido acesso indevido à plataforma por negligência, compartilhamento de credenciais, ausência de controle interno ou má-fé do usuário.

16.4. Em caso de uso indevido, vazamento de dados, exclusão de informações, envio incorreto de documentos ou quaisquer outros prejuízos causados por acesso indevido ou compartilhado, a IMOBILIÁRIA será responsabilizada civil e, se cabível, criminalmente, sendo a LOCARPAY isenta de qualquer ônus ou responsabilidade direta ou indireta.

E, por estarem justas e contratadas, firmam o presente contrato em 2 (duas) vias de igual teor.

[Local], [Data].

LOCARPAY SOLUÇÕES EM GARANTIAS LOCATÍCIAS LTDA
[REPRESENTANTE LOCARPAY]
[CARGO LOCARPAY]

${user?.name || 'IMOBILIÁRIA'}
[REPRESENTANTE IMOBILIÁRIA]
[CARGO IMOBILIÁRIA]
${user?.email || '[E-MAIL IMOBILIÁRIA]'}
[TELEFONE IMOBILIÁRIA]
  `;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0C1C2E]">
            CONTRATO DE PARCERIA E DISPONIBILIZAÇÃO DE PLATAFORMA ENTRE LOCARPAY E IMOBILIÁRIA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Assinatura do contrato está pendente.</strong><br />
              A plataforma continuará bloqueada até que o contrato seja assinado.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {contractContent}
          </div>

          <div className="flex flex-col space-y-4">
            {linkAssinatura ? (
              <Button 
                onClick={onAccept}
                className="w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] font-semibold"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Assinar Contrato
              </Button>
            ) : (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  <strong>Estamos validando suas informações.</strong><br />
                  O link de assinatura do contrato ainda não está disponível.<br />
                  Pedimos um prazo de até 2 horas para a geração do link, mas ele pode ser disponibilizado antes disso.<br />
                  Fique atento ao seu e-mail e também à plataforma para acompanhar a liberação.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;
