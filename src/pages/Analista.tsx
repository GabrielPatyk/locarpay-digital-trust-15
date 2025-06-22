
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalista } from '@/hooks/useAnalista';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import EditScoreModal from '@/components/EditScoreModal';
import { 
  Search, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Edit,
  AlertTriangle
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type FiancaParaAnalise = Tables<'fiancas_para_analise'>;

const Analista = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    fiancasParaAnalise,
    isLoadingFiancas,
    estatisticas,
    isLoadingStats,
    updateScoreETaxa,
    isUpdatingScore,
    aprovarFianca,
    isApprovingFianca,
    reprovarFianca,
    isReprovingFianca
  } = useAnalista();

  const [selectedFianca, setSelectedFianca] = useState<FiancaParaAnalise | null>(null);
  const [isConsultingScore, setIsConsultingScore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentTaxa, setCurrentTaxa] = useState<number>(0);

  const consultarScore = async () => {
    if (!selectedFianca) return;
    
    setIsConsultingScore(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock score generation (300-900)
    const score = Math.floor(Math.random() * (900 - 300) + 300);
    
    // Calculate rate based on score
    let taxa = 15;
    if (score >= 800) taxa = 8;
    else if (score >= 700) taxa = 10;
    else if (score >= 600) taxa = 12;
    else if (score >= 500) taxa = 15;
    
    setCurrentScore(score);
    setCurrentTaxa(taxa);
    
    // Update in database
    updateScoreETaxa({
      id: selectedFianca.id!,
      score,
      taxa
    });
    
    setIsConsultingScore(false);
    
    toast({
      title: "Score consultado com sucesso!",
      description: `Score: ${score} | Taxa aplicada: ${taxa}%`,
    });
  };

  const handleEditScore = (score: number, taxa: number) => {
    if (!selectedFianca) return;
    
    setCurrentScore(score);
    setCurrentTaxa(taxa);
    
    updateScoreETaxa({
      id: selectedFianca.id!,
      score,
      taxa
    });
    
    toast({
      title: "Score e taxa atualizados!",
      description: `Novo score: ${score} | Nova taxa: ${taxa}%`,
    });
  };

  const handleAprovarProposta = () => {
    if (!selectedFianca) return;

    aprovarFianca({
      id: selectedFianca.id!,
      score: currentScore,
      taxa: currentTaxa
    });

    setSelectedFianca(null);
    
    toast({
      title: "Proposta aprovada!",
      description: "Contrato será gerado e enviado para assinatura.",
    });
  };

  const handleReprovarProposta = (motivo: string = 'Score insuficiente') => {
    if (!selectedFianca) return;

    reprovarFianca({
      id: selectedFianca.id!,
      motivo,
      score: currentScore,
      taxa: currentTaxa
    });

    setSelectedFianca(null);
    
    toast({
      title: "Proposta reprovada",
      description: `Motivo: ${motivo}`,
      variant: "destructive"
    });
  };

  const filteredFiancas = fiancasParaAnalise.filter(f => 
    f.status_fianca === 'em_analise' && (
      f.inquilino_nome_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.inquilino_cpf?.includes(searchTerm) ||
      f.imobiliaria_nome?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Set current score and taxa when selecting a fianca
  React.useEffect(() => {
    if (selectedFianca) {
      setCurrentScore(selectedFianca.score_credito || 0);
      setCurrentTaxa(selectedFianca.taxa_aplicada || 0);
    }
  }, [selectedFianca]);

  if (isLoadingFiancas || isLoadingStats) {
    return (
      <Layout title="Dashboard - Analista">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard - Analista">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Container */}
        <div className="relative overflow-hidden rounded-xl p-6" style={{
          background: 'linear-gradient(135deg, #F4D573, #BC942C)',
        }}>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-[#0C1C2E] mb-2">
              {getGreeting()}, {user?.name}! 👋
            </h1>
            <p className="text-[#0C1C2E]/80">
              Bem-vindo ao seu painel de análise de crédito. Você tem {estatisticas?.pendentes || 0} {(estatisticas?.pendentes || 0) === 1 ? 'proposta pendente' : 'propostas pendentes'} para análise.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-warning">{estatisticas?.pendentes || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-success">{estatisticas?.aprovadas || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reprovados</p>
                  <p className="text-2xl font-bold text-red-500">{estatisticas?.reprovadas || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Média</p>
                  <p className="text-2xl font-bold text-primary">{estatisticas?.taxaMedia || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposals List */}
          <Card>
            <CardHeader>
              <CardTitle>Propostas para Análise</CardTitle>
              <CardDescription>
                Clique em uma proposta para analisar
              </CardDescription>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, CPF ou imobiliária..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFiancas.map((fianca) => (
                  <div
                    key={fianca.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      selectedFianca?.id === fianca.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFianca(fianca)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{fianca.inquilino_nome_completo}</h4>
                      <Badge variant="secondary">Pendente</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">CPF: {fianca.inquilino_cpf}</p>
                    <p className="text-sm text-gray-600 mb-1">Renda: {formatCurrency(fianca.inquilino_renda_mensal || 0)}</p>
                    <p className="text-sm text-gray-600 mb-1">Aluguel: {formatCurrency(fianca.imovel_valor_aluguel || 0)}</p>
                    <p className="text-sm text-gray-500">{fianca.imobiliaria_nome || 'Imobiliária não informada'}</p>
                  </div>
                ))}
                
                {filteredFiancas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                    <p>Nenhuma proposta pendente encontrada</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Proposta</CardTitle>
              <CardDescription>
                {selectedFianca ? 'Dados detalhados da proposta selecionada' : 'Selecione uma proposta para analisar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFianca ? (
                <div className="space-y-4">
                  {/* Dados do Inquilino */}
                  <div>
                    <h4 className="font-semibold mb-3 text-primary">Dados do Inquilino</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Nome Completo</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.inquilino_nome_completo}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">CPF</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.inquilino_cpf}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">E-mail</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.inquilino_email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">WhatsApp</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.inquilino_whatsapp}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Renda Mensal</Label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedFianca.inquilino_renda_mensal || 0)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Label className="text-sm font-medium">Endereço do Inquilino</Label>
                      <p className="text-sm text-gray-900">
                        {selectedFianca.inquilino_endereco}, {selectedFianca.inquilino_numero}
                        {selectedFianca.inquilino_complemento && `, ${selectedFianca.inquilino_complemento}`}
                        <br />
                        {selectedFianca.inquilino_bairro}, {selectedFianca.inquilino_cidade} - {selectedFianca.inquilino_estado}
                      </p>
                    </div>
                  </div>

                  {/* Dados do Imóvel */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-primary">Dados do Imóvel</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Tipo de Imóvel</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.imovel_tipo}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tipo de Locação</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.imovel_tipo_locacao}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Valor do Aluguel</Label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedFianca.imovel_valor_aluguel || 0)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Área (m²)</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.imovel_area_metros || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tempo de Locação</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.imovel_tempo_locacao} meses</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Label className="text-sm font-medium">Endereço do Imóvel</Label>
                      <p className="text-sm text-gray-900">
                        {selectedFianca.imovel_endereco}, {selectedFianca.imovel_numero}
                        {selectedFianca.imovel_complemento && `, ${selectedFianca.imovel_complemento}`}
                        <br />
                        {selectedFianca.imovel_bairro}, {selectedFianca.imovel_cidade} - {selectedFianca.imovel_estado}
                      </p>
                    </div>

                    {selectedFianca.imovel_descricao && (
                      <div className="mt-3">
                        <Label className="text-sm font-medium">Descrição</Label>
                        <p className="text-sm text-gray-900">{selectedFianca.imovel_descricao}</p>
                      </div>
                    )}
                  </div>

                  {/* Dados da Imobiliária */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-primary">Dados da Imobiliária</h4>
                    <div>
                      <Label className="text-sm font-medium">Imobiliária</Label>
                      <p className="text-sm text-gray-900">{selectedFianca.imobiliaria_nome || 'Não informado'}</p>
                    </div>
                    <div className="mt-2">
                      <Label className="text-sm font-medium">Responsável</Label>
                      <p className="text-sm text-gray-900">{selectedFianca.imobiliaria_responsavel || 'Não informado'}</p>
                    </div>
                  </div>

                  {/* Data de Criação */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">Data de Criação</Label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedFianca.data_criacao || '')}</p>
                  </div>

                  {/* Score e Taxa */}
                  {(currentScore > 0 || currentTaxa > 0) && (
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <strong>Score de Crédito:</strong> {currentScore} pontos<br />
                            <strong>Taxa Aplicada:</strong> {currentTaxa}%
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEditModal(true)}
                            className="ml-2"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-4">
                    {(!currentScore || currentScore === 0) && (
                      <Button
                        onClick={consultarScore}
                        disabled={isConsultingScore}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        {isConsultingScore ? 'Consultando Score...' : 'Consultar Score de Crédito'}
                      </Button>
                    )}

                    {currentScore > 0 && (
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleAprovarProposta}
                          disabled={isApprovingFianca}
                          className="flex-1 bg-success hover:bg-success/90"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {isApprovingFianca ? 'Aprovando...' : 'Aprovar'}
                        </Button>
                        <Button
                          onClick={() => handleReprovarProposta('Score insuficiente')}
                          disabled={isReprovingFianca}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {isReprovingFianca ? 'Reprovando...' : 'Reprovar'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="mx-auto h-12 w-12 mb-4" />
                  <p>Selecione uma proposta na lista ao lado para começar a análise</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Score Modal */}
        <EditScoreModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          currentScore={currentScore}
          currentTaxa={currentTaxa}
          onSave={handleEditScore}
          isLoading={isUpdatingScore}
        />
      </div>
    </Layout>
  );
};

export default Analista;
