
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface CreateFunnelPageProps {
  onFunnelCreated: () => void;
}

interface FunnelStage {
  nome: string;
  cor: string;
}

const CreateFunnelPage: React.FC<CreateFunnelPageProps> = ({ onFunnelCreated }) => {
  const { toast } = useToast();
  const [funnelName, setFunnelName] = useState('');
  const [stages, setStages] = useState<FunnelStage[]>([
    { nome: 'Novos Leads', cor: '#3B82F6' },
    { nome: 'Contato Inicial', cor: '#EAB308' },
    { nome: 'Qualificação', cor: '#10B981' },
    { nome: 'Proposta', cor: '#F59E0B' },
    { nome: 'Fechamento', cor: '#059669' }
  ]);

  const colors = [
    '#3B82F6', '#EAB308', '#10B981', '#F59E0B', '#059669', 
    '#8B5CF6', '#EC4899', '#EF4444', '#6B7280', '#F4D573'
  ];

  const addStage = () => {
    setStages([...stages, { nome: '', cor: colors[stages.length % colors.length] }]);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      setStages(stages.filter((_, i) => i !== index));
    }
  };

  const updateStage = (index: number, field: keyof FunnelStage, value: string) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!funnelName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do funil é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (stages.some(stage => !stage.nome.trim())) {
      toast({
        title: "Erro",
        description: "Todos os estágios devem ter um nome",
        variant: "destructive"
      });
      return;
    }

    // Aqui seria feita a integração com Supabase
    toast({
      title: "Sucesso!",
      description: "Funil criado com sucesso",
    });

    onFunnelCreated();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Funil de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="funnelName">Nome do Funil</Label>
              <Input
                id="funnelName"
                value={funnelName}
                onChange={(e) => setFunnelName(e.target.value)}
                placeholder="Ex: Funil Imobiliárias"
                className="mt-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Estágios do Funil</Label>
                <Button
                  type="button"
                  onClick={addStage}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Estágio
                </Button>
              </div>

              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Input
                        value={stage.nome}
                        onChange={(e) => updateStage(index, 'nome', e.target.value)}
                        placeholder="Nome do estágio"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">Cor:</Label>
                      <div className="flex space-x-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updateStage(index, 'cor', color)}
                            className={`w-6 h-6 rounded-full border-2 ${
                              stage.cor === color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    {stages.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeStage(index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#BC942C] hover:to-[#F4D573] text-[#0C1C2E] font-semibold"
              >
                Criar Funil
              </Button>
              <Button type="button" variant="outline" onClick={onFunnelCreated}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFunnelPage;
