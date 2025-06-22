
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Building, 
  FileText, 
  Calendar,
  Star,
  DollarSign,
  AlertCircle,
  Clock
} from 'lucide-react';

const DetalheFianca = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - substitua pela busca real dos dados
  const fianca = {
    id: 'FL-001',
    status: 'rejeitada',
    inquilino: {
      nome: 'João Silva Santos',
      cpf: '123.456.789-00',
      email: 'joao@email.com',
      whatsapp: '+55 (11) 9 9999-9999',
      renda: 5000,
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    },
    imovel: {
      tipo: 'Apartamento',
      endereco: 'Av. Paulista, 456 - Apt 12',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estado: 'SP',
      valor: 2500,
      area: 80,
      tempo: 12
    },
    analise: {
      score: 650,
      taxa: 8.5,
      analista: 'Ana Costa Oliveira',
      dataAnalise: '2024-01-15T14:30:00Z',
      motivoRejeicao: 'Score de crédito insuficiente para o valor solicitado. Necessário comprovação de renda adicional.'
    },
    historico: [
      {
        data: '2024-01-15T14:30:00Z',
        acao: 'Fiança rejeitada',
        usuario: 'Ana Costa Oliveira',
        detalhes: 'Score insuficiente'
      },
      {
        data: '2024-01-15T10:00:00Z',
        acao: 'Enviado para análise',
        usuario: 'Sistema',
        detalhes: 'Fiança criada pela imobiliária'
      },
      {
        data: '2024-01-15T09:45:00Z',
        acao: 'Fiança criada',
        usuario: 'Eduardo Fragozo',
        detalhes: 'Nova solicitação de fiança'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rejeitada':
        return 'bg-red-500';
      case 'aprovada':
        return 'bg-green-500';
      case 'em_analise':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'rejeitada':
        return 'Rejeitada';
      case 'aprovada':
        return 'Aprovada';
      case 'em_analise':
        return 'Em Análise';
      default:
        return status;
    }
  };

  return (
    <Layout title="Detalhes da Fiança">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/fiancas-imobiliaria')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Fiança {fianca.id}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                  {getStatusLabel(fianca.status)}
                </Badge>
                <span className="text-sm text-gray-500">
                  Analisada em {new Date(fianca.analise.dataAnalise).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados do Inquilino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Dados do Inquilino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                <p className="text-base">{fianca.inquilino.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CPF</p>
                <p className="text-base">{fianca.inquilino.cpf}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-base">{fianca.inquilino.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                <p className="text-base">{fianca.inquilino.whatsapp}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Renda Mensal</p>
                <p className="text-base font-semibold text-green-600">
                  R$ {fianca.inquilino.renda.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">
                  {fianca.inquilino.endereco}, {fianca.inquilino.bairro}<br />
                  {fianca.inquilino.cidade} - {fianca.inquilino.estado}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Imóvel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-orange-600" />
                Dados do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="text-base">{fianca.imovel.tipo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <p className="text-base">
                  {fianca.imovel.endereco}<br />
                  {fianca.imovel.bairro}, {fianca.imovel.cidade} - {fianca.imovel.estado}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Valor do Aluguel</p>
                <p className="text-base font-semibold text-blue-600">
                  R$ {fianca.imovel.valor.toLocaleString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Área</p>
                <p className="text-base">{fianca.imovel.area} m²</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tempo de Locação</p>
                <p className="text-base">{fianca.imovel.tempo} meses</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados da Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-purple-600" />
              Dados da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm font-medium text-gray-500">Score de Crédito</p>
                <p className="text-2xl font-bold text-yellow-600">{fianca.analise.score}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-sm font-medium text-gray-500">Taxa da Fiança</p>
                <p className="text-2xl font-bold text-green-600">{fianca.analise.taxa}%</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={`${getStatusColor(fianca.status)} text-white mt-1`}>
                  {getStatusLabel(fianca.status)}
                </Badge>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-500">Analista</p>
                <p className="text-sm font-medium text-blue-600">{fianca.analise.analista}</p>
              </div>
            </div>

            {fianca.status === 'rejeitada' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Motivo da Rejeição</h4>
                <p className="text-red-700">{fianca.analise.motivoRejeicao}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Histórico de Atividades
            </CardTitle>
            <CardDescription>
              Acompanhe todas as alterações realizadas nesta fiança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fianca.historico.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.acao}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(item.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Por: {item.usuario}</p>
                    {item.detalhes && (
                      <p className="text-sm text-gray-500 mt-1">{item.detalhes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalheFianca;
