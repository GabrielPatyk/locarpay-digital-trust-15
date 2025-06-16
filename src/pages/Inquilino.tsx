
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  CheckCircle, 
  DollarSign, 
  Mail, 
  Download,
  CreditCard,
  Shield,
  Calendar
} from 'lucide-react';

interface Contrato {
  id: string;
  imovel: string;
  valor: number;
  dataAssinatura: string;
  status: 'ativo' | 'pendente' | 'vencido';
  valorFianca: number;
  taxa: number;
  vencimento: string;
  pagamentoStatus: 'pago' | 'pendente' | 'vencido';
}

const Inquilino = () => {
  const { toast } = useToast();
  const [emailValidado, setEmailValidado] = useState(false);

  // Mock data - In real app, this would come from API based on authenticated user
  const contrato: Contrato = {
    id: '1',
    imovel: 'Apartamento 2 quartos - Jardins, São Paulo',
    valor: 2500,
    dataAssinatura: '2024-01-15',
    status: 'ativo',
    valorFianca: 250, // 10% do valor do aluguel
    taxa: 10,
    vencimento: '2024-02-15',
    pagamentoStatus: 'pendente'
  };

  const validarEmail = () => {
    setEmailValidado(true);
    toast({
      title: "E-mail validado com sucesso!",
      description: "Sua conta foi verificada e você pode prosseguir com o pagamento.",
    });
  };

  const gerarLinkPagamento = () => {
    toast({
      title: "Link de pagamento gerado!",
      description: "Você será redirecionado para a página de pagamento em instantes.",
    });
    
    // Simulate payment process
    setTimeout(() => {
      toast({
        title: "Pagamento simulado",
        description: "Em um ambiente real, você seria direcionado para o gateway de pagamento.",
      });
    }, 2000);
  };

  const baixarContrato = () => {
    toast({
      title: "Download iniciado",
      description: "O contrato está sendo baixado em formato PDF.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-success';
      case 'pendente': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPagamentoStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-success';
      case 'pendente': return 'bg-warning';
      case 'vencido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Área do Inquilino">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-primary to-success text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Bem-vindo à sua área!</h2>
                <p className="opacity-90">
                  Aqui você pode acompanhar seu contrato, validar sua conta e realizar pagamentos.
                </p>
              </div>
              <Shield className="h-16 w-16 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Meu Contrato
              </CardTitle>
              <CardDescription>
                Informações do seu contrato de fiança locatícia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Imóvel</h4>
                <p className="text-sm text-gray-600">{contrato.imovel}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Valor do Aluguel</h4>
                  <p className="text-lg font-bold text-primary">
                    R$ {contrato.valor.toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Taxa da Fiança</h4>
                  <p className="text-lg font-bold text-success">
                    {contrato.taxa}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Data de Assinatura</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(contrato.dataAssinatura).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <Badge className={`${getStatusColor(contrato.status)} text-white`}>
                    {contrato.status === 'ativo' ? 'Ativo' : 
                     contrato.status === 'pendente' ? 'Pendente' : 'Vencido'}
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={baixarContrato}
                variant="outline" 
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Contrato PDF
              </Button>
            </CardContent>
          </Card>

          {/* Account Validation & Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Pagamento da Fiança
              </CardTitle>
              <CardDescription>
                Valide sua conta e realize o pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Validation */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Validação de E-mail</h4>
                  {emailValidado ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Mail className="h-5 w-5 text-warning" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {emailValidado 
                    ? 'Sua conta foi validada com sucesso!' 
                    : 'Valide seu e-mail para prosseguir com o pagamento'
                  }
                </p>
                {!emailValidado && (
                  <Button 
                    onClick={validarEmail}
                    size="sm"
                    className="bg-warning hover:bg-warning/90 text-primary"
                  >
                    Validar E-mail
                  </Button>
                )}
              </div>

              {/* Payment Information */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Valor da Fiança</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">
                    R$ {contrato.valorFianca.toLocaleString()}
                  </span>
                  <Badge className={`${getPagamentoStatusColor(contrato.pagamentoStatus)} text-white`}>
                    {contrato.pagamentoStatus === 'pago' ? 'Pago' : 
                     contrato.pagamentoStatus === 'pendente' ? 'Pendente' : 'Vencido'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Taxa de {contrato.taxa}% sobre o valor do aluguel
                </p>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar className="mr-2 h-4 w-4" />
                  Vencimento: {new Date(contrato.vencimento).toLocaleDateString()}
                </div>
              </div>

              {/* Payment Button */}
              {emailValidado && contrato.pagamentoStatus === 'pendente' && (
                <Button 
                  onClick={gerarLinkPagamento}
                  className="w-full bg-success hover:bg-success/90"
                  size="lg"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Gerar Link de Pagamento
                </Button>
              )}

              {contrato.pagamentoStatus === 'pago' && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-success mb-2" />
                  <p className="font-medium text-success">Pagamento Realizado!</p>
                  <p className="text-sm text-gray-600">
                    Sua fiança foi quitada com sucesso.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos</CardTitle>
            <CardDescription>
              Acompanhe todos os seus pagamentos realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Fiança Locatícia</p>
                  <p className="text-sm text-gray-600">
                    {new Date(contrato.vencimento).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {contrato.valorFianca.toLocaleString()}</p>
                  <Badge className={`${getPagamentoStatusColor(contrato.pagamentoStatus)} text-white text-xs`}>
                    {contrato.pagamentoStatus === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inquilino;
