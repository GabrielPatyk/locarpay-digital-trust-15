import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImoveisImobiliariaReal, CreateImovelData } from '@/hooks/useImoveisImobiliariaReal';
import { Home, X } from 'lucide-react';

interface CriarImovelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CriarImovelModal: React.FC<CriarImovelModalProps> = ({ open, onOpenChange }) => {
  const { createImovel, isCreating, getTipoOptions } = useImoveisImobiliariaReal();
  
  const [formData, setFormData] = useState<CreateImovelData>({
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipo: '',
    area_metros: undefined,
    valor_aluguel: 0,
    descricao: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      area_metros: formData.area_metros ? Number(formData.area_metros) : undefined,
      valor_aluguel: Number(formData.valor_aluguel),
    };

    createImovel(dataToSubmit, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({
          endereco: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          tipo: '',
          area_metros: undefined,
          valor_aluguel: 0,
          descricao: '',
        });
      }
    });
  };

  const handleInputChange = (field: keyof CreateImovelData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Adicionar Novo Imóvel
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua das Flores"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              placeholder="Apto 45, Bloco B"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                placeholder="Centro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="São Paulo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                placeholder="SP"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {getTipoOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_metros">Área (m²)</Label>
              <Input
                id="area_metros"
                type="number"
                value={formData.area_metros || ''}
                onChange={(e) => handleInputChange('area_metros', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="120"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_aluguel">Valor do Aluguel (R$) *</Label>
              <Input
                id="valor_aluguel"
                type="number"
                step="0.01"
                value={formData.valor_aluguel}
                onChange={(e) => handleInputChange('valor_aluguel', Number(e.target.value))}
                placeholder="1500.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descrição detalhada do imóvel..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? 'Criando...' : 'Criar Imóvel'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CriarImovelModal;