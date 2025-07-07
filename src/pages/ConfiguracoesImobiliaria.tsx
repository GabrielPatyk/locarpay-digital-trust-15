import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useImobiliariaStatus } from '@/hooks/useImobiliariaStatus';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building, 
  Lock, 
  Upload, 
  Save,
  CheckCircle,
  XCircle,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ConfiguracoesImobiliaria = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, loading, updateProfile, updateUserData, updatePassword } = useUserProfile();
  const { status: imobiliariaStatus, isLoading: statusLoading } = useImobiliariaStatus();

  const [dadosPessoais, setDadosPessoais] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cpf: user?.cpf || ''
  });

  const [dadosEmpresa, setDadosEmpresa] = useState({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil'
  });

  const [senhas, setSenhas] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    if (profile) {
      setDadosEmpresa({
        nomeEmpresa: profile.nome_empresa || '',
        cnpj: profile.cnpj || '',
        endereco: profile.endereco || '',
        numero: profile.numero || '',
        complemento: profile.complemento || '',
        bairro: profile.bairro || '',
        cidade: profile.cidade || '',
        estado: profile.estado || '',
        pais: profile.pais || 'Brasil'
      });
    }
  }, [profile]);

  const handleSalvarDadosPessoais = async () => {
    const success = await updateUserData({
      nome: dadosPessoais.nome,
      email: dadosPessoais.email,
      telefone: dadosPessoais.telefone
    });

    if (success) {
      toast({
        title: "Dados atualizados!",
        description: "Suas informações pessoais foram salvas com sucesso.",
      });
    }
  };

  const handleSalvarDadosEmpresa = async () => {
    const success = await updateProfile({
      nome_empresa: dadosEmpresa.nomeEmpresa,
      cnpj: dadosEmpresa.cnpj,
      endereco: dadosEmpresa.endereco,
      numero: dadosEmpresa.numero,
      complemento: dadosEmpresa.complemento,
      bairro: dadosEmpresa.bairro,
      cidade: dadosEmpresa.cidade,
      estado: dadosEmpresa.estado,
      pais: dadosEmpresa.pais
    });

    if (success) {
      toast({
        title: "Dados da empresa atualizados!",
        description: "As informações da empresa foram salvas com sucesso.",
      });
    }
  };

  const handleAlterarSenha = async () => {
    if (senhas.novaSenha !== senhas.confirmarSenha) {
      toast({
        title: "Erro",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (senhas.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const success = await updatePassword(senhas.senhaAtual, senhas.novaSenha);
    
    if (success) {
      setSenhas({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    }
  };

  return (
    <Layout title="Configurações">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Conta</h1>
        </div>

        <Tabs defaultValue="pessoais" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="empresa">Empresa</TabsTrigger>
            <TabsTrigger value="senha">Senha</TabsTrigger>
            <TabsTrigger value="foto">Foto</TabsTrigger>
            <TabsTrigger value="verificacoes">Verificações</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={dadosPessoais.nome}
                      onChange={(e) => setDadosPessoais(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={dadosPessoais.email}
                      onChange={(e) => setDadosPessoais(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={dadosPessoais.telefone}
                      onChange={(e) => setDadosPessoais(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={dadosPessoais.cpf}
                      onChange={(e) => setDadosPessoais(prev => ({ ...prev, cpf: e.target.value }))}
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSalvarDadosPessoais} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>
                  Configure os dados da sua imobiliária
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                    <Input
                      id="nomeEmpresa"
                      value={dadosEmpresa.nomeEmpresa}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
                      placeholder="Nome da sua imobiliária"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={dadosEmpresa.cnpj}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, cnpj: e.target.value }))}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={dadosEmpresa.endereco}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={dadosEmpresa.numero}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, numero: e.target.value }))}
                      placeholder="123"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={dadosEmpresa.complemento}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, complemento: e.target.value }))}
                      placeholder="Sala, Andar..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={dadosEmpresa.bairro}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, bairro: e.target.value }))}
                      placeholder="Centro, Vila..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={dadosEmpresa.cidade}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, cidade: e.target.value }))}
                      placeholder="São Paulo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={dadosEmpresa.estado}
                      onChange={(e) => setDadosEmpresa(prev => ({ ...prev, estado: e.target.value }))}
                      placeholder="SP"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSalvarDadosEmpresa} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="senha" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura com uma senha forte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhas.senhaAtual}
                      onChange={(e) => setSenhas(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhas.novaSenha}
                      onChange={(e) => setSenhas(prev => ({ ...prev, novaSenha: e.target.value }))}
                      placeholder="Digite a nova senha"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhas.confirmarSenha}
                      onChange={(e) => setSenhas(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleAlterarSenha} disabled={loading}>
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Foto de Perfil
                </CardTitle>
                <CardDescription>
                  Adicione ou altere sua foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verificacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Status de Verificações
                </CardTitle>
                <CardDescription>
                  Verifique o status das suas verificações e documentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {statusLoading ? (
                  <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-center space-x-3">
                        {imobiliariaStatus.emailVerificado ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <h3 className="font-medium">E-mail Verificado</h3>
                          <p className="text-sm text-muted-foreground">
                            {imobiliariaStatus.emailVerificado 
                              ? 'Seu e-mail foi verificado com sucesso' 
                              : 'Seu e-mail ainda não foi verificado'
                            }
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        imobiliariaStatus.emailVerificado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {imobiliariaStatus.emailVerificado ? 'Verificado' : 'Pendente'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div className="flex items-center space-x-3">
                        {imobiliariaStatus.contratoAssinado ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600" />
                        )}
                        <div>
                          <h3 className="font-medium">Contrato de Parceria</h3>
                          <p className="text-sm text-muted-foreground">
                            {imobiliariaStatus.contratoAssinado 
                              ? 'Contrato de parceria assinado com sucesso' 
                              : 'Contrato de parceria ainda não foi assinado'
                            }
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        imobiliariaStatus.contratoAssinado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {imobiliariaStatus.contratoAssinado ? 'Assinado' : 'Pendente'}
                      </div>
                    </div>

                    {imobiliariaStatus.emailVerificado && imobiliariaStatus.contratoAssinado && (
                      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <h3 className="font-medium text-green-800">Conta Totalmente Verificada</h3>
                            <p className="text-sm text-green-700">
                              Parabéns! Sua conta está completamente verificada e pronta para uso.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConfiguracoesImobiliaria;
