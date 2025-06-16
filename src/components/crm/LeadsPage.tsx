
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Edit, 
  ArrowRight,
  User,
  Building
} from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  empresa?: string;
  etapa: string;
  status: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido';
  ultimoContato: string;
  responsavel: string;
  valor?: number;
}

const LeadsPage = () => {
  // Mock data
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      nome: 'João Silva',
      telefone: '(11) 99999-9999',
      email: 'joao@empresa.com',
      empresa: 'Empresa ABC',
      etapa: 'Contato Inicial',
      status: 'novo',
      ultimoContato: '2024-01-15',
      responsavel: 'Ana Costa',
      valor: 5000
    },
    {
      id: '2',
      nome: 'Maria Santos',
      telefone: '(11) 88888-8888',
      email: 'maria@xyz.com',
      empresa: 'XYZ Ltda',
      etapa: 'Proposta',
      status: 'proposta',
      ultimoContato: '2024-01-14',
      responsavel: 'Carlos Mendes',
      valor: 12000
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      telefone: '(11) 77777-7777',
      email: 'pedro@teste.com',
      etapa: 'Qualificação',
      status: 'qualificado',
      ultimoContato: '2024-01-13',
      responsavel: 'Ana Costa',
      valor: 8000
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-500';
      case 'contato': return 'bg-yellow-500';
      case 'qualificado': return 'bg-green-500';
      case 'proposta': return 'bg-orange-500';
      case 'fechado': return 'bg-emerald-500';
      case 'perdido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'novo': return 'Novo';
      case 'contato': return 'Em Contato';
      case 'qualificado': return 'Qualificado';
      case 'proposta': return 'Proposta';
      case 'fechado': return 'Fechado';
      case 'perdido': return 'Perdido';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-[#0C1C2E]">{leads.length}</p>
              </div>
              <User className="h-8 w-8 text-[#F4D573]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Qualificados</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(l => l.status === 'qualificado').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Proposta</p>
                <p className="text-2xl font-bold text-orange-600">
                  {leads.filter(l => l.status === 'proposta').length}
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-[#F4D573]">
                  R$ {leads.reduce((acc, lead) => acc + (lead.valor || 0), 0).toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-[#F4D573]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold">
                        {lead.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900">{lead.nome}</h4>
                      <p className="text-sm text-gray-600">{lead.empresa}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(lead.status)} text-white`}>
                    {getStatusText(lead.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{lead.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Etapa</p>
                    <p className="text-sm font-medium">{lead.etapa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Último Contato</p>
                    <p className="text-sm font-medium">
                      {new Date(lead.ultimoContato).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Responsável: <span className="font-medium">{lead.responsavel}</span>
                    </span>
                    {lead.valor && (
                      <span className="text-sm font-medium text-[#F4D573]">
                        R$ {lead.valor.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" className="bg-[#0C1C2E] hover:bg-[#1A2F45]">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Mover Etapa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsPage;
