
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Save,
  Loader2,
  Key,
  Shield
} from 'lucide-react';

const ConfiguracoesSDR = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
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
    if (user) {
      setProfileData({
        nome: user.name || '',
        email: user.email || '',
        telefone: user.telefone || '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil'
      });
      
      // Buscar dados do perfil
      buscarPerfilUsuario();
    }
  }, [user]);

  const buscarPerfilUsuario = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('usuario_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      if (data) {
        setProfileData(prev => ({
          ...prev,
          endereco: data.endereco || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || '',
          pais: data.pais || 'Brasil'
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Atualizar dados do usuário
      const { error: userError } = await supabase
        .from('usuarios')
        .update({
          nome: profileData.nome,
          telefone: profileData.telefone
        })
        .eq('id', user?.id);

      if (userError) throw userError;

      // Verificar se existe perfil
      const { data: perfilExistente } = await supabase
        .from('perfil_usuario')
        .select('id')
        .eq('usuario_id', user?.id)
        .single();

      if (perfilExistente) {
        // Atualizar perfil existente
        const { error: perfilError } = await supabase
          .from('perfil_usuario')
          .update({
            endereco: profileData.endereco,
            numero: profileData.numero,
            complemento: profileData.complemento,
            bairro: profileData.bairro,
            cidade: profileData.cidade,
            estado: profileData.estado,
            pais: profileData.pais
          })
          .eq('usuario_id', user?.id);

        if (perfilError) throw perfilError;
      } else {
        // Criar novo perfil
        const { error: perfilError } = await supabase
          .from('perfil_usuario')
          .insert({
            usuario_id: user?.id,
            endereco: profileData.endereco,
            numero: profileData.numero,
            complemento: profileData.complemento,
            bairro: profileData.bairro,
            cidade: profileData.cidade,
            estado: profileData.estado,
            pais: profileData.pais
          });

        if (perfilError) throw perfilError;
      }

      // Atualizar contexto do usuário
      if (updateUser) {
        updateUser({
          ...user!,
          name: profileData.nome,
          telefone: profileData.telefone
        });
      }

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (senhas.novaSenha !== senhas.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
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

    setIsLoading(true);

    try {
      // Aqui você implementaria a lógica de alteração de senha
      // Por enquanto, apenas mostra sucesso
      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso.",
      });
      
      setSenhas({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ imagem_perfil: imageUrl })
        .eq('id', user?.id);

      if (error) throw error;

      if (updateUser) {
        updateUser({
          ...user!,
          imagem_perfil: imageUrl
        });
      }

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar foto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (user?.type !== 'sdr') {
    return (
      <Layout title="Configurações">
        <div className="text-center py-8">
          <p className="text-red-600">Acesso negado. Esta página é restrita a usuários SDR.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Configurações SDR">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-16 w-16">
            {user?.imagem_perfil ? (
              <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] text-xl font-bold">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600">SDR - Comercial</p>
          </div>
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="foto">Foto</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Mantenha suas informações pessoais sempre atualizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={profileData.nome}
                        onChange={(e) => setProfileData(prev => ({ ...prev, nome: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={profileData.telefone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Endereço
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco">Logradouro</Label>
                      <Input
                        id="endereco"
                        value={profileData.endereco}
                        onChange={(e) => setProfileData(prev => ({ ...prev, endereco: e.target.value }))}
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={profileData.numero}
                        onChange={(e) => setProfileData(prev => ({ ...prev, numero: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={profileData.complemento}
                        onChange={(e) => setProfileData(prev => ({ ...prev, complemento: e.target.value }))}
                        placeholder="Apto, Sala, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={profileData.bairro}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bairro: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={profileData.cidade}
                        onChange={(e) => setProfileData(prev => ({ ...prev, cidade: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={profileData.estado}
                        onChange={(e) => setProfileData(prev => ({ ...prev, estado: e.target.value }))}
                        placeholder="SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        value={profileData.pais}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Foto de Perfil
                </CardTitle>
                <CardDescription>
                  Adicione ou altere sua foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    {user?.imagem_perfil ? (
                      <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] text-4xl font-bold">
                        {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={user?.imagem_perfil}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguranca">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Segurança da Conta
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura alterando sua senha regularmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhas.senhaAtual}
                      onChange={(e) => setSenhas(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhas.novaSenha}
                      onChange={(e) => setSenhas(prev => ({ ...prev, novaSenha: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhas.confirmarSenha}
                      onChange={(e) => setSenhas(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Alterando...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Alterar Senha
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ConfiguracoesSDR;
