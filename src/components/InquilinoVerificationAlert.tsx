
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, UserPlus, Loader2 } from 'lucide-react';

interface UsuarioExistente {
  id: string;
  email: string;
  nome: string;
  cpf?: string;
}

interface InquilinoVerificationAlertProps {
  usuarioExistente: UsuarioExistente | null;
  isVerificationComplete: boolean;
  isLoading: boolean;
  onVincularContaExistente: () => void;
  onCriarNovaConta: () => void;
}

const InquilinoVerificationAlert: React.FC<InquilinoVerificationAlertProps> = ({
  usuarioExistente,
  isVerificationComplete,
  isLoading,
  onVincularContaExistente,
  onCriarNovaConta,
}) => {
  if (!isVerificationComplete) {
    return null;
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        {usuarioExistente ? (
          <Alert className="border-blue-300 bg-blue-100">
            <User className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="space-y-3">
                <p>
                  <strong>Conta existente encontrada!</strong><br />
                  O usuário/inquilino já tem uma conta vinculada ao {usuarioExistente.cpf ? 'CPF' : 'E-mail'} fornecido.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <p className="text-sm">
                    <strong>Nome:</strong> {usuarioExistente.nome}<br />
                    <strong>E-mail:</strong> {usuarioExistente.email}
                    {usuarioExistente.cpf && (
                      <>
                        <br />
                        <strong>CPF:</strong> {usuarioExistente.cpf}
                      </>
                    )}
                  </p>
                </div>
                <Button
                  onClick={onVincularContaExistente}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vinculando...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Vincular Fiança à Conta Existente
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-orange-300 bg-orange-100">
            <UserPlus className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="space-y-3">
                <p>
                  <strong>Nenhuma conta encontrada</strong><br />
                  Nenhuma conta foi encontrada com os dados fornecidos (CPF ou E-mail). 
                  Deseja criar uma nova conta para o inquilino?
                </p>
                <Button
                  onClick={onCriarNovaConta}
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta com Dados da Fiança
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default InquilinoVerificationAlert;
