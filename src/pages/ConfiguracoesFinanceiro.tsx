
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings,
  Bell,
  Mail,
  Save,
  CreditCard,
  Clock,
  AlertTriangle
} from 'lucide-react';

const ConfiguracoesFinanceiro = () => {
  const { toast } = useToast();
  
  const [configuracoes, setConfiguracoes] = useState({
    // Notificações
    notificacoesPagamento: true,
    notificacoesVencimento: true,
    notificacoesInadimplencia: true,
    diasAvisoVencimento: 5,
    
    // Templates de E-mail
    templatePagamento: 'Olá, segue o link para pagamento da sua fiança locatícia...',
    templateVencimento: 'Seu pagamento vence em {dias} dias...',
    templateInadimplencia: 'Identificamos que seu pagamento está em atraso...',
    
    // Configurações de Pagamento
    diasTolerancia: 3,
    multaAtraso: 2,
    jurosAtraso: 0.033,
    
    // Integração Bancária
    bancoIntegracao: 'manual',
    webhookUrl: '',
    chaveApi: ''
  });

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas!",
      description: "Suas configurações foram atualizadas com sucesso.",
    });
  };

  const testarIntegracao = () => {
    toast({
      title: "Teste realizado!",
      description: "Conexão com o banco testada com sucesso.",
    });
  };

  return (
    <Layout title="Configurações Financeiro">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">Configurações do Financeiro</h2>
          <Button onClick={salvarConfiguracoes} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Salvar Alterações</span>
          </Button>
        </div>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificações</span>
            </CardTitle>
            <CardDescription>Configure quando receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar sobre novos pagamentos</Label>
                <p className="text-sm text-gray-500">Receba alertas quando pagamentos forem efetuados</p>
              </div>
              <Switch
                checked={configuracoes.notificacoesPagamento}
                onCheckedChange={(checked) =>
                  setConfiguracoes(prev => ({ ...prev, notificacoesPagamento: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar sobre vencimentos</Label>
                <p className="text-sm text-gray-500">Alertas de pagamentos próximos ao vencimento</p>
              </div>
              <Switch
                checked={configuracoes.notificacoesVencimento}
                onCheckedChange={(checked) =>
                  setConfiguracoes(prev => ({ ...prev, notificacoesVencimento: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificar sobre inadimplência</Label>
                <p className="text-sm text-gray-500">Alertas de pagamentos em atraso</p>
              </div>
              <Switch
                checked={configuracoes.notificacoesInadimplencia}
                onCheckedChange={(checked) =>
                  setConfiguracoes(prev => ({ ...prev, notificacoesInadimplencia: checked }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Dias de aviso antes do vencimento</Label>
                <Input
                  type="number"
                  value={configuracoes.diasAvisoVencimento}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({ ...prev, diasAvisoVencimento: parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates de E-mail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Templates de E-mail</span>
            </CardTitle>
            <CardDescription>Personalize as mensagens enviadas aos inquilinos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Template - Link de Pagamento</Label>
              <Textarea
                placeholder="Mensagem para envio do link de pagamento..."
                value={configuracoes.templatePagamento}
                onChange={(e) =>
                  setConfiguracoes(prev => ({ ...prev, templatePagamento: e.target.value }))
                }
                className="min-h-20"
              />
            </div>

            <div>
              <Label>Template - Aviso de Vencimento</Label>
              <Textarea
                placeholder="Mensagem de aviso de vencimento..."
                value={configuracoes.templateVencimento}
                onChange={(e) =>
                  setConfiguracoes(prev => ({ ...prev, templateVencimento: e.target.value }))
                }
                className="min-h-20"
              />
            </div>

            <div>
              <Label>Template - Inadimplência</Label>
              <Textarea
                placeholder="Mensagem para pagamentos em atraso..."
                value={configuracoes.templateInadimplencia}
                onChange={(e) =>
                  setConfiguracoes(prev => ({ ...prev, templateInadimplencia: e.target.value }))
                }
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Regras de Pagamento</span>
            </CardTitle>
            <CardDescription>Configure multas, juros e tolerâncias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Dias de tolerância</Label>
                <Input
                  type="number"
                  value={configuracoes.diasTolerancia}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({ ...prev, diasTolerancia: parseInt(e.target.value) }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Dias após vencimento sem multa</p>
              </div>

              <div>
                <Label>Multa por atraso (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={configuracoes.multaAtraso}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({ ...prev, multaAtraso: parseFloat(e.target.value) }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Percentual de multa</p>
              </div>

              <div>
                <Label>Juros diários (%)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={configuracoes.jurosAtraso}
                  onChange={(e) =>
                    setConfiguracoes(prev => ({ ...prev, jurosAtraso: parseFloat(e.target.value) }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">Percentual diário</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integração Bancária */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Integração Bancária</span>
            </CardTitle>
            <CardDescription>Configure a integração com instituições financeiras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Tipo de Integração</Label>
              <Select
                value={configuracoes.bancoIntegracao}
                onValueChange={(value) =>
                  setConfiguracoes(prev => ({ ...prev, bancoIntegracao: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual (Atual)</SelectItem>
                  <SelectItem value="bradesco">Bradesco API</SelectItem>
                  <SelectItem value="itau">Itaú API</SelectItem>
                  <SelectItem value="santander">Santander API</SelectItem>
                  <SelectItem value="bb">Banco do Brasil API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {configuracoes.bancoIntegracao !== 'manual' && (
              <>
                <div>
                  <Label>URL do Webhook</Label>
                  <Input
                    placeholder="https://api.banco.com.br/webhook"
                    value={configuracoes.webhookUrl}
                    onChange={(e) =>
                      setConfiguracoes(prev => ({ ...prev, webhookUrl: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <Label>Chave da API</Label>
                  <Input
                    type="password"
                    placeholder="Chave de acesso da API"
                    value={configuracoes.chaveApi}
                    onChange={(e) =>
                      setConfiguracoes(prev => ({ ...prev, chaveApi: e.target.value }))
                    }
                  />
                </div>

                <Button onClick={testarIntegracao} variant="outline">
                  Testar Conexão
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConfiguracoesFinanceiro;
