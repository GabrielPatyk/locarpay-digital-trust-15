
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Mail, Phone, FileText, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DetalheImobiliaria = () => {
  const { id } = useParams<{ id: string }>();

  const { data: imobiliaria, isLoading } = useQuery({
    queryKey: ['imobiliaria-detalhes', id],
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

  const { data: fiancas = [] } = useQuery({
    queryKey: ['imobiliaria-fiancas', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('*')
        .eq('id_imobiliaria', id)
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  const { data: inquilinos = [] } = useQuery({
    queryKey: ['imobiliaria-inquilinos', id],
    queryFn: async () => {
      if (!id) return [];

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select('inquilino_nome_completo, inquilino_cpf, inquilino_email')
        .eq('id_imobiliaria', id);

      if (error) throw error;
      
      // Remove duplicates based on CPF
      const uniqueInquilinos = data?.reduce((acc: any[], current) => {
        const exists = acc.find(item => item.inquilino_cpf === current.inquilino_cpf);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []) || [];

      return uniqueInquilinos;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout title="Detalhes da Imobiliária">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!imobiliaria) {
    return (
      <Layout title="Detalhes da Imobiliária">
        <div className="text-center py-8">
          <p className="text-red-600">Imobiliária não encontrada.</p>
        </div>
      </Layout>
    );
  }

  const stats = {
    totalFiancas: fiancas.length,
    fiancasAtivas: fiancas.filter(f => f.status_fianca === 'ativa').length,
    fiancasAprovadas: fiancas.filter(f => f.status_fianca === 'aprovada').length,
    totalInquilinos: inquilinos.length
  };

  return (
    <Layout title="Detalhes da Imobiliária">
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {imobiliaria.perfil_usuario?.nome_empresa || imobiliaria.nome}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={imobiliaria.ativo ? "bg-green-500" : "bg-red-500"}>
                    {imobiliaria.ativo ? 'Ativa' : 'Inativa'}
                  </Badge>
                  <Badge variant="outline">
                    Cadastrada em {new Date(imobiliaria.criado_em).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fianças</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalFiancas}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-green-500">{stats.fiancasAtivas}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.fiancasAprovadas}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inquilinos</p>
                  <p className="text-2xl font-bold text-purple-500">{stats.totalInquilinos}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome da Empresa</label>
                <p className="text-lg">{imobiliaria.perfil_usuario?.nome_empresa || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">CNPJ</label>
                <p className="text-lg">{imobiliaria.perfil_usuario?.cnpj || 'Não informado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Responsável</label>
                <p className="text-lg">{imobiliaria.nome}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg">{imobiliaria.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefone</label>
                  <p className="text-lg">{imobiliaria.telefone || 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                  <p className="text-lg">{new Date(imobiliaria.criado_em).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endereço */}
        {imobiliaria.perfil_usuario && (
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Endereço</label>
                  <p className="text-lg">{imobiliaria.perfil_usuario.endereco || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Cidade</label>
                  <p className="text-lg">{imobiliaria.perfil_usuario.cidade || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <p className="text-lg">{imobiliaria.perfil_usuario.estado || 'Não informado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fianças Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Fianças Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {fiancas.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Nenhuma fiança encontrada.</p>
            ) : (
              <div className="space-y-3">
                {fiancas.slice(0, 5).map((fianca) => (
                  <div key={fianca.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{fianca.inquilino_nome_completo}</p>
                      <p className="text-sm text-gray-600">
                        {fianca.imovel_endereco}, {fianca.imovel_numero}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        fianca.status_fianca === 'aprovada' ? 'bg-green-100 text-green-800' :
                        fianca.status_fianca === 'rejeitada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {fianca.status_fianca}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(fianca.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalheImobiliaria;
