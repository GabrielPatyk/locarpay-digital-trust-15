
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
import { Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';

const ConfiguracoesAdmin = () => {
  const { toast } = useToast();
  const [showToken, setShowToken] = useState(false);
  const [apiToken, setApiToken] = useState('lcp_test_1234567890abcdef1234567890abcdef');
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

  const gerarNovoToken = () => {
    const newToken = 'lcp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiToken(newToken);
    toast({
      title: "Token gerado!",
      description: "Um novo token de acesso foi gerado com sucesso.",
    });
  };

  const copiarToken = () => {
    navigator.clipboard.writeText(apiToken);
    toast({
      title: "Token copiado!",
      description: "O token foi copiado para a área de transferência.",
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

            {/* Nova seção de API */}
            <Card>
              <CardHeader>
                <CardTitle>API da Plataforma</CardTitle>
                <CardDescription>
                  Documentação e configurações da API LocarPay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Documentação da API */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Documentação da API</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <h5 className="font-medium">Base URL</h5>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">https://api.locarpay.com/v1</code>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Autenticação</h5>
                      <p className="text-sm text-gray-600">
                        Todas as requisições devem incluir o header: <code>Authorization: Bearer YOUR_TOKEN</code>
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Endpoints Principais</h5>
                      <div className="space-y-2 text-sm">
                        <div><code>GET /users</code> - Listar usuários</div>
                        <div><code>POST /users</code> - Criar usuário</div>
                        <div><code>GET /fiancas</code> - Listar fianças</div>
                        <div><code>POST /fiancas</code> - Criar fiança</div>
                        <div><code>GET /contratos</code> - Listar contratos</div>
                        <div><code>POST /contratos</code> - Criar contrato</div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Exemplo de Requisição</h5>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`curl -X GET "https://api.locarpay.com/v1/users" \\
  -H "Authorization: Bearer lcp_your_token_here" \\
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Rate Limiting</h5>
                      <p className="text-sm text-gray-600">
                        Limite de 1000 requisições por hora por token
                      </p>
                    </div>
                  </div>
                </div>

                {/* Geração de Token */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Token de Acesso</h4>
                  <div className="space-y-3">
                    <Label>Token Atual</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showToken ? "text" : "password"}
                        value={apiToken}
                        readOnly
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copiarToken}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={gerarNovoToken}
                      variant="destructive"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Gerar Novo Token
                    </Button>
                    
                    <p className="text-sm text-amber-600">
                      ⚠️ Ao gerar um novo token, o token anterior será invalidado imediatamente.
                    </p>
                  </div>
                </div>

                {/* Webhooks */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Webhooks</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      Configure endpoints para receber notificações automáticas sobre eventos da plataforma.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>• <code>user.created</code> - Novo usuário criado</div>
                      <div>• <code>fianca.approved</code> - Fiança aprovada</div>
                      <div>• <code>contrato.signed</code> - Contrato assinado</div>
                      <div>• <code>payment.completed</code> - Pagamento realizado</div>
                    </div>
                  </div>
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
