import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useContratoStatus } from '@/hooks/useContratoStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Lock,
  Camera,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';

const ConfiguracoesImobiliaria = () => {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useUserProfile();
  const { contratoAssinado, loading: contratoLoading } = useContratoStatus();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cnpj: profile?.cnpj || '',
    nomeEmpresa: profile?.nome_empresa || '',
    endereco: profile?.endereco || '',
    numero: profile?.numero || '',
    complemento: profile?.complemento || '',
    bairro: profile?.bairro || '',
    cidade: profile?.cidade || '',
    estado: profile?.estado || '',
    pais: profile?.pais || 'Brasil'
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        cnpj: profile.cnpj || '',
        nomeEmpresa: profile.nome_empresa || '',
        endereco: profile.endereco || '',
        numero: profile.numero || '',
        complemento: profile.complemento || '',
        bairro: profile.bairro || '',
        cidade: profile.cidade || '',
        estado: profile.estado || '',
        pais: profile.pais || 'Brasil'
      }));
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSenhaChange = (field: string, value: string) => {
    setSenhaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        cnpj: formData.cnpj,
        nome_empresa: formData.nomeEmpresa,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        pais: formData.pais
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    if (user) {
      updateUser({
        ...user,
        imagem_perfil: imageUrl
      });
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    }
  };

  const getVerificationStatus = (field: string, value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { status: 'pending', icon: AlertCircle, text: 'Não verificado', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'verified', icon: CheckCircle2, text: 'Verificado', color: 'bg-green-100 text-green-800' };
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Conta</h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="verification">Verificações</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Foto de Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Foto de Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  currentImage={user?.imagem_perfil}
                  onImageChange={handleImageUpload}
                  userName={user?.name}
                />
              </CardContent>
            </Card>

            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                    <Input
                      id="nomeEmpresa"
                      value={formData.nomeEmpresa}
                      onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                      placeholder="Nome da sua imobiliária"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange('numero', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => handleInputChange('complemento', e.target.value)}
                      placeholder="Sala, Andar..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                      placeholder="Centro"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      placeholder="SP"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      value={formData.pais}
                      onChange={(e) => handleInputChange('pais', e.target.value)}
                      placeholder="Brasil"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Para sua segurança, altere sua senha regularmente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <Input
                    id="senhaAtual"
                    type="password"
                    value={senhaData.senhaAtual}
                    onChange={(e) => handleSenhaChange('senhaAtual', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <Input
                    id="novaSenha"
                    type="password"
                    value={senhaData.novaSenha}
                    onChange={(e) => handleSenhaChange('novaSenha', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={senhaData.confirmarSenha}
                    onChange={(e) => handleSenhaChange('confirmarSenha', e.target.value)}
                  />
                </div>
                <Button className="w-full">Alterar Senha</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verificações de Conta</CardTitle>
                <CardDescription>
                  Status das verificações necessárias para utilizar a plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* E-mail */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Badge className={user?.verificado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {user?.verificado ? 'Verificado' : 'Não verificado'}
                  </Badge>
                </div>

                {/* Telefone */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-gray-500">{user?.telefone || 'Não informado'}</p>
                    </div>
                  </div>
                  <Badge className={getVerificationStatus('telefone', user?.telefone).color}>
                    {getVerificationStatus('telefone', user?.telefone).text}
                  </Badge>
                </div>

                {/* CNPJ */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">CNPJ</p>
                      <p className="text-sm text-gray-500">{profile?.cnpj || 'Não informado'}</p>
                    </div>
                  </div>
                  <Badge className={getVerificationStatus('cnpj', profile?.cnpj).color}>
                    {getVerificationStatus('cnpj', profile?.cnpj).text}
                  </Badge>
                </div>

                {/* Contrato de Parceria LocarPay */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Contrato de Parceria LocarPay</p>
                      <p className="text-sm text-gray-500">Contrato de parceria para uso da plataforma</p>
                    </div>
                  </div>
                  {contratoLoading ? (
                    <Badge className="bg-gray-100 text-gray-800">
                      Carregando...
                    </Badge>
                  ) : (
                    <Badge className={contratoAssinado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {contratoAssinado ? 'Assinado' : 'Não assinado'}
                    </Badge>
                  )}
                </div>

                {/* Endereço */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Endereço Completo</p>
                      <p className="text-sm text-gray-500">
                        {profile?.endereco && profile?.cidade ? 
                          `${profile.endereco}, ${profile.cidade}` : 
                          'Não informado'
                        }
                      </p>
                    </div>
                  </div>
                  <Badge className={getVerificationStatus('endereco', profile?.endereco && profile?.cidade).color}>
                    {getVerificationStatus('endereco', profile?.endereco && profile?.cidade).text}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConfiguracoesImobiliaria;
