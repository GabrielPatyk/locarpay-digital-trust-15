
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, MessageSquare, Plus } from 'lucide-react';

interface Interaction {
  id: string;
  leadNome: string;
  tipo: 'ligacao' | 'email' | 'reuniao' | 'anotacao';
  data: string;
  observacoes: string;
  responsavel: string;
}

const ConversationHistoryPage = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newNote, setNewNote] = useState('');

  const [interactions] = useState<Interaction[]>([
    {
      id: '1',
      leadNome: 'João Silva',
      tipo: 'ligacao',
      data: '2024-01-15T10:30:00',
      observacoes: 'Cliente interessado em conhecer mais sobre o produto. Agendada nova reunião.',
      responsavel: 'Ana Costa'
    },
    {
      id: '2',
      leadNome: 'Maria Santos',
      tipo: 'email',
      data: '2024-01-14T15:45:00',
      observacoes: 'Enviada proposta comercial por email. Cliente solicitou desconto.',
      responsavel: 'Carlos Mendes'
    },
    {
      id: '3',
      leadNome: 'Pedro Oliveira',
      tipo: 'reuniao',
      data: '2024-01-13T14:00:00',
      observacoes: 'Reunião de apresentação realizada. Cliente demonstrou interesse.',
      responsavel: 'Ana Costa'
    }
  ]);

  const getInteractionIcon = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'reuniao': return <Calendar className="h-4 w-4" />;
      case 'anotacao': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInteractionColor = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'bg-blue-500';
      case 'email': return 'bg-green-500';
      case 'reuniao': return 'bg-purple-500';
      case 'anotacao': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getInteractionLabel = (tipo: string) => {
    switch (tipo) {
      case 'ligacao': return 'Ligação';
      case 'email': return 'E-mail';
      case 'reuniao': return 'Reunião';
      case 'anotacao': return 'Anotação';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#0C1C2E]">Histórico de Interações</h2>
        <Button
          onClick={() => setShowNewForm(true)}
          className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#BC942C] hover:to-[#F4D573] text-[#0C1C2E] font-semibold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Interação
        </Button>
      </div>

      {showNewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Interação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Descreva a interação com o cliente..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
              />
              <div className="flex space-x-2">
                <Button className="bg-[#0C1C2E] hover:bg-[#1A2F45]">
                  Salvar Anotação
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Todas as Interações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getInteractionColor(interaction.tipo)} text-white`}>
                      {getInteractionIcon(interaction.tipo)}
                      <span className="ml-1">{getInteractionLabel(interaction.tipo)}</span>
                    </Badge>
                    <div>
                      <h4 className="font-medium text-gray-900">{interaction.leadNome}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(interaction.data).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{interaction.responsavel}</span>
                </div>
                <p className="text-gray-700">{interaction.observacoes}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationHistoryPage;
