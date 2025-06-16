
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  empresa?: string;
  valor?: number;
  ultimoContato: string;
  responsavel: string;
}

interface FunnelStage {
  id: string;
  nome: string;
  cor: string;
  leads: Lead[];
}

const FunnelsPage = () => {
  const [stages] = useState<FunnelStage[]>([
    {
      id: '1',
      nome: 'Novos Leads',
      cor: 'bg-blue-500',
      leads: [
        {
          id: '1',
          nome: 'João Silva',
          telefone: '(11) 99999-9999',
          email: 'joao@empresa.com',
          empresa: 'Empresa ABC',
          valor: 5000,
          ultimoContato: '2024-01-15',
          responsavel: 'Ana Costa'
        }
      ]
    },
    {
      id: '2',
      nome: 'Contato Inicial',
      cor: 'bg-yellow-500',
      leads: [
        {
          id: '2',
          nome: 'Maria Santos',
          telefone: '(11) 88888-8888',
          email: 'maria@xyz.com',
          empresa: 'XYZ Ltda',
          valor: 12000,
          ultimoContato: '2024-01-14',
          responsavel: 'Carlos Mendes'
        }
      ]
    },
    {
      id: '3',
      nome: 'Qualificação',
      cor: 'bg-green-500',
      leads: [
        {
          id: '3',
          nome: 'Pedro Oliveira',
          telefone: '(11) 77777-7777',
          email: 'pedro@teste.com',
          valor: 8000,
          ultimoContato: '2024-01-13',
          responsavel: 'Ana Costa'
        }
      ]
    },
    {
      id: '4',
      nome: 'Proposta',
      cor: 'bg-orange-500',
      leads: []
    },
    {
      id: '5',
      nome: 'Fechamento',
      cor: 'bg-emerald-500',
      leads: []
    }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0C1C2E]">Funil de Vendas Principal</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Total de Leads: {stages.reduce((acc, stage) => acc + stage.leads.length, 0)}</span>
          <span>Valor Total: R$ {stages.flatMap(s => s.leads).reduce((acc, lead) => acc + (lead.valor || 0), 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.cor}`}></div>
                    <span>{stage.nome}</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {stage.leads.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {stage.leads.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>Nenhum lead nesta etapa</p>
                  </div>
                ) : (
                  stage.leads.map((lead) => (
                    <Card 
                      key={lead.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 hover:border-[#F4D573]"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs">
                              {lead.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">{lead.nome}</h4>
                            <p className="text-xs text-gray-600">{lead.empresa}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{lead.telefone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(lead.ultimoContato).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-xs text-gray-500">{lead.responsavel}</span>
                          {lead.valor && (
                            <span className="text-xs font-medium text-[#F4D573]">
                              R$ {lead.valor.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelsPage;
