
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SinistrosAdmin = () => {
  const sinistros = [
    {
      id: '1',
      contrato: 'CON-2024-001',
      inquilino: 'João Silva',
      tipo: 'Inadimplência',
      valor: 2500,
      status: 'em_analise',
      dataOcorrencia: '2024-01-10'
    },
    {
      id: '2',
      contrato: 'CON-2024-002', 
      inquilino: 'Maria Santos',
      tipo: 'Danos ao Imóvel',
      valor: 1200,
      status: 'aprovado',
      dataOcorrencia: '2024-01-05'
    }
  ];

  return (
    <Layout title="Gestão de Sinistros">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sinistros</p>
                  <p className="text-2xl font-bold text-primary">23</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Análise</p>
                  <p className="text-2xl font-bold text-yellow-500">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-green-500">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-red-500">R$ 45.600</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todos os Sinistros</CardTitle>
            <CardDescription>Gerencie todos os sinistros reportados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sinistros.map((sinistro) => (
                <div key={sinistro.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Contrato: {sinistro.contrato}</h4>
                      <p className="text-sm text-gray-600">Inquilino: {sinistro.inquilino}</p>
                    </div>
                    <Badge className={sinistro.status === 'aprovado' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {sinistro.status === 'em_analise' ? 'Em Análise' : 'Aprovado'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-medium">{sinistro.tipo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor</p>
                      <p className="font-medium">R$ {sinistro.valor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Ocorrência</p>
                      <p className="font-medium">{new Date(sinistro.dataOcorrencia).toLocaleDateString()}</p>
                    </div>
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

export default SinistrosAdmin;
