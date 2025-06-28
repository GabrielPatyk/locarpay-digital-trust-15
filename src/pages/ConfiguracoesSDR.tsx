
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import ImageUpload from '@/components/ImageUpload';
import { User, MapPin, Lock, Camera } from 'lucide-react';

interface PerfilUsuario {
  id?: string;
  usuario_id: string;
  nome_empresa?: string;
  cnpj?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
}

const ConfiguracoesSDR = () => {
  const { user, updateUser } = useAuth();
  const { formatPhone, formatCNPJ, unformatPhone, unformatCNPJ } = usePhoneFormatter();
  
  const [dadosPessoais, setDadosPessoais] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    telefone: user?.phone || '',
    cpf: user?.cpf || ''
  });

  const [perfil, setPerfil] = useState<PerfilUsuario>({
    usuario_id: user?.id || '',
    nome_empresa: '',
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

  const [loading, setLoading] = useState(false);
  const [imagemPerfil, setImagemPerfil] = useState<string>(user?.imagem_perfil || '');

  useEffect(() => {
    if (user?.id) {
      carregarPerfilUsuario();
    }
  }, [user?.id]);

  const carregarPerfilUsuario = async () => {
    try {
      const { data, error } = await supabase
        .from('perfil_usuario')
        .select('*')
        .eq('usuario_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPerfil({
          ...data,
          usuario_id: user?.id || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleInputChange = (section: 'pessoais' | 'perfil' | 'senhas', field: string, value: string) => {
    if (section === 'pessoais') {
      if (field === 'telefone') {
        setDadosPessoais(prev => ({ ...prev, [field]: formatPhone(value) }));
      } else {
        setDadosPessoais(prev => ({ ...prev, [field]: value }));
      }
    } else if (section === 'perfil') {
      if (field === 'cnpj') {
        setPerfil(prev => ({ ...prev, [field]: formatCNPJ(value) }));
      } else {
        setPerfil(prev => ({ ...prev, [field]: value }));
      }
    } else if (section === 'senhas') { 
      setSenhas(prev => ({ ...prev, [field]: value }));
    }
  };

  const salvarDadosPessoais = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosParaAtualizar = {
        nome: dadosPessoais.nome,
        telefone: unformatPhone(dadosPessoais.telefone),
        cpf: dadosPessoais.cpf
      };

      const { error } = await supabase
        .from('usuarios')
        .update(dadosParaAtualizar)
        .eq('id', user?.id);

      if (error) throw error;

      updateUser({
        ...user!,
        name: dadosPessoais.nome,
        phone: dadosParaAtualizar.telefone,
        cpf: dadosPessoais.cpf
      });

      toast({
        title: "Sucesso!",
        description: "Dados pessoais atualizados com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar dados pessoais:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados pessoais. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dadosEndereco = {
        ...perfil,
        cnpj: unformatCNPJ(perfil.cnpj || ''),
        usuario_id: user?.id
      };

      if (perfil.id) {
        const { error } = await supabase
          .from('perfil_usuario')
          .update(dadosEndereco)
          .eq('id', perfil.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('perfil_usuario')
          .insert(dadosEndereco)
          .select()
          .single();

        if (error) throw error;
        setPerfil(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Sucesso!",
        description: "Endereço atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar endereço. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const alterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (senhas.novaSenha !== senhas.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (senhas.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ senha: senhas.novaSenha })
        .eq('id', user?.id);

      if (error) throw error;

      setSenhas({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });

      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ imagem_perfil: imageUrl })
        .eq('id', user?.id);

      if (error) throw error;

      setImagemPerfil(imageUrl);
      updateUser({
        ...user!,
        imagem_perfil: imageUrl
      });

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar foto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar foto de perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout title="Configurações SDR">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do SDR</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações da conta</p>
        </div>

        <Tabs defaultValue="pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
            <TabsTrigger value="endereco">Endereço</TabsTrigger>
            <TabsTrigger value="foto">Foto de Perfil</TabsTrigger>
            <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
          </TabsList>

          <TabsContent value="pessoais">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Dados Pessoais
                </CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={salvarDadosPessoais} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={dadosPessoais.nome}
                        onChange={(e) => handleInputChange('pessoais', 'nome', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={dadosPessoais.email}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={dadosPessoais.telefone}
                        onChange={(e) => handleInputChange('pessoais', 'telefone', e.target.value)}
                        placeholder="+55 (11) 9 9999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={dadosPessoais.cpf}
                        onChange={(e) => handleInputChange('pessoais', 'cpf', e.target.value)}
                        placeholder="999.999.999-99"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endereco">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Informações de Endereço
                </CardTitle>
                <CardDescription>
                  Mantenha seu endereço atualizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={salvarEndereco} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                      <Input
                        id="nome_empresa"
                        value={perfil.nome_empresa || ''}
                        onChange={(e) => handleInputChange('perfil', 'nome_empresa', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={perfil.cnpj || ''}
                        onChange={(e) => handleInputChange('perfil', 'cnpj', e.target.value)}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={perfil.endereco || ''}
                        onChange={(e) => handleInputChange('perfil', 'endereco', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero">Número</Label>
                      <Input
                        id="numero"
                        value={perfil.numero || ''}
                        onChange={(e) => handleInputChange('perfil', 'numero', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={perfil.complemento || ''}
                        onChange={(e) => handleInputChange('perfil', 'complemento', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input
                        id="bairro"
                        value={perfil.bairro || ''}
                        onChange={(e) => handleInputChange('perfil', 'bairro', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input
                        id="cidade"
                        value={perfil.cidade || ''}
                        onChange={(e) => handleInputChange('perfil', 'cidade', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="estado">Estado</Label>
                      <Input
                        id="estado"
                        value={perfil.estado || ''}
                        onChange={(e) => handleInputChange('perfil', 'estado', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        value={perfil.pais || ''}
                        onChange={(e) => handleInputChange('perfil', 'pais', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Salvando...' : 'Salvar Endereço'}
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
                  Atualize sua foto de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ImageUpload
                    currentImage={imagemPerfil}
                    onImageUpload={handleImageUpload}
                    folder="perfil"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="senha">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura alterando sua senha regularmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={alterarSenha} className="space-y-4">
                  <div>
                    <Label htmlFor="senhaAtual">Senha Atual *</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhas.senhaAtual}
                      onChange={(e) => handleInputChange('senhas', 'senhaAtual', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="novaSenha">Nova Senha *</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhas.novaSenha}
                      onChange={(e) => handleInputChange('senhas', 'novaSenha', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha *</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhas.confirmarSenha}
                      onChange={(e) => handleInputChange('senhas', 'confirmarSenha', e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Alterando...' : 'Alterar Senha'}
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
