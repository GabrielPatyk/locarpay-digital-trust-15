
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ConfiguracoesAdmin = () => {
  const { toast } = useToast();
  const [configuracoes, setConfiguracoes] = useState({
    taxaMinima: 8,
    taxaMaxima: 15,
    scoreMinimo: 500,
    emailNotificacao: 'admin@locarpay.com',
    notificacoesEmail: true,
    notificacoesSMS: false,
    manutencaoAtiva: false,
    mensagemManutencao: 'Sistema em manutenção. Retornaremos em breve.'
  });

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações foram atualizadas com sucesso.",
    });
  };

  return (
    <Layout title="Configurações do Sistema">
      <div className="space-y-6">
        <Tabs defaultValue="geral">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configure parâmetros gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="scoreMinimo">Score Mínimo para Aprovação</Label>
                    <Input
                      id="scoreMinimo"
                      type="number"
                      value={configuracoes.scoreMinimo}
                      onChange={(e) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        scoreMinimo: parseInt(e.target.value) 
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailNotificacao">E-mail para Notificações</Label>
                    <Input
                      id="emailNotificacao"
                      type="email"
                      value={configuracoes.emailNotificacao}
                      onChange={(e) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        emailNotificacao: e.target.value 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Financeiras</CardTitle>
                <CardDescription>
                  Configure taxas e parâmetros financeiros
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="taxaMinima">Taxa Mínima de Fiança (%)</Label>
                    <Input
                      id="taxaMinima"
                      type="number"
                      value={configuracoes.taxaMinima}
                      onChange={(e) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        taxaMinima: parseFloat(e.target.value) 
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxaMaxima">Taxa Máxima de Fiança (%)</Label>
                    <Input
                      id="taxaMaxima"
                      type="number"
                      value={configuracoes.taxaMaxima}
                      onChange={(e) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        taxaMaxima: parseFloat(e.target.value) 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando enviar notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por E-mail</Label>
                      <p className="text-sm text-gray-500">
                        Enviar notificações importantes por e-mail
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacoesEmail}
                      onCheckedChange={(checked) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        notificacoesEmail: checked 
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificações por SMS</Label>
                      <p className="text-sm text-gray-500">
                        Enviar notificações urgentes por SMS
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.notificacoesSMS}
                      onCheckedChange={(checked) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        notificacoesSMS: checked 
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Configure aspectos técnicos da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo Manutenção</Label>
                      <p className="text-sm text-gray-500">
                        Ativar modo de manutenção para todos os usuários
                      </p>
                    </div>
                    <Switch
                      checked={configuracoes.manutencaoAtiva}
                      onCheckedChange={(checked) => setConfiguracoes(prev => ({ 
                        ...prev, 
                        manutencaoAtiva: checked 
                      }))}
                    />
                  </div>
                  
                  {configuracoes.manutencaoAtiva && (
                    <div className="space-y-2">
                      <Label htmlFor="mensagemManutencao">Mensagem de Manutenção</Label>
                      <Textarea
                        id="mensagemManutencao"
                        value={configuracoes.mensagemManutencao}
                        onChange={(e) => setConfiguracoes(prev => ({ 
                          ...prev, 
                          mensagemManutencao: e.target.value 
                        }))}
                        placeholder="Digite a mensagem que será exibida durante a manutenção"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={salvarConfiguracoes} className="bg-primary hover:bg-primary/90">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ConfiguracoesAdmin;
