
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  User,
  Building
} from 'lucide-react';

interface ContratoJuridico {
  id: string;
  cliente: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  status: 'ativo' | 'pendente' | 'revisao' | 'finalizado';
}

const ContratosJuridico = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const contratos: ContratoJuridico[] = [
    {
      id: 'JUR-001',
      cliente: 'Imobiliária Central',
      tipo: 'Fiança Locatícia',
      dataInicio: '2024-01-15',
      dataFim: '2025-01-15',
      valor: 2500,
      status: 'ativo'
    },
    {
      id: 'JUR-002',
      cliente: 'Construtora Silva',
      tipo: 'Garantia Comercial',
      dataInicio: '2024-02-01',
      dataFim: '2025-02-01',
      valor: 5000,
      status: 'revisao'
    }
  ];

  const filteredContratos = contratos.filter(contrato =>
    contrato.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'revisao':
        return 'bg-blue-100 text-blue-800';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Contratos Jurídicos">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contratos Jurídicos</h1>
            <p className="text-gray-600">Gerencie todos os contratos do departamento jurídico</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar contratos por cliente, tipo ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredContratos.map((contrato) => (
            <Card key={contrato.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{contrato.id}</h3>
                      <Badge className={getStatusColor(contrato.status)}>
                        {contrato.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Valor</p>
                    <p className="text-xl font-bold text-primary">
                      R$ {contrato.valor.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Cliente</p>
                      <p className="font-medium">{contrato.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium">{contrato.tipo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Período</p>
                      <p className="font-medium">
                        {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} - {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContratos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum contrato encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou adicione um novo contrato.'
                  : 'Adicione seu primeiro contrato para começar.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ContratosJuridico;
