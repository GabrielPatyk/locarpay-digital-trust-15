
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useImobiliariaAccess } from '@/hooks/useImobiliariaAccess';
import Layout from './Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, FileCheck } from 'lucide-react';

interface ImobiliariaAccessGuardProps {
  children: React.ReactNode;
}

const ImobiliariaAccessGuard: React.FC<ImobiliariaAccessGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const { isBlocked, isLoading } = useImobiliariaAccess();

  // Se não é imobiliária, passa direto
  if (!user || user.type !== 'imobiliaria') {
    return <>{children}</>;
  }

  // Se está carregando, mostra loading
  if (isLoading) {
    return (
      <Layout title="Verificando Acesso">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Se está bloqueado, mostra aviso
  if (isBlocked) {
    return (
      <Layout title="Contrato Pendente">
        <div className="max-w-2xl mx-auto">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="mr-2 h-6 w-6" />
                Assinatura de Contrato Necessária
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Para acessar a plataforma LocarPay, é necessário assinar o contrato de parceria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-3">
                  <FileCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Contrato de Parceria LocarPay
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      O contrato estabelece os termos da nossa parceria e é necessário 
                      para garantir que ambas as partes estejam alinhadas quanto aos 
                      direitos e responsabilidades.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-yellow-700">
                <p>
                  <strong>Próximos passos:</strong>
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Acesse a seção "Contrato de Parceria" nas suas configurações</li>
                  <li>Revise os termos do contrato</li>
                  <li>Assine o documento digitalmente</li>
                  <li>Após a assinatura, o acesso será liberado automaticamente</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Se tudo ok, renderiza o conteúdo
  return <>{children}</>;
};

export default ImobiliariaAccessGuard;
