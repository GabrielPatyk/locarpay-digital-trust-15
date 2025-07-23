import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useStatusPlataforma } from '@/hooks/useStatusPlataforma';
import { Save, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface ChangelogEntry {
  versao: string;
  descricao: string;
  data: string;
}

interface NavegadorCompativel {
  nome: string;
  versao: string;
}

const StatusPlataformaConfig = () => {
  const { statusPlataforma, updateStatus, isLoading, isUpdating } = useStatusPlataforma();
  const { toast } = useToast();
  
  const [editData, setEditData] = useState({
    versao_atual: '',
    changelog: [] as ChangelogEntry[],
    navegadores_compativeis: [] as NavegadorCompativel[],
    infraestrutura: {},
    apis_integracoes: [],
    proximas_atualizacoes: [] as string[]
  });

  const [editingMode, setEditingMode] = useState(false);

  useEffect(() => {
    if (statusPlataforma) {
      setEditData({
        versao_atual: statusPlataforma.versao_atual || '',
        changelog: statusPlataforma.changelog || [],
        navegadores_compativeis: statusPlataforma.navegadores_compativeis || [],
        infraestrutura: statusPlataforma.infraestrutura || {},
        apis_integracoes: statusPlataforma.apis_integracoes || [],
        proximas_atualizacoes: statusPlataforma.proximas_atualizacoes || []
      });
    }
  }, [statusPlataforma]);

  const handleSave = () => {
    updateStatus(editData);
    setEditingMode(false);
  };

  const addChangelog = () => {
    setEditData(prev => ({
      ...prev,
      changelog: [...prev.changelog, { versao: '', descricao: '', data: new Date().toISOString().split('T')[0] }]
    }));
  };

  const updateChangelog = (index: number, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      changelog: prev.changelog.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeChangelog = (index: number) => {
    setEditData(prev => ({
      ...prev,
      changelog: prev.changelog.filter((_, i) => i !== index)
    }));
  };

  const addNavegador = () => {
    setEditData(prev => ({
      ...prev,
      navegadores_compativeis: [...prev.navegadores_compativeis, { nome: '', versao: '' }]
    }));
  };

  const updateNavegador = (index: number, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      navegadores_compativeis: prev.navegadores_compativeis.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeNavegador = (index: number) => {
    setEditData(prev => ({
      ...prev,
      navegadores_compativeis: prev.navegadores_compativeis.filter((_, i) => i !== index)
    }));
  };

  const addProximaAtualizacao = () => {
    setEditData(prev => ({
      ...prev,
      proximas_atualizacoes: [...prev.proximas_atualizacoes, '']
    }));
  };

  const updateProximaAtualizacao = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      proximas_atualizacoes: prev.proximas_atualizacoes.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const removeProximaAtualizacao = (index: number) => {
    setEditData(prev => ({
      ...prev,
      proximas_atualizacoes: prev.proximas_atualizacoes.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status da Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Status da Plataforma</CardTitle>
          <div className="space-x-2">
            {editingMode ? (
              <>
                <Button variant="outline" onClick={() => setEditingMode(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  <Check className="mr-2 h-4 w-4" />
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditingMode(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Versão Atual */}
        <div>
          <Label htmlFor="versao_atual">Versão Atual</Label>
          {editingMode ? (
            <Input
              id="versao_atual"
              value={editData.versao_atual}
              onChange={(e) => setEditData(prev => ({ ...prev, versao_atual: e.target.value }))}
              placeholder="v2.1.4"
            />
          ) : (
            <p className="text-lg font-medium">{editData.versao_atual}</p>
          )}
        </div>

        {/* Changelog */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Changelog</Label>
            {editingMode && (
              <Button variant="outline" size="sm" onClick={addChangelog}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {editData.changelog.map((entry, index) => (
              <div key={index} className="p-3 border rounded-lg">
                {editingMode ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Versão"
                        value={entry.versao}
                        onChange={(e) => updateChangelog(index, 'versao', e.target.value)}
                        className="w-24"
                      />
                      <Input
                        type="date"
                        value={entry.data}
                        onChange={(e) => updateChangelog(index, 'data', e.target.value)}
                        className="w-36"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChangelog(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Descrição das alterações"
                      value={entry.descricao}
                      onChange={(e) => updateChangelog(index, 'descricao', e.target.value)}
                      rows={2}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{entry.versao}</Badge>
                      <span className="text-sm text-gray-500">{new Date(entry.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-sm">{entry.descricao}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navegadores Compatíveis */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Navegadores Compatíveis</Label>
            {editingMode && (
              <Button variant="outline" size="sm" onClick={addNavegador}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {editData.navegadores_compativeis.map((nav, index) => (
              <div key={index} className="flex items-center gap-2">
                {editingMode ? (
                  <>
                    <Input
                      placeholder="Nome do navegador"
                      value={nav.nome}
                      onChange={(e) => updateNavegador(index, 'nome', e.target.value)}
                    />
                    <Input
                      placeholder="Versão mínima"
                      value={nav.versao}
                      onChange={(e) => updateNavegador(index, 'versao', e.target.value)}
                      className="w-32"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeNavegador(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Badge variant="outline">{nav.nome} {nav.versao}</Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Atualizações */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Próximas Atualizações</Label>
            {editingMode && (
              <Button variant="outline" size="sm" onClick={addProximaAtualizacao}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {editData.proximas_atualizacoes.map((atualizacao, index) => (
              <div key={index} className="flex items-center gap-2">
                {editingMode ? (
                  <>
                    <Input
                      placeholder="Descrição da próxima atualização"
                      value={atualizacao}
                      onChange={(e) => updateProximaAtualizacao(index, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProximaAtualizacao(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <p className="text-sm">• {atualizacao}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPlataformaConfig;