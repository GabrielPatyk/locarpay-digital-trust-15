
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';

const EditarImobiliaria = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatPhone, formatCNPJ, unformatPhone, unformatCNPJ } = usePhoneFormatter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
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

  const { data: imobiliaria, isLoading } = useQuery({
    queryKey: ['imobiliaria-edit', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          perfil_usuario(*)
        `)
        .eq('id', id)
        .eq('cargo', 'imobiliaria')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (imobiliaria) {
      setFormData({
        nome: imobiliaria.nome || '',
        email: imobiliaria.email || '',
        telefone: formatPhone(imobiliaria.telefone || ''),
        nome_empresa: imobiliaria.perfil_usuario?.nome_empresa || '',
        cnpj: formatCNPJ(imobiliaria.perfil_usuario?.cnpj || ''),
        endereco: imobiliaria.perfil_usuario?.endereco || '',
        numero: imobiliaria.perfil_usuario?.numero || '',
        complemento: imobiliaria.perfil_usuario?.complemento || '',
        bairro: imobiliaria.perfil_usuario?.bairro || '',
        cidade: imobiliaria.perfil_usuario?.cidade || '',
        estado: imobiliaria.perfil_usuario?.estado || '',
        pais: imobiliaria.perfil_usuario?.pais || 'Brasil'
      });
    }
  }, [imobiliaria, formatPhone, formatCNPJ]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!id) throw new Error('ID não encontrado');

      // Update usuario table
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({
          nome: data.nome,
          email: data.email,
          telefone: unformatPhone(data.telefone)
        })
        .eq('id', id);

      if (usuarioError) throw usuarioError;

      // Check if perfil_usuario exists
      const { data: perfilExistente } = await supabase
        .from('perfil_usuario')
        .select('id')
        .eq('usuario_id', id)
        .single();

      if (perfilExistente) {
        // Update existing perfil
        const { error: perfilError } = await supabase
          .from('perfil_usuario')
          .update({
            nome_empresa: data.nome_empresa,
            cnpj: unformatCNPJ(data.cnpj),
            endereco: data.endereco,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            pais: data.pais
          })
          .eq('usuario_id', id);

        if (perfilError) throw perfilError;
      } else {
        // Create new perfil
        const { error: perfilError } = await supabase
          .from('perfil_usuario')
          .insert({
            usuario_id: id,
            nome_empresa: data.nome_empresa,
            cnpj: unformatCNPJ(data.cnpj),
            endereco: data.endereco,
            numero: data.numero,
            complemento: data.complemento,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            pais: data.pais
          });

        if (perfilError) throw perfilError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Dados da imobiliária atualizados com sucesso.",
      });
      navigate('/imobiliarias-admin');
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: `Erro ao atualizar dados: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field === 'telefone') {
      value = formatPhone(value);
    } else if (field === 'cnpj') {
      value = formatCNPJ(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Layout title="Editar Imobiliária">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Editar Imobiliária">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/imobiliarias-admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Imobiliária</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
                  <Input
                    id="nome_empresa"
                    value={formData.nome_empresa}
                    onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nome">Nome do Responsável *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Dados de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="+55 (00) 0 0000-0000"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange('numero', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => handleInputChange('complemento', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pais">País</Label>
                    <Input
                      id="pais"
                      value={formData.pais}
                      onChange={(e) => handleInputChange('pais', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/imobiliarias-admin')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditarImobiliaria;
