
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, FileText, Users, Calendar, ArrowLeft, Upload, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentosImobiliariaEspecifica } from '@/hooks/useDocumentosImobiliariaEspecifica';
import { useContratoParceria } from '@/hooks/useContratoParceria';
import { useAuth } from '@/contexts/AuthContext';
import DocumentoImobiliariaUpload from '@/components/DocumentoImobiliariaUpload';
import { useToast } from '@/hooks/use-toast';
import { useAprovarDocumentos } from '@/hooks/useAprovarDocumentos';
import RejectReasonModal from '@/components/RejectReasonModal';

const DetalheImobiliaria = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

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

  // Hook para documentos da imobiliária específica
  const { documentos, todosDocumentosVerificados, algumDocumentoPendente, refetch: refetchDocumentos } = useDocumentosImobiliariaEspecifica(id);
  
  // Hook para contrato de parceria
  const { contrato: contratoStatus, isLoading: loadingContrato } = useContratoParceria(id || '');
  
  // Hook para aprovar documentos (apenas para admin)
  const { aprovarDocumento, isProcessing } = useAprovarDocumentos();

  // Estados para rejeição de documentos
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [documentToReject, setDocumentToReject] = useState<{
    tipo: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci';
    nome: string;
  } | null>(null);

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verificado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejeitado':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'verificando':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verificado':
        return 'bg-green-100 text-green-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      case 'verificando':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUploadSuccess = () => {
    refetchDocumentos();
    toast({
      title: "Upload realizado!",
      description: "Documento enviado com sucesso.",
    });
  };

  const handleAprovarDocumento = (tipoDocumento: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci', aprovar: boolean) => {
    if (!documentos?.id) return;
    
    aprovarDocumento({
      perfilId: documentos.id,
      tipoDocumento,
      aprovar
    });
  };

  const handleRejectDocument = (tipo: 'cartao_cnpj' | 'comprovante_endereco' | 'cartao_creci', nome: string) => {
    setDocumentToReject({ tipo, nome });
    setRejectModalOpen(true);
  };

  const confirmRejectDocument = (motivo: string) => {
    if (!documentos?.id || !documentToReject) return;
    
    aprovarDocumento({
      perfilId: documentos.id,
      tipoDocumento: documentToReject.tipo,
      aprovar: false,
      motivo
    });
  };

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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/imobiliarias-admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Imobiliária</h1>
        </div>

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

        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos da Imobiliária</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CNPJ */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Cartão CNPJ</h4>
                  {getDocumentStatusIcon(documentos?.status_cartao_cnpj || 'pendente')}
                </div>
                <Badge className={`mb-3 ${getDocumentStatusColor(documentos?.status_cartao_cnpj || 'pendente')}`}>
                  {documentos?.status_cartao_cnpj === 'verificado' ? 'Verificado' :
                   documentos?.status_cartao_cnpj === 'verificando' ? 'Em verificação' : 
                   documentos?.status_cartao_cnpj === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                </Badge>
                {documentos?.motivo_rejeicao_cartao_cnpj && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Motivo da rejeição:</strong> {documentos.motivo_rejeicao_cartao_cnpj}
                  </div>
                )}
                <div className="space-y-2">
                  {documentos?.cartao_cnpj && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        try {
                          const newWindow = window.open(documentos.cartao_cnpj, '_blank');
                          if (!newWindow) {
                            // Fallback: force download
                            const link = document.createElement('a');
                            link.href = documentos.cartao_cnpj!;
                            link.download = 'cartao_cnpj';
                            link.click();
                          }
                        } catch {
                          // Fallback: force download
                          const link = document.createElement('a');
                          link.href = documentos.cartao_cnpj!;
                          link.download = 'cartao_cnpj';
                          link.click();
                        }
                      }}
                      className="w-full"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Documento
                    </Button>
                  )}
                  {user?.cargo === 'admin' && documentos?.cartao_cnpj && documentos?.status_cartao_cnpj === 'verificando' && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAprovarDocumento('cartao_cnpj', true)}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectDocument('cartao_cnpj', 'Cartão CNPJ')}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                  {((user?.cargo === 'executivo' && imobiliaria?.criado_por === user?.id) || user?.cargo === 'admin') && id && (
                    <DocumentoImobiliariaUpload
                      onUploadSuccess={handleUploadSuccess}
                      label={documentos?.cartao_cnpj ? "Substituir CNPJ" : "Upload CNPJ"}
                      imobiliariaId={id}
                      tipoDocumento="cartao_cnpj"
                    />
                  )}
                </div>
              </div>

              {/* Comprovante de Endereço */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Comprovante Endereço</h4>
                  {getDocumentStatusIcon(documentos?.status_comprovante_endereco || 'pendente')}
                </div>
                <Badge className={`mb-3 ${getDocumentStatusColor(documentos?.status_comprovante_endereco || 'pendente')}`}>
                  {documentos?.status_comprovante_endereco === 'verificado' ? 'Verificado' :
                   documentos?.status_comprovante_endereco === 'verificando' ? 'Em verificação' : 
                   documentos?.status_comprovante_endereco === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                </Badge>
                {documentos?.motivo_rejeicao_comprovante_endereco && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Motivo da rejeição:</strong> {documentos.motivo_rejeicao_comprovante_endereco}
                  </div>
                )}
                <div className="space-y-2">
                  {documentos?.comprovante_endereco && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        try {
                          const newWindow = window.open(documentos.comprovante_endereco, '_blank');
                          if (!newWindow) {
                            // Fallback: force download
                            const link = document.createElement('a');
                            link.href = documentos.comprovante_endereco!;
                            link.download = 'comprovante_endereco';
                            link.click();
                          }
                        } catch {
                          // Fallback: force download
                          const link = document.createElement('a');
                          link.href = documentos.comprovante_endereco!;
                          link.download = 'comprovante_endereco';
                          link.click();
                        }
                      }}
                      className="w-full"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Documento
                    </Button>
                  )}
                  {(() => {
                    console.log('DEBUG ADMIN BUTTONS - user?.cargo:', user?.cargo);
                    console.log('DEBUG ADMIN BUTTONS - documentos?.comprovante_endereco:', documentos?.comprovante_endereco);
                    console.log('DEBUG ADMIN BUTTONS - documentos?.status_comprovante_endereco:', documentos?.status_comprovante_endereco);
                    console.log('DEBUG ADMIN BUTTONS - condition result:', user?.cargo === 'admin' && documentos?.comprovante_endereco && documentos?.status_comprovante_endereco === 'verificando');
                    return user?.cargo === 'admin' && documentos?.comprovante_endereco && documentos?.status_comprovante_endereco === 'verificando';
                  })() && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAprovarDocumento('comprovante_endereco', true)}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectDocument('comprovante_endereco', 'Comprovante de Endereço')}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                  {((user?.cargo === 'executivo' && imobiliaria?.criado_por === user?.id) || user?.cargo === 'admin') && id && (
                    <DocumentoImobiliariaUpload
                      onUploadSuccess={handleUploadSuccess}
                      label={documentos?.comprovante_endereco ? "Substituir Endereço" : "Upload Endereço"}
                      imobiliariaId={id}
                      tipoDocumento="comprovante_endereco"
                    />
                  )}
                </div>
              </div>

              {/* CRECI */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Cartão CRECI</h4>
                  {getDocumentStatusIcon(documentos?.status_cartao_creci || 'pendente')}
                </div>
                <Badge className={`mb-3 ${getDocumentStatusColor(documentos?.status_cartao_creci || 'pendente')}`}>
                  {documentos?.status_cartao_creci === 'verificado' ? 'Verificado' :
                   documentos?.status_cartao_creci === 'verificando' ? 'Em verificação' : 
                   documentos?.status_cartao_creci === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                </Badge>
                {documentos?.motivo_rejeicao_cartao_creci && (
                  <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Motivo da rejeição:</strong> {documentos.motivo_rejeicao_cartao_creci}
                  </div>
                )}
                <div className="space-y-2">
                  {documentos?.cartao_creci && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        try {
                          const newWindow = window.open(documentos.cartao_creci, '_blank');
                          if (!newWindow) {
                            // Fallback: force download
                            const link = document.createElement('a');
                            link.href = documentos.cartao_creci!;
                            link.download = 'cartao_creci';
                            link.click();
                          }
                        } catch {
                          // Fallback: force download
                          const link = document.createElement('a');
                          link.href = documentos.cartao_creci!;
                          link.download = 'cartao_creci';
                          link.click();
                        }
                      }}
                      className="w-full"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Documento
                    </Button>
                  )}
                  {user?.cargo === 'admin' && documentos?.cartao_creci && documentos?.status_cartao_creci === 'verificando' && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAprovarDocumento('cartao_creci', true)}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRejectDocument('cartao_creci', 'Cartão CRECI')}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                  {((user?.cargo === 'executivo' && imobiliaria?.criado_por === user?.id) || user?.cargo === 'admin') && id && (
                    <DocumentoImobiliariaUpload
                      onUploadSuccess={handleUploadSuccess}
                      label={documentos?.cartao_creci ? "Substituir CRECI" : "Upload CRECI"}
                      imobiliariaId={id}
                      tipoDocumento="cartao_creci"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contrato de Parceria */}
        <Card>
          <CardHeader>
            <CardTitle>Contrato de Parceria LocarPay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Status do Contrato</h4>
                <p className="text-sm text-gray-600">
                  {loadingContrato ? 'Carregando...' : 
                   contratoStatus?.status_assinatura === 'assinado' ? 'Contrato assinado e ativo' :
                   contratoStatus?.status_assinatura === 'pendente' ? 'Aguardando assinatura' :
                   'Contrato não iniciado'}
                </p>
              </div>
              <Badge className={
                contratoStatus?.status_assinatura === 'assinado' ? 'bg-green-100 text-green-800' :
                contratoStatus?.status_assinatura === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }>
                {contratoStatus?.status_assinatura === 'assinado' ? 'Assinado' :
                 contratoStatus?.status_assinatura === 'pendente' ? 'Pendente' : 'Não iniciado'}
              </Badge>
            </div>
          </CardContent>
        </Card>

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

        {/* Modal de Rejeição */}
        <RejectReasonModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={confirmRejectDocument}
          documentType={documentToReject?.nome || ''}
          isLoading={isProcessing}
        />
      </div>
    </Layout>
  );
};

export default DetalheImobiliaria;
