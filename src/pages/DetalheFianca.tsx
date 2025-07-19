import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Building,
  User,
  Home,
  CreditCard,
  Calendar,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Upload,
  Download,
  Loader2
} from 'lucide-react';

interface FiancaDetalhes {
  id: string;
  status_fianca: string;
  inquilino_nome_completo: string;
  inquilino_cpf: string;
  inquilino_email: string;
  inquilino_whatsapp: string;
  inquilino_renda_mensal: number;
  inquilino_endereco: string;
  inquilino_numero: string;
  inquilino_complemento?: string;
  inquilino_bairro: string;
  inquilino_cidade: string;
  inquilino_estado: string;
  inquilino_pais: string;
  imovel_tipo: string;
  imovel_tipo_locacao: string;
  imovel_valor_aluguel: number;
  imovel_area_metros?: number;
  imovel_tempo_locacao: number;
  imovel_descricao?: string;
  imovel_endereco: string;
  imovel_numero: string;
  imovel_complemento?: string;
  imovel_bairro: string;
  imovel_cidade: string;
  imovel_estado: string;
  imovel_pais: string;
  data_criacao: string;
  data_analise?: string;
  data_aprovacao?: string;
  score_credito?: number;
  taxa_aplicada?: number;
  motivo_reprovacao?: string;
  observacoes_aprovacao?: string;
  link_pagamento?: string;
  comprovante_pagamento?: string;
  situacao_pagamento?: string;
  valor_total_locacao?: number;
  valor_fianca?: number;
  imobiliaria?: {
    nome: string;
    email: string;
    telefone?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
}

interface HistoricoItem {
  id: string;
  acao: string;
  usuario_nome: string;
  data_criacao: string;
  detalhes?: string;
}

const DetalheFianca = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [fianca, setFianca] = useState<FiancaDetalhes | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [score, setScore] = useState('');
  const [taxa, setTaxa] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    fetchFiancaDetails();
    fetchHistorico();
  }, [id]);

  const fetchFiancaDetails = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from('fiancas_locaticias')
        .select(`
          *,
          usuarios!fiancas_locaticias_id_imobiliaria_fkey (
            id,
            nome,
            email,
            telefone
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar detalhes da fiança:', error);
        toast({
          title: "Erro ao carregar fiança",
          description: "Não foi possível carregar os detalhes da fiança.",
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        toast({
          title: "Fiança não encontrada",
          description: "A fiança solicitada não foi encontrada.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      // Buscar dados do perfil da imobiliária separadamente
      let perfilImobiliaria = null;
      if (data.usuarios?.id) {
        const { data: perfil } = await supabase
          .from('perfil_usuario')
          .select('*')
          .eq('usuario_id', data.usuarios.id)
          .single();
        
        perfilImobiliaria = perfil;
      }

      const fiancaFormatada: FiancaDetalhes = {
        ...data,
        imobiliaria: data.usuarios ? {
          nome: data.usuarios.nome,
          email: data.usuarios.email,
          telefone: data.usuarios.telefone,
          endereco: perfilImobiliaria?.endereco,
          numero: perfilImobiliaria?.numero,
          complemento: perfilImobiliaria?.complemento,
          bairro: perfilImobiliaria?.bairro,
          cidade: perfilImobiliaria?.cidade,
          estado: perfilImobiliaria?.estado,
          pais: perfilImobiliaria?.pais
        } : undefined
      };

      setFianca(fiancaFormatada);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao carregar os detalhes da fiança.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistorico = async () => {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from('historico_fiancas')
        .select('*')
        .eq('fianca_id', id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar histórico:', error);
        return;
      }

      // Remover duplicatas baseado na ação e data (mantendo apenas a mais recente de cada tipo)
      const historicoUnico = data?.reduce((acc: HistoricoItem[], current) => {
        const existingIndex = acc.findIndex(item => 
          item.acao === current.acao && 
          Math.abs(new Date(item.data_criacao).getTime() - new Date(current.data_criacao).getTime()) < 1000
        );
        
        if (existingIndex === -1) {
          acc.push(current);
        }
        
        return acc;
      }, []) || [];

      setHistorico(historicoUnico);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleAprovar = async () => {
    if (!score || !taxa || !fianca) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o score e a taxa.",
        variant: "destructive"
      });
      return;
    }

    setIsApproving(true);
    try {
      const scoreNum = parseInt(score);
      const taxaNum = parseFloat(taxa.replace(',', '.'));
      
      // Usar a função do useAnalista hook se disponível
      const { aprovarFianca } = await import('@/hooks/useAnalista');
      await aprovarFianca(fianca.id, scoreNum, taxaNum);
      
      setShowScoreModal(false);
      fetchFiancaDetails();
      fetchHistorico();
    } catch (error) {
      console.error('Erro ao aprovar fiança:', error);
      toast({
        title: "Erro ao aprovar",
        description: "Ocorreu um erro ao aprovar a fiança.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejeitar = async () => {
    if (!rejectReason.trim() || !fianca) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da rejeição.",
        variant: "destructive"
      });
      return;
    }

    setIsRejecting(true);
    try {
      // Usar a função do useAnalista hook se disponível
      const { rejeitarFianca } = await import('@/hooks/useAnalista');
      await rejeitarFianca(fianca.id, rejectReason);
      
      setShowRejectModal(false);
      fetchFiancaDetails();
      fetchHistorico();
    } catch (error) {
      console.error('Erro ao rejeitar fiança:', error);
      toast({
        title: "Erro ao rejeitar",
        description: "Ocorreu um erro ao rejeitar a fiança.",
        variant: "destructive"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'em_analise': 'bg-blue-500',
      'aprovada': 'bg-green-500',
      'rejeitada': 'bg-red-500',
      'ativa': 'bg-green-500',
      'vencida': 'bg-red-500',
      'cancelada': 'bg-gray-500',
      'enviada_ao_financeiro': 'bg-green-500',
      'aguardando_geracao_pagamento': 'bg-yellow-500',
      'pagamento_disponivel': 'bg-yellow-500',
      'comprovante_enviado': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'em_analise': 'Em Análise',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada',
      'ativa': 'Ativa',
      'vencida': 'Vencida',
      'cancelada': 'Cancelada',
      'enviada_ao_financeiro': 'Enviada ao Financeiro',
      'aguardando_geracao_pagamento': 'Aguardando Pagamento',
      'pagamento_disponivel': 'Aguardando Pagamento',
      'comprovante_enviado': 'Comprovante Enviado'
    };
    return labels[status] || status;
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 13 && numbers.startsWith('55')) {
      const areaCode = numbers.substring(2, 4);
      const firstDigit = numbers.substring(4, 5);
      const firstPart = numbers.substring(5, 9);
      const secondPart = numbers.substring(9, 13);
      return `+55 (${areaCode}) ${firstDigit} ${firstPart}-${secondPart}`;
    }
    return phone;
  };

  const canAnalyze = user?.type === 'analista' && fianca?.status_fianca === 'em_analise';
  const canManagePayment = (user?.type === 'admin' || user?.type === 'juridico') && 
    ['aprovada', 'enviada_ao_financeiro', 'aguardando_geracao_pagamento'].includes(fianca?.status_fianca || '');

  if (isLoading) {
    return (
      <Layout title="Detalhes da Fiança">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!fianca) {
    return (
      <Layout title="Fiança não encontrada">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Fiança não encontrada
          </h3>
          <Button onClick={() => navigate('/dashboard')}>
            Voltar ao Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Fiança - ${fianca.inquilino_nome_completo}`}>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Fiança - {fianca.inquilino_nome_completo}
              </h1>
              <p className="text-gray-600">ID: {fianca.id}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(fianca.status_fianca)} text-white text-lg px-4 py-2`}>
            {getStatusLabel(fianca.status_fianca)}
          </Badge>
        </div>

        {/* Ações de Análise */}
        {canAnalyze && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Ações de Análise</CardTitle>
              <CardDescription className="text-blue-600">
                Esta fiança está aguardando sua análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Dialog open={showScoreModal} onOpenChange={setShowScoreModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Aprovar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Aprovar Fiança</DialogTitle>
                      <DialogDescription>
                        Preencha as informações necessárias para aprovar esta fiança
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="score">Score de Crédito *</Label>
                        <Input
                          id="score"
                          type="number"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          placeholder="Ex: 650"
                          min="300"
                          max="999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxa">Taxa Aplicada (%) *</Label>
                        <Input
                          id="taxa"
                          value={taxa}
                          onChange={(e) => setTaxa(e.target.value)}
                          placeholder="Ex: 12,5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          placeholder="Observações sobre a aprovação..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowScoreModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAprovar} disabled={isApproving}>
                        {isApproving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Aprovando...
                          </>
                        ) : (
                          'Aprovar'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejeitar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rejeitar Fiança</DialogTitle>
                      <DialogDescription>
                        Informe o motivo da rejeição desta fiança
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="motivo">Motivo da Rejeição *</Label>
                        <Textarea
                          id="motivo"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Descreva o motivo da rejeição..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={handleRejeitar} disabled={isRejecting}>
                        {isRejecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rejeitando...
                          </>
                        ) : (
                          'Rejeitar'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de informações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados da Imobiliária */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Dados da Imobiliária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fianca.imobiliaria ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome da Imobiliária</p>
                    <p className="text-base">{fianca.imobiliaria.nome}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">E-mail</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-base">{fianca.imobiliaria.email}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-base">{formatPhone(fianca.imobiliaria.telefone || '')}</span>
                      </div>
                    </div>
                  </div>
                  {fianca.imobiliaria.endereco && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Endereço</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-base">
                          {fianca.imobiliaria.endereco}, {fianca.imobiliaria.numero}
                          {fianca.imobiliaria.complemento && `, ${fianca.imobiliaria.complemento}`}
                          <br />
                          {fianca.imobiliaria.bairro}, {fianca.imobiliaria.cidade} - {fianca.imobiliaria.estado}
                          <br />
                          {fianca.imobiliaria.pais}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">Informações da imobiliária não disponíveis</p>
              )}
            </CardContent>
          </Card>

          {/* Dados do Inquilino */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Dados do Inquilino
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                  <p className="text-base">{fianca.inquilino_nome_completo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CPF</p>
                  <p className="text-base">{fianca.inquilino_cpf}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-base">{fianca.inquilino_email}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-base">{formatPhone(fianca.inquilino_whatsapp)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Renda Mensal</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-base font-medium text-green-600">
                    R$ {fianca.inquilino_renda_mensal.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Endereço</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-base">
                    {fianca.inquilino_endereco}, {fianca.inquilino_numero}
                    {fianca.inquilino_complemento && `, ${fianca.inquilino_complemento}`}
                    <br />
                    {fianca.inquilino_bairro}, {fianca.inquilino_cidade} - {fianca.inquilino_estado}
                    <br />
                    {fianca.inquilino_pais}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dados do Imóvel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Dados do Imóvel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo do Imóvel</p>
                <p className="text-base capitalize">{fianca.imovel_tipo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo de Locação</p>
                <p className="text-base capitalize">{fianca.imovel_tipo_locacao}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tempo de Locação</p>
                <p className="text-base">{fianca.imovel_tempo_locacao} meses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Valor do Aluguel Mensal</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-lg font-bold text-green-600">
                    R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              {fianca.imovel_area_metros && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Área em m²</p>
                  <p className="text-base">{fianca.imovel_area_metros}m²</p>
                </div>
              )}
            </div>

            {fianca.imovel_descricao && (
              <div>
                <p className="text-sm font-medium text-gray-500">Descrição do Imóvel</p>
                <p className="text-base">{fianca.imovel_descricao}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-500">Endereço do Imóvel</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-base">
                  {fianca.imovel_endereco}, {fianca.imovel_numero}
                  {fianca.imovel_complemento && `, ${fianca.imovel_complemento}`}
                  <br />
                  {fianca.imovel_bairro}, {fianca.imovel_cidade} - {fianca.imovel_estado}
                  <br />
                  {fianca.imovel_pais}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Pagamento */}
        {(fianca.status_fianca !== 'em_analise' && fianca.status_fianca !== 'rejeitada') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Descrição detalhada do pagamento */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cálculo da Fiança</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Valor do Aluguel Mensal:</strong> R$ {fianca.imovel_valor_aluguel.toLocaleString('pt-BR')}</p>
                  <p><strong>Valor Total Aluguel:</strong> R$ {(fianca.valor_total_locacao || (fianca.imovel_valor_aluguel * fianca.imovel_tempo_locacao)).toLocaleString('pt-BR')} (Período de: {fianca.imovel_tempo_locacao} meses)</p>
                  {fianca.taxa_aplicada && (
                    <>
                      <p><strong>Taxa Fiança:</strong> {fianca.taxa_aplicada}%</p>
                      <p><strong>Valor da Fiança:</strong> R$ {(fianca.valor_fianca || ((fianca.valor_total_locacao || (fianca.imovel_valor_aluguel * fianca.imovel_tempo_locacao)) * (fianca.taxa_aplicada / 100))).toLocaleString('pt-BR')}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fianca.score_credito && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Score de Crédito</p>
                    <p className="text-lg font-bold text-blue-600">{fianca.score_credito}</p>
                  </div>
                )}
                {fianca.taxa_aplicada && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Taxa Aplicada</p>
                    <p className="text-lg font-bold text-orange-600">{fianca.taxa_aplicada}%</p>
                  </div>
                )}
              </div>

              {fianca.link_pagamento && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Link de Pagamento</p>
                  <a 
                    href={fianca.link_pagamento} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {fianca.link_pagamento}
                  </a>
                </div>
              )}

              {fianca.situacao_pagamento && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Situação do Pagamento</p>
                  <Badge className={fianca.situacao_pagamento === 'confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {fianca.situacao_pagamento === 'confirmado' ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
              )}

              {canManagePayment && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowLinkModal(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Link Pagamento
                  </Button>
                  
                  <Button 
                    variant="outline"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Anexar Comprovante
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Histórico de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Histórico de Atividades
            </CardTitle>
            <CardDescription>
              Acompanhe todas as ações realizadas nesta fiança
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historico.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    {item.acao.includes('aprovada') && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {item.acao.includes('rejeitada') && <XCircle className="h-4 w-4 text-red-600" />}
                    {item.acao.includes('criada') && <FileText className="h-4 w-4 text-blue-600" />}
                    {!item.acao.includes('aprovada') && !item.acao.includes('rejeitada') && !item.acao.includes('criada') && (
                      <Clock className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{item.acao}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.data_criacao).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">Por: {item.usuario_nome}</p>
                    {item.detalhes && (
                      <p className="text-sm text-gray-500 mt-1">{item.detalhes}</p>
                    )}
                    {item.acao === 'Fiança aprovada' && fianca.score_credito && fianca.taxa_aplicada && (
                      <p className="text-sm text-gray-500 mt-1">
                        Score: {fianca.score_credito}, Taxa: {fianca.taxa_aplicada}% - 
                        Valor total da Locação: R$ {(fianca.valor_total_locacao || (fianca.imovel_valor_aluguel * fianca.imovel_tempo_locacao)).toLocaleString('pt-BR')}, 
                        Valor da Fiança: R$ {(fianca.valor_fianca || ((fianca.valor_total_locacao || (fianca.imovel_valor_aluguel * fianca.imovel_tempo_locacao)) * (fianca.taxa_aplicada / 100))).toLocaleString('pt-BR')}.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DetalheFianca;
