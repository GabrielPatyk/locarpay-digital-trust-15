
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Phone,
  Mail,
  FileText,
  Eye
} from 'lucide-react';

interface Imobiliaria {
  id: string;
  nome: string;
  contato: string;
  email: string;
  telefone: string;
  endereco: string;
  status: 'ativa' | 'inativa' | 'pendente';
  totalFiancas: number;
  valorTotal: number;
  dataVinculo: string;
}

interface Negociacao {
  id: string;
  imobiliaria: string;
  cliente: string;
  valor: number;
  status: 'negociacao' | 'proposta' | 'fechado' | 'perdido';
  dataInicio: string;
  proximaAtividade: string;
  observacoes: string;
}

interface Fianca {
  id: string;
  imobiliaria: string;
  inquilino: string;
  valor: number;
  taxa: number;
  status: 'ativa' | 'paga' | 'vencida';
  dataInicio: string;
}

const Executivo = () => {
  const [selectedTab, setSelectedTab] = useState('imobiliarias');

  // Mock data
  const imobiliarias: Imobiliaria[] = [
    {
      id: '1',
      nome: 'Imobiliária Prime',
      contato: 'Roberto Silva',
      email: 'roberto@prime.com',
      telefone: '(11) 99999-9999',
      endereco: 'Av. Paulista, 1000 - São Paulo',
      status: 'ativa',
      totalFiancas: 15,
      valorTotal: 37500,
      dataVinculo: '2023-06-15'
    },
    {
      id: '2',
      nome: 'Imobiliária Central',
      contato: 'Sandra Costa',
      email: 'sandra@central.com',
      telefone: '(11) 88888-8888',
      endereco: 'Rua Augusta, 500 - São Paulo',
      status: 'ativa',
      totalFiancas: 22,
      valorTotal: 68000,
      dataVinculo: '2023-08-20'
    },
    {
      id: '3',
      nome: 'Imobiliária Novo Horizonte',
      contato: 'Carlos Mendes',
      email: 'carlos@horizonte.com',
      telefone: '(11) 77777-7777',
      endereco: 'Av. Faria Lima, 200 - São Paulo',
      status: 'pendente',
      totalFiancas: 0,
      valorTotal: 0,
      dataVinculo: '2024-01-10'
    }
  ];

  const negociacoes: Negociacao[] = [
    {
      id: '1',
      imobiliaria: 'Imobiliária Top Vendas',
      cliente: 'João Apartments',
      valor: 150000,
      status: 'negociacao',
      dataInicio: '2024-01-10',
      proximaAtividade: '2024-01-17',
      observacoes: 'Cliente interessado em pacote de 50 unidades'
    },
    {
      id: '2',
      imobiliaria: 'Imobiliária Elite',
      cliente: 'Marina Residencial',
      valor: 85000,
      status: 'proposta',
      dataInicio: '2024-01-08',
      proximaAtividade: '2024-01-16',
      observacoes: 'Proposta enviada aguardando retorno'
    }
  ];

  const fiancas: Fianca[] = [
    {
      id: '1',
      imobiliaria: 'Imobiliária Prime',
      inquilino: 'Ana Silva',
      valor: 2500,
      taxa: 10,
      status: 'ativa',
      dataInicio: '2024-01-01'
    },
    {
      id: '2',
      imobiliaria: 'Imobiliária Central',
      inquilino: 'Pedro Santos',
      valor: 3200,
      taxa: 8,
      status: 'paga',
      dataInicio: '2023-12-15'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa':
      case 'paga':
      case 'fechado':
        return 'bg-success';
      case 'inativa':
      case 'vencida':
      case 'perdido':
        return 'bg-red-500';
      case 'pendente':
      case 'negociacao':
        return 'bg-warning';
      case 'proposta':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string, context: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      imobiliaria: {
        'ativa': 'Ativa',
        'inativa': 'Inativa',
        'pendente': 'Pendente'
      },
      negociacao: {
        'negociacao': 'Em Negociação',
        'proposta': 'Proposta Enviada',
        'fechado': 'Fechado',
        'perdido': 'Perdido'
      },
      fianca: {
        'ativa': 'Ativa',
        'paga': 'Paga',
        'vencida': 'Vencida'
      }
    };
    return statusMap[context]?.[status] || status;
  };

  const totalImobiliarias = imobiliarias.length;
  const imobiliariasAtivas = imobiliarias.filter(i => i.status === 'ativa').length;
  const totalFiancas = imobiliarias.reduce((acc, i) => acc + i.totalFiancas, 0);
  const valorTotalFiancas = imobiliarias.reduce((acc, i) => acc + i.valorTotal, 0);

  return (
    <Layout title="Executivo de Contas">
      <div className="space-y-6 animate-fade-in">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Imobiliárias</p>
                  <p className="text-2xl font-bold text-primary">{totalImobiliarias}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-2xl font-bold text-success">{imobiliariasAtivas}</p>
                </div>
                <Users className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fianças</p>
                  <p className="text-2xl font-bold text-warning">{totalFiancas}</p>
                </div>
                <FileText className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-success">
                    R$ {(valorTotalFiancas / 1000).toFixed(0)}K
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="imobiliarias">Imobiliárias</TabsTrigger>
            <TabsTrigger value="negociacoes">CRM</TabsTrigger>
            <TabsTrigger value="fiancas">Fianças</TabsTrigger>
          </TabsList>

          <TabsContent value="imobiliarias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Minhas Imobiliárias
                </CardTitle>
                <CardDescription>
                  Imobiliárias associadas ao seu portfólio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imobiliarias.map((imobiliaria) => (
                    <div
                      key={imobiliaria.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{imobiliaria.nome}</h4>
                          <p className="text-sm text-gray-600">Contato: {imobiliaria.contato}</p>
                          <p className="text-sm text-gray-600">{imobiliaria.endereco}</p>
                        </div>
                        <Badge className={`${getStatusColor(imobiliaria.status)} text-white`}>
                          {getStatusText(imobiliaria.status, 'imobiliaria')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">E-mail</p>
                          <p className="text-sm font-medium">{imobiliaria.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Telefone</p>
                          <p className="text-sm font-medium">{imobiliaria.telefone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Fianças</p>
                          <p className="text-sm font-medium">{imobiliaria.totalFiancas}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Valor Total</p>
                          <p className="text-sm font-medium text-success">
                            R$ {imobiliaria.valorTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Ligar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          E-mail
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="negociacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  CRM - Negociações
                </CardTitle>
                <CardDescription>
                  Acompanhe suas negociações em andamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {negociacoes.map((negociacao) => (
                    <div
                      key={negociacao.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{negociacao.imobiliaria}</h4>
                          <p className="text-sm text-gray-600">Cliente: {negociacao.cliente}</p>
                        </div>
                        <Badge className={`${getStatusColor(negociacao.status)} text-white`}>
                          {getStatusText(negociacao.status, 'negociacao')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valor da Negociação</p>
                          <p className="text-lg font-bold text-primary">
                            R$ {negociacao.valor.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Início</p>
                          <p className="text-sm font-medium">
                            {new Date(negociacao.dataInicio).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Próxima Atividade</p>
                          <p className="text-sm font-medium">
                            {new Date(negociacao.proximaAtividade).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Observações</p>
                        <p className="text-sm text-gray-900">{negociacao.observacoes}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Agendar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiancas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Histórico de Fianças
                </CardTitle>
                <CardDescription>
                  Fianças processadas pelas suas imobiliárias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fiancas.map((fianca) => (
                    <div
                      key={fianca.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{fianca.inquilino}</h4>
                          <p className="text-sm text-gray-600">{fianca.imobiliaria}</p>
                        </div>
                        <Badge className={`${getStatusColor(fianca.status)} text-white`}>
                          {getStatusText(fianca.status, 'fianca')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valor do Aluguel</p>
                          <p className="text-sm font-medium">
                            R$ {fianca.valor.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Taxa</p>
                          <p className="text-sm font-medium">{fianca.taxa}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Data de Início</p>
                          <p className="text-sm font-medium">
                            {new Date(fianca.dataInicio).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Contrato
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Executivo;
