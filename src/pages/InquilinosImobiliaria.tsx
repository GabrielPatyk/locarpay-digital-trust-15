
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

interface Inquilino {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataInicio: string;
  status: 'ativo' | 'inativo' | 'pendente';
  valorAluguel: number;
}

const InquilinosImobiliaria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const inquilinos: Inquilino[] = [
    {
      id: '1',
      nome: 'João Silva Santos',
      email: 'joao.santos@email.com',
      telefone: '(11) 99999-1234',
      endereco: 'Rua das Flores, 123 - São Paulo/SP',
      dataInicio: '2024-01-15',
      status: 'ativo',
      valorAluguel: 2500
    },
    {
      id: '2',
      nome: 'Maria Oliveira Costa',
      email: 'maria.costa@email.com',
      telefone: '(11) 88888-5678',
      endereco: 'Av. Paulista, 456 - São Paulo/SP',
      dataInicio: '2024-02-01',
      status: 'ativo',
      valorAluguel: 3200
    },
    {
      id: '3',
      nome: 'Pedro Ferreira Lima',
      email: 'pedro.lima@email.com',
      telefone: '(11) 77777-9012',
      endereco: 'Rua Augusta, 789 - São Paulo/SP',
      dataInicio: '2024-03-10',
      status: 'pendente',
      valorAluguel: 1800
    }
  ];

  const filteredInquilinos = inquilinos.filter(inquilino =>
    inquilino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquilino.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <Layout title="Inquilinos">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquilinos</h1>
            <p className="text-gray-600">Gerencie todos os inquilinos da sua imobiliária</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Inquilino
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar inquilinos por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inquilinos List */}
        <div className="grid gap-4">
          {filteredInquilinos.map((inquilino) => (
            <Card key={inquilino.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{inquilino.nome}</h3>
                          <Badge className={getStatusColor(inquilino.status)}>
                            {getStatusLabel(inquilino.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Valor do Aluguel</p>
                        <p className="text-xl font-bold text-primary">
                          R$ {inquilino.valorAluguel.toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{inquilino.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{inquilino.telefone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{inquilino.endereco}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Início: {new Date(inquilino.dataInicio).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInquilinos.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum inquilino encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou adicione um novo inquilino.'
                  : 'Adicione seu primeiro inquilino para começar.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default InquilinosImobiliaria;
