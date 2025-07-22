import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStatusPlataforma } from '@/hooks/useStatusPlataforma';
import { 
  Settings, 
  Plus,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';

const StatusPlataformaEditor = () => {
  const { statusPlataforma, updateStatus, isUpdating } = useStatusPlataforma();
  const [editData, setEditData] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (statusPlataforma) {
      setEditData({
        versao_atual: statusPlataforma.versao_atual,
        changelog: statusPlataforma.changelog || [],
        navegadores_compativeis: statusPlataforma.navegadores_compativeis || [],
        infraestrutura: statusPlataforma.infraestrutura || {},
        apis_integracoes: statusPlataforma.apis_integracoes || [],
        proximas_atualizacoes: statusPlataforma.proximas_atualizacoes || []
      });
    }
  }, [statusPlataforma]);

  const handleSave = () => {
    updateStatus({
      ...editData,
      data_ultima_atualizacao: new Date().toISOString()
    });
    setIsEditing(false);
  };

  const addChangelog = () => {
    setEditData({
      ...editData,
      changelog: [...(editData.changelog || []), {
        versao: editData.versao_atual,
        data: new Date().toISOString().split('T')[0],
        descricao: ''
      }]
    });
  };

  const updateChangelog = (index: number, field: string, value: string) => {
    const newChangelog = [...editData.changelog];
    newChangelog[index] = { ...newChangelog[index], [field]: value };
    setEditData({ ...editData, changelog: newChangelog });
  };

  const removeChangelog = (index: number) => {
    setEditData({
      ...editData,
      changelog: editData.changelog.filter((_: any, i: number) => i !== index)
    });
  };

  const addProximaAtualizacao = () => {
    setEditData({
      ...editData,
      proximas_atualizacoes: [...editData.proximas_atualizacoes, '']
    });
  };

  const updateProximaAtualizacao = (index: number, value: string) => {
    const newAtualizacoes = [...editData.proximas_atualizacoes];
    newAtualizacoes[index] = value;
    setEditData({ ...editData, proximas_atualizacoes: newAtualizacoes });
  };

  const removeProximaAtualizacao = (index: number) => {
    setEditData({
      ...editData,
      proximas_atualizacoes: editData.proximas_atualizacoes.filter((_: any, i: number) => i !== index)
    });
  };

  const updateNavegador = (index: number, field: string, value: string) => {
    const newNavegadores = [...editData.navegadores_compativeis];
    newNavegadores[index] = { ...newNavegadores[index], [field]: value };
    setEditData({ ...editData, navegadores_compativeis: newNavegadores });
  };

  const updateInfraestrutura = (field: string, value: string) => {
    setEditData({
      ...editData,
      infraestrutura: { ...editData.infraestrutura, [field]: value }
    });
  };

  const updateApiIntegracao = (index: number, field: string, value: string) => {
    const newApis = [...editData.apis_integracoes];
    newApis[index] = { ...newApis[index], [field]: value };
    setEditData({ ...editData, apis_integracoes: newApis });
  };

  if (!statusPlataforma) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Configurações do Status da Plataforma
            </CardTitle>
            <CardDescription>
              Gerencie as informações exibidas no status da plataforma
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isUpdating}>
                <Save className="mr-2 h-4 w-4" />
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Versão Atual */}
        <div>
          <Label htmlFor="versao">Versão Atual</Label>
          <Input
            id="versao"
            value={editData.versao_atual || ''}
            onChange={(e) => setEditData({ ...editData, versao_atual: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        {/* Changelog */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Changelog</Label>
            {isEditing && (
              <Button size="sm" onClick={addChangelog}>
                <Plus className="mr-1 h-3 w-3" />
                Adicionar
              </Button>
            )}
          </div>
          <div className="space-y-3">
            {editData.changelog?.map((item: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                  <div>
                    <Label className="text-xs">Versão</Label>
                    <Input
                      value={item.versao || ''}
                      onChange={(e) => updateChangelog(index, 'versao', e.target.value)}
                      disabled={!isEditing}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Data</Label>
                    <Input
                      type="date"
                      value={item.data || ''}
                      onChange={(e) => updateChangelog(index, 'data', e.target.value)}
                      disabled={!isEditing}
                      className="h-8"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex items-end">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeChangelog(index)}
                        className="h-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Descrição</Label>
                  <Textarea
                    value={item.descricao || ''}
                    onChange={(e) => updateChangelog(index, 'descricao', e.target.value)}
                    disabled={!isEditing}
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegadores Compatíveis */}
        <div>
          <Label>Navegadores Compatíveis</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {editData.navegadores_compativeis?.map((nav: any, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nome"
                  value={nav.nome || ''}
                  onChange={(e) => updateNavegador(index, 'nome', e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  placeholder="Versão"
                  value={nav.versao || ''}
                  onChange={(e) => updateNavegador(index, 'versao', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infraestrutura */}
        <div>
          <Label>Infraestrutura</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div>
              <Label className="text-xs">Docker</Label>
              <Input
                value={editData.infraestrutura?.docker || ''}
                onChange={(e) => updateInfraestrutura('docker', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="text-xs">Node.js</Label>
              <Input
                value={editData.infraestrutura?.nodejs || ''}
                onChange={(e) => updateInfraestrutura('nodejs', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="text-xs">React</Label>
              <Input
                value={editData.infraestrutura?.react || ''}
                onChange={(e) => updateInfraestrutura('react', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label className="text-xs">Supabase</Label>
              <Input
                value={editData.infraestrutura?.supabase || ''}
                onChange={(e) => updateInfraestrutura('supabase', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* APIs e Integrações */}
        <div>
          <Label>APIs e Integrações</Label>
          <div className="space-y-2 mt-2">
            {editData.apis_integracoes?.map((api: any, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Nome da API"
                  value={api.nome || ''}
                  onChange={(e) => updateApiIntegracao(index, 'nome', e.target.value)}
                  disabled={!isEditing}
                />
                <Input
                  placeholder="Status"
                  value={api.status || ''}
                  onChange={(e) => updateApiIntegracao(index, 'status', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Atualizações */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Próximas Atualizações</Label>
            {isEditing && (
              <Button size="sm" onClick={addProximaAtualizacao}>
                <Plus className="mr-1 h-3 w-3" />
                Adicionar
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {editData.proximas_atualizacoes?.map((atualizacao: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={atualizacao}
                  onChange={(e) => updateProximaAtualizacao(index, e.target.value)}
                  disabled={!isEditing}
                  placeholder="Descrição da próxima atualização"
                />
                {isEditing && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeProximaAtualizacao(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {statusPlataforma.data_ultima_atualizacao && (
          <div className="text-sm text-muted-foreground">
            Última atualização: {new Date(statusPlataforma.data_ultima_atualizacao).toLocaleString('pt-BR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusPlataformaEditor;