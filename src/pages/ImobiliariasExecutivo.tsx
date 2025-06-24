
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useImobiliariasExecutivo, type NovaImobiliariaData, type ImobiliariaComPerfil } from '@/hooks/useImobiliariasExecutivo';
import { usePhoneFormatter } from '@/hooks/usePhoneFormatter';
import { toast } from '@/hooks/use-toast';
import { 
  Building, 
  Plus, 
  Phone, 
  Mail, 
  MapPin,
  User,
  FileText,
  Eye,
  Loader2,
  X
} from 'lucide-react';

const ImobiliariasExecutivo = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedImobiliaria, setSelectedImobiliaria] = useState<ImobiliariaComPerfil | null>(null);
  const [formData, setFormData] = useState<NovaImobiliariaData>({
    nome: '',
    cnpj: '',
    contato: '',
    email: '',
    telefone: '+55 ',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'Brasil',
    observacoes: ''
  });

  const { formatPhone, formatCNPJ, unformatPhone, unformatCNPJ } = usePhoneFormatter();
  const { imobiliarias, stats, isLoading, criarImobiliaria, isCreating } = useImobiliariasExecutivo();

  const getStatusColor = (ativo: boolean) => {
    return ativo ? 'bg-success' : 'bg-red-500';
  };

  const getStatusText = (ativo: boolean) => {
    return ativo ? 'Ativa' : 'Inativa';
  };

  const handleInputChange = (field: keyof NovaImobiliariaData, value: string) => {
    if (field === 'telefone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else if (field === 'cnpj') {
      const formatted = formatCNPJ(value);
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Desformatar telefone e CNPJ antes de enviar
    const dadosFormatados = {
      ...formData,
      telefone: unformatPhone(formData.telefone),
      cnpj: unformatCNPJ(formData.cnpj)
    };
    
    try {
      await criarImobiliaria.mutateAsync(dadosFormatados);
      setShowNewForm(false);
      setFormData({
        nome: '',
        cnpj: '',
        contato: '',
        email: '',
        telefone: '+55 ',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: 'Brasil',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro ao criar imobiliária:', error);
    }
  };

  const handleLigar = (telefone: string) => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_self');
    } else {
      toast({
        title: "Telefone não disponível",
        description: "Esta imobiliária não possui telefone cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    } else {
      toast({
        title: "E-mail não disponível",
        description: "Esta imobiliária não possui e-mail cadastrado.",
        variant: "destructive",
      });
    }
  };

  const handleVerDetalhes = (imobiliaria: ImobiliariaComPerfil) => {
    setSelectedImobiliaria(imobiliaria);
    setShowDetailModal(true);
  };

  const formatPhoneForDisplay = (phone: string) => {
    if (!phone) return 'Não informado';
    const formatted = formatPhone(phone);
    return formatted;
  };

  const formatCNPJForDisplay = (cnpj: string) => {
    if (!cnpj) return 'Não informado';
    const formatted = formatCNPJ(cnpj);
    return formatted;
  };

  if (isLoading) {
    return (
      <Layout title="Minhas Imobiliárias">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Minhas Imobiliárias">
      <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Minhas Imobiliárias</h1>
            <p className="text-gray-600 text-sm">Gerencie suas imobiliárias parceiras</p>
          </div>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] text-sm w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Nova Imobiliária
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Cadastrar Nova Imobiliária</DialogTitle>
                <DialogDescription className="text-sm">
                  Preencha as informações da nova imobiliária parceira
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-sm">Nome da Imobiliária*</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj" className="text-sm">CNPJ*</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="contato" className="text-sm">Nome do Contato*</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => handleInputChange('contato', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-sm">Telefone*</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="+55 (11) 9 9999-9999"
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm">E-mail*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="endereco" className="text-sm">Endereço*</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="numero" className="text-sm">Número*</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => handleInputChange('numero', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="complemento" className="text-sm">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => handleInputChange('complemento', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bairro" className="text-sm">Bairro*</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => handleInputChange('bairro', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="cidade" className="text-sm">Cidade*</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado" className="text-sm">Estado*</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pais" className="text-sm">País</Label>
                    <Input
                      id="pais"
                      value={formData.pais}
                      className="text-sm bg-gray-100"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes" className="text-sm">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Informações adicionais sobre a parceria..."
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewForm(false)}
                    className="flex-1 text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E] text-sm"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      'Cadastrar'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{stats.totalImobiliarias}</p>
                </div>
                <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Ativas</p>
                  <p className="text-lg sm:text-2xl font-bold text-success">{stats.ativas}</p>
                </div>
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Fianças</p>
                  <p className="text-lg sm:text-2xl font-bold text-warning">{stats.totalFiancas}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Imobiliárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl">
              <Building className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Imobiliárias Parceiras
            </CardTitle>
            <CardDescription className="text-sm">
              Lista de imobiliárias cadastradas por você
            </CardDescription>
          </CardHeader>
          <CardContent>
            {imobiliarias.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma imobiliária cadastrada</h3>
                <p className="text-gray-600 mb-4">Comece cadastrando sua primeira imobiliária parceira.</p>
                <Button 
                  onClick={() => setShowNewForm(true)}
                  className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#E6C46E] hover:to-[#B48534] text-[#0C1C2E]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Imobiliária
                </Button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {imobiliarias.map((imobiliaria) => (
                  <div
                    key={imobiliaria.id}
                    className="p-3 sm:p-4 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{imobiliaria.nome}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          CNPJ: {formatCNPJForDisplay(imobiliaria.perfil_usuario?.cnpj || '')}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Contato: {imobiliaria.nome}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(imobiliaria.ativo)} text-white text-xs`}>
                        {getStatusText(imobiliaria.ativo)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">E-mail</p>
                        <p className="text-xs sm:text-sm font-medium truncate">{imobiliaria.email}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Telefone</p>
                        <p className="text-xs sm:text-sm font-medium">{formatPhoneForDisplay(imobiliaria.telefone || '')}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Total Fianças</p>
                        <p className="text-xs sm:text-sm font-medium">{imobiliaria.totalFiancas || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Valor Total</p>
                        <p className="text-xs sm:text-sm font-medium text-success">
                          R$ {(imobiliaria.valorTotal || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-xs sm:text-sm text-gray-500">Endereço</p>
                      <p className="text-xs sm:text-sm text-gray-900">
                        {imobiliaria.perfil_usuario ? 
                          `${imobiliaria.perfil_usuario.endereco}, ${imobiliaria.perfil_usuario.numero} - ${imobiliaria.perfil_usuario.bairro}, ${imobiliaria.perfil_usuario.cidade}/${imobiliaria.perfil_usuario.estado}` 
                          : 'Endereço não informado'
                        }
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleVerDetalhes(imobiliaria)}
                      >
                        <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Ver Detalhes</span>
                        <span className="sm:hidden">Detalhes</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleLigar(imobiliaria.telefone || '')}
                      >
                        <Phone className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Ligar</span>
                        <span className="sm:hidden">Ligar</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => handleEmail(imobiliaria.email)}
                      >
                        <Mail className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">E-mail</span>
                        <span className="sm:hidden">Email</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes da Imobiliária */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Detalhes da Imobiliária</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            {selectedImobiliaria && (
              <div className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Building className="mr-2 h-5 w-5" />
                        Informações Básicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nome da Imobiliária</Label>
                        <p className="text-sm font-medium">{selectedImobiliaria.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">CNPJ</Label>
                        <p className="text-sm font-medium">{formatCNPJForDisplay(selectedImobiliaria.perfil_usuario?.cnpj || '')}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                        <Badge className={`${getStatusColor(selectedImobiliaria.ativo)} text-white text-xs ml-2`}>
                          {getStatusText(selectedImobiliaria.ativo)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nome do Contato</Label>
                        <p className="text-sm font-medium">{selectedImobiliaria.nome}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                        <p className="text-sm font-medium">{selectedImobiliaria.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                        <p className="text-sm font-medium">{formatPhoneForDisplay(selectedImobiliaria.telefone || '')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Endereço */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedImobiliaria.perfil_usuario ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Logradouro</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.endereco}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Número</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.numero}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Complemento</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.complemento || 'Não informado'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Bairro</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.bairro}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Cidade</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.cidade}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Estado</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.estado}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">País</Label>
                          <p className="text-sm font-medium">{selectedImobiliaria.perfil_usuario.pais}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Endereço não informado</p>
                    )}
                  </CardContent>
                </Card>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Total de Fianças</Label>
                        <p className="text-2xl font-bold text-primary">{selectedImobiliaria.totalFiancas || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                        <p className="text-2xl font-bold text-success">R$ {(selectedImobiliaria.valorTotal || 0).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => handleLigar(selectedImobiliaria.telefone || '')}
                        className="w-full"
                        variant="outline"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Ligar
                      </Button>
                      <Button 
                        onClick={() => handleEmail(selectedImobiliaria.email)}
                        className="w-full"
                        variant="outline"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar E-mail
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ImobiliariasExecutivo;
