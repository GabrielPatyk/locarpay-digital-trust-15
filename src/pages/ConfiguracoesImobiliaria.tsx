import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { useImobiliariaData } from '@/hooks/useImobiliariaData';
import Layout from '@/components/Layout';
import ImageUpload from '@/components/ImageUpload';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  User, 
  Bell, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileCheck
} from 'lucide-react';

const ConfiguracoesImobiliaria = () => {
  const { user, updateUser } = useAuth();
  const { profile, updateProfile, updateUserData, updatePassword, loading } = useUserProfile();
  const { formatPhone, formatCNPJ, unformatPhone, unformatCNPJ, isValidPhone } = usePhoneFormatter();
  const { cnpj: currentCnpj, isLoading: cnpjLoading } = useImobiliariaData();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showCompanyConfirmation, setShowCompanyConfirmation] = useState(false);
  const [showPersonalConfirmation, setShowPersonalConfirmation] = useState(false);
  const [pendingCompanyChanges, setPendingCompanyChanges] = useState<Record<string, string>>({});
  const [pendingPersonalChanges, setPendingPersonalChanges] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Dados da empresa - campos vazios para edição
    nome_empresa: '',
    cnpj: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    
    // Dados pessoais - campos vazios para edição
    nome: '',
    email: '',
    telefone: '',
    imagem_perfil: user?.imagem_perfil || '',
    
    // Segurança
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notificações
    emailNotifications: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'telefone') {
      setFormData(prev => ({
        ...prev,
        [field]: formatPhone(value as string)
      }));
    } else if (field === 'cnpj') {
      setFormData(prev => ({
        ...prev,
        [field]: formatCNPJ(value as string)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveCompanyData = async () => {
    // Preparar dados para confirmação
    const changes = {
      'Nome da Empresa': formData.nome_empresa || '(não alterado)',
      'CNPJ': formData.cnpj || '(não alterado)',
      'Endereço': formData.endereco || '(não alterado)',
      'Número': formData.numero || '(não alterado)',
      'Complemento': formData.complemento || '(não alterado)',
      'Bairro': formData.bairro || '(não alterado)',
      'Cidade': formData.cidade || '(não alterado)',
      'Estado': formData.estado || '(não alterado)',
      'País': formData.pais || 'Brasil'
    };

    setPendingCompanyChanges(changes);
    setShowCompanyConfirmation(true);
  };

  const confirmCompanyChanges = async () => {
    // Filtrar apenas campos preenchidos
    const updateData: any = {};
    
    if (formData.nome_empresa.trim()) updateData.nome_empresa = formData.nome_empresa;
    if (formData.cnpj.trim()) updateData.cnpj = unformatCNPJ(formData.cnpj);
    if (formData.endereco.trim()) updateData.endereco = formData.endereco;
    if (formData.numero.trim()) updateData.numero = formData.numero;
    if (formData.complemento.trim()) updateData.complemento = formData.complemento;
    if (formData.bairro.trim()) updateData.bairro = formData.bairro;
    if (formData.cidade.trim()) updateData.cidade = formData.cidade;
    if (formData.estado.trim()) updateData.estado = formData.estado;
    if (formData.pais.trim()) updateData.pais = formData.pais;

    const success = await updateProfile(updateData);

    if (success) {
      toast({
        title: "Dados da empresa atualizados!",
        description: "As informações da empresa foram salvas com sucesso.",
      });
      setShowCompanyConfirmation(false);
      // Limpar os campos após salvar
      setFormData(prev => ({
        ...prev,
        nome_empresa: '',
        cnpj: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      }));
    }
  };

  const handleSavePersonalData = async () => {
    // Preparar dados para confirmação
    const changes = {
      'Nome Completo': formData.nome || '(não alterado)',
      'E-mail': formData.email || '(não alterado)',
      'Telefone': formData.telefone || '(não alterado)'
    };

    setPendingPersonalChanges(changes);
    setShowPersonalConfirmation(true);
  };

  const confirmPersonalChanges = async () => {
    // Filtrar apenas campos preenchidos
    const updateData: any = {};
    
    if (formData.nome.trim()) updateData.nome = formData.nome;
    if (formData.email.trim()) updateData.email = formData.email;
    if (formData.telefone.trim()) {
      if (!isValidPhone(formData.telefone)) {
        toast({
          title: "Telefone inválido",
          description: "O telefone deve ter 13 dígitos e começar com +55.",
          variant: "destructive",
        });
        return;
      }
      updateData.telefone = unformatPhone(formData.telefone);
    }

    const success = await updateUserData(updateData);

    if (success && user) {
      // Atualizar o contexto do usuário
      updateUser({
        ...user,
        name: updateData.nome || user.name,
        email: updateData.email || user.email,
        telefone: updateData.telefone || user.telefone
      });
      setShowPersonalConfirmation(false);
      // Limpar os campos após salvar
      setFormData(prev => ({
        ...prev,
        nome: '',
        email: '',
        telefone: ''
      }));
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro ao alterar senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const success = await updatePassword(formData.currentPassword, formData.newPassword);
    
    if (success) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  };

  const handleImageChange = async (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imagem_perfil: imageUrl }));
  };

  return (
    <Layout title="Configurações">
      <div className="space-y-6 animate-fade-in">
        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Foto de Perfil
            </CardTitle>
            <CardDescription>
              Atualize sua foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              currentImage={formData.imagem_perfil}
              onImageChange={handleImageChange}
              userName={user?.name || 'Usuário'}
            />
          </CardContent>
        </Card>

        {/* Account Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileCheck className="mr-2 h-5 w-5 text-primary" />
              Verificações de Conta
            </CardTitle>
            <CardDescription>
              Status das verificações da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">E-mail Verificado</p>
                <p className="text-sm text-gray-600">Status de verificação do seu e-mail</p>
              </div>
              <Badge className={user?.verificado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {user?.verificado ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verificado
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Não Verificado
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Conta Ativa</p>
                <p className="text-sm text-gray-600">Status da sua conta no sistema</p>
              </div>
              <Badge className={user?.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {user?.ativo ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Ativa
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Inativa
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Contrato de Parceria LocarPay</p>
                <p className="text-sm text-gray-600">Status da assinatura do contrato de parceria</p>
              </div>
              <Badge className={!user?.firstLogin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {!user?.firstLogin ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Assinado
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Pendente Assinatura
                  </>
                )}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-primary" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Informações básicas da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                <Input
                  id="nome_empresa"
                  value={formData.nome_empresa}
                  onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                  placeholder={profile?.nome_empresa || "Digite o nome da sua empresa"}
                />
                {profile?.nome_empresa && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.nome_empresa}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder={currentCnpj ? formatCNPJ(currentCnpj) : "00.000.000/0000-00"}
                  disabled={true}
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Campo não editável</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder={profile?.endereco || "Rua, Avenida, etc."}
                />
                {profile?.endereco && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.endereco}</p>
                )}
              </div>
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  placeholder={profile?.numero || "123"}
                />
                {profile?.numero && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.numero}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.complemento}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
                placeholder={profile?.complemento || "Sala, Andar, etc."}
              />
              {profile?.complemento && (
                <p className="text-xs text-gray-500 mt-1">Atual: {profile.complemento}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder={profile?.bairro || "Centro"}
                />
                {profile?.bairro && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.bairro}</p>
                )}
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder={profile?.cidade || "São Paulo"}
                />
                {profile?.cidade && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.cidade}</p>
                )}
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  placeholder={profile?.estado || "SP"}
                />
                {profile?.estado && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {profile.estado}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                value={formData.pais}
                onChange={(e) => handleInputChange('pais', e.target.value)}
                placeholder="Brasil"
              />
            </div>
            
            <Button 
              onClick={handleSaveCompanyData} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Dados da Empresa'}
            </Button>
          </CardContent>
        </Card>

        {/* Personal Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-success" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Informações do responsável pela conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder={user?.name || "Seu nome completo"}
                />
                {user?.name && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {user.name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={user?.email || "seu@email.com"}
                />
                {user?.email && (
                  <p className="text-xs text-gray-500 mt-1">Atual: {user.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder={user?.telefone ? formatPhone(user.telefone) : "+55 (11) 9 9999-9999"}
              />
              {user?.telefone && (
                <p className="text-xs text-gray-500 mt-1">Atual: {formatPhone(user.telefone)}</p>
              )}
            </div>
            
            <Button 
              onClick={handleSavePersonalData} 
              disabled={loading}
              className="bg-success hover:bg-success/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Dados Pessoais'}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-warning" />
              Segurança
            </CardTitle>
            <CardDescription>
              Altere sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Digite sua senha atual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Digite sua nova senha"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirme sua nova senha"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleChangePassword} 
              disabled={loading}
              className="bg-warning hover:bg-warning/90 text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications - Bloqueada */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" style={{ color: '#BC942C' }} />
              Notificações
              <AlertTriangle className="ml-2 h-4 w-4 text-red-500" />
            </CardTitle>
            <CardDescription>
              <span className="text-red-600 font-medium">Esta opção ainda está em desenvolvimento</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pointer-events-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por E-mail</p>
                <p className="text-sm text-gray-600">Receber notificações importantes por e-mail</p>
              </div>
              <Switch
                checked={formData.emailNotifications}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-gray-600">Receber alertas urgentes por SMS</p>
              </div>
              <Switch
                checked={formData.smsNotifications}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Semanais</p>
                <p className="text-sm text-gray-600">Receber resumo semanal de atividades</p>
              </div>
              <Switch
                checked={formData.weeklyReports}
                disabled
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios Mensais</p>
                <p className="text-sm text-gray-600">Receber relatório mensal detalhado</p>
              </div>
              <Switch
                checked={formData.monthlyReports}
                disabled
              />
            </div>
            
            <Button 
              disabled
              style={{ backgroundColor: '#BC942C' }} 
              className="hover:opacity-90 text-white opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Modais de Confirmação */}
        <ConfirmationModal
          isOpen={showCompanyConfirmation}
          onClose={() => setShowCompanyConfirmation(false)}
          onConfirm={confirmCompanyChanges}
          title="Confirmar Alterações - Dados da Empresa"
          description="Você está prestes a alterar os dados da empresa. Confirme as informações abaixo:"
          changes={pendingCompanyChanges}
          isLoading={loading}
        />

        <ConfirmationModal
          isOpen={showPersonalConfirmation}
          onClose={() => setShowPersonalConfirmation(false)}
          onConfirm={confirmPersonalChanges}
          title="Confirmar Alterações - Dados Pessoais"
          description="Você está prestes a alterar seus dados pessoais. Confirme as informações abaixo:"
          changes={pendingPersonalChanges}
          isLoading={loading}
        />
      </div>
    </Layout>
  );
};

export default ConfiguracoesImobiliaria;
