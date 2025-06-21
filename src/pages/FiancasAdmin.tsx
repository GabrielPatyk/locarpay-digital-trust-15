
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FiancasAdmin = () => {
  const fiancas = [
    {
      id: '1',
      inquilino: 'João Silva Santos',
      imobiliaria: 'Imobiliária Prime',
      valorAluguel: 2500,
      valorFianca: 375,
      status: 'ativa',
      dataInicio: '2024-01-01',
      dataVencimento: '2024-12-31'
    },
    {
      id: '2',
      inquilino: 'Maria Oliveira',
      imobiliaria: 'Imobiliária Sucesso',
      valorAluguel: 1800,
      valorFianca: 270,
      status: 'pendente',
      dataInicio: '2024-02-01',
      dataVencimento: '2025-01-31'
    }
  ];

  return (
    <Layout title="Gestão de Fianças">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Fianças</p>
                  <p className="text-2xl font-bold text-primary">47</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fianças Ativas</p>
                  <p className="text-2xl font-bold text-green-500">32</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-500">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-primary">R$ 45.680</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Fianças</CardTitle>
            <CardDescription>Gerencie todas as fianças da plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fiancas.map((fianca) => (
                <div key={fianca.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{fianca.inquilino}</h4>
                      <p className="text-sm text-gray-600">{fianca.imobiliaria}</p>
                    </div>
                    <Badge className={fianca.status === 'ativa' ? 'bg-green-500' : 'bg-yellow-500'}>
                      {fianca.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Valor Aluguel</p>
                      <p className="font-medium">R$ {fianca.valorAluguel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Valor Fiança</p>
                      <p className="font-medium">R$ {fianca.valorFianca}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Data Início</p>
                      <p className="font-medium">{new Date(fianca.dataInicio).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vencimento</p>
                      <p className="font-medium">{new Date(fianca.dataVencimento).toLocaleDateString()}</p>
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

export default FiancasAdmin;
