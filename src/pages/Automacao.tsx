
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Mail, 
  MessageCircle, 
  Clock, 
  Zap,
  Play,
  Pause,
  Plus,
  AlertTriangle
} from 'lucide-react';

const Automacao = () => {
  return (
    <Layout title="Automação">
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] rounded-lg p-4 sm:p-6 text-[#0C1C2E] relative overflow-hidden">
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-20">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Automação de Marketing</h1>
          <p className="opacity-90 mb-4 text-sm sm:text-base">
            Configure fluxos automatizados para nurturar seus leads e aumentar conversões.
          </p>
        </div>

        {/* Em Desenvolvimento */}
        <Card className="border-2 border-dashed border-warning">
          <CardHeader>
            <CardTitle className="flex items-center text-warning">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Funcionalidade em Desenvolvimento
            </CardTitle>
            <CardDescription>
              Esta seção está sendo desenvolvida e estará disponível em breve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                A funcionalidade de automação incluirá:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                <li>Sequências de e-mail automatizadas</li>
                <li>Automação de WhatsApp</li>
                <li>Triggers baseados em comportamento</li>
                <li>Workflows de nurturing</li>
                <li>Relatórios de performance</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Preview das Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="opacity-60 pointer-events-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Sequências de E-mail
              </CardTitle>
              <CardDescription>
                Configure fluxos automatizados de e-mail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Boas-vindas</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Follow-up</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Reativação</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60 pointer-events-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                Automação WhatsApp
              </CardTitle>
              <CardDescription>
                Automatize mensagens no WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Primeiro contato</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Lembrete</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Proposta</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60 pointer-events-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Triggers Temporais
              </CardTitle>
              <CardDescription>
                Ações baseadas em tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Após 1 dia</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Após 1 semana</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Após 1 mês</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="opacity-60 pointer-events-none">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Workflows
              </CardTitle>
              <CardDescription>
                Fluxos de automação complexos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Lead Scoring</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Qualificação</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Atribuição</span>
                  <Badge variant="secondary">Inativo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões desabilitados */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button disabled className="opacity-50">
            <Plus className="mr-2 h-4 w-4" />
            Criar Nova Automação
          </Button>
          <Button disabled variant="outline" className="opacity-50">
            <Settings className="mr-2 h-4 w-4" />
            Configurações Gerais
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Automacao;
