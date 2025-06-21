
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Eye, 
  Download,
  Calendar,
  TrendingUp,
  User,
  DollarSign
} from 'lucide-react';

interface Analise {
  id: string;
  cliente: string;
  cpf: string;
  score: number;
  taxa: number;
  status: 'concluida' | 'pendente' | 'em_analise';
  dataAnalise: string;
  valorSolicitado: number;
}

const Analises = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const analises: Analise[] = [
    {
      id: 'ANA-001',
      cliente: 'João Silva Santos',
      cpf: '123.456.789-00',
      score: 720,
      taxa: 10,
      status: 'concluida',
      dataAnalise: '2024-01-15',
      valorSolicitado: 2500
    },
    {
      id: 'ANA-002',
      cliente: 'Maria Oliveira',
      cpf: '987.654.321-00',
      score: 0,
      taxa: 0,
      status: 'em_analise',
      dataAnalise: '2024-01-16',
      valorSolicitado: 4000
    }
  ];

  const filteredAnalises = analises.filter(analise =>
    analise.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analise.cpf.includes(searchTerm) ||
    analise.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em_analise':
        return 'bg-blue-100 text-blue-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'Concluída';
      case 'em_analise':
        return 'Em Análise';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Layout title="Análises de Crédito">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análises de Crédito</h1>
            <p className="text-gray-600">Histórico de todas as análises realizadas</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar análises por cliente, CPF ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredAnalises.map((analise) => (
            <Card key={analise.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{analise.id}</h3>
                      <Badge className={getStatusColor(analise.status)}>
                        {getStatusLabel(analise.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor Solicitado</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {analise.valorSolicitado.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{analise.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">CPF</p>
                      <p className="font-medium">{analise.cpf}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="font-medium">
                        {analise.score > 0 ? `${analise.score} pontos` : 'Pendente'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Taxa</p>
                      <p className="font-medium">
                        {analise.taxa > 0 ? `${analise.taxa}%` : 'Pendente'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Análise realizada em {new Date(analise.dataAnalise).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Relatório
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAnalises.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma análise encontrada
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca.'
                  : 'As análises realizadas aparecerão aqui.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Analises;
