
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Eye, EyeOff, User, Building, DollarSign, Settings, Bell, Shield } from 'lucide-react';

const ConfiguracoesAdmin = () => {
  const { toast } = useToast();
  const [showToken, setShowToken] = useState(false);
  const [apiToken, setApiToken] = useState('lcp_test_1234567890abcdef1234567890abcdef');
  
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: 'Administrador Sistema',
    email: 'admin@locarpay.com',
    telefone: '(11) 99999-9999',
    cargo: 'Administrador'
  });

  const [configuracoes, setConfiguracoes] = useState({
    scoreMinimo: 500,
    taxaMinima: 8,
    taxaMaxima: 15,
    emailNotificacao: 'admin@locarpay.com',
    notificacoesEmail: true,
    notificacoesSMS: false,
    manutencaoAtiva: false,
    mensagemManutencao: 'Sistema em manutenção. Retornaremos em breve.'
  });

  const salvarDadosPessoais = () => {
    toast({
      title: "Dados pessoais salvos!",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const salvarConfiguracoes = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações do sistema foram atualizadas com sucesso.",
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
    <Layout title="Configurações">
      <div className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais e dados de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={dadosPessoais.nome}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={dadosPessoais.email}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={dadosPessoais.telefone}
                  onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={dadosPessoais.cargo}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={salvarDadosPessoais}>
                Salvar Dados Pessoais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Análise
            </CardTitle>
            <CardDescription>
              Configure parâmetros para análise de fianças
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <Label htmlFor="taxaMinima">Taxa Mínima de Fiança (%)</Label>
                <Input
                  id="taxaMinima"
                  type="number"
                  step="0.1"
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
                  step="0.1"
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

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como e quando receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-gray-500">
                    Receber notificações importantes por e-mail
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
                    Receber notificações urgentes por SMS
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

        {/* Modo Manutenção */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sistema & Manutenção
            </CardTitle>
            <CardDescription>
              Configure aspectos técnicos da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
          </CardContent>
        </Card>

        {/* API da Plataforma */}
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
