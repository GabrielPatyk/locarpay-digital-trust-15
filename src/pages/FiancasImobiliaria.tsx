import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useFiancas } from '@/hooks/useFiancas';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton"
import CriarFiancaModal from '@/components/CriarFiancaModal';
import { useToast } from '@/hooks/use-toast';
import { useCargoRedirect } from '@/hooks/useCargoRedirect';
import { useImobiliariaData } from '@/hooks/useImobiliariaData';

interface DataTableProps {
  data: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateFiancaStatus } = useFiancas();
  const { getCargoHomePage } = useCargoRedirect();

  const handleAceitarFianca = async (fiancaId: string) => {
    try {
      await updateFiancaStatus(fiancaId, 'aprovada');
      toast({
        title: "Fiança Aprovada!",
        description: "A fiança foi aprovada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao aprovar fiança: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejeitarFianca = async (fiancaId: string) => {
    try {
      await updateFiancaStatus(fiancaId, 'rejeitada');
      toast({
        title: "Fiança Rejeitada!",
        description: "A fiança foi rejeitada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao rejeitar fiança: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDetalhesClick = (fiancaId: string) => {
    navigate(`/detalhe-fianca/${fiancaId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Aluguel</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((fianca) => (
            <TableRow key={fianca.id}>
              <TableCell className="font-medium">
                <Badge variant="secondary">{fianca.status_fianca}</Badge>
              </TableCell>
              <TableCell>{fianca.inquilino_nome_completo}</TableCell>
              <TableCell>{fianca.inquilino_email}</TableCell>
              <TableCell>{fianca.imovel_endereco}, {fianca.imovel_cidade}</TableCell>
              <TableCell>R$ {fianca.imovel_valor_aluguel}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleDetalhesClick(fianca.id)}>
                  Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const SkeletonTable = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Imóvel</TableHead>
            <TableHead>Aluguel</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium"><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const FiancasImobiliaria = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { fiancas, isLoading, refetch, getFiancasStats } = useFiancas(user?.id, searchTerm);
  const { totalFiancas, fiancasPendentes, fiancasAtivas, fiancasVencidas } = getFiancasStats();
  const { cnpj } = useImobiliariaData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout title="Minhas Fianças">
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Minhas Fianças</h1>
            <p className="text-gray-500">
              Acompanhe suas solicitações de fiança e gerencie seus clientes.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Solicitar Fiança
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total de Fianças</CardTitle>
              <CardDescription>Número total de fianças solicitadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFiancas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fianças Pendentes</CardTitle>
              <CardDescription>Fianças aguardando aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fiancasPendentes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fianças Ativas</CardTitle>
              <CardDescription>Fianças com contrato ativo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fiancasAtivas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fianças Vencidas</CardTitle>
              <CardDescription>Fianças com contrato vencido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fiancasVencidas}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por nome, email ou endereço..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable data={fiancas} />
        )}
      </div>
      
      {/* Modal de criar fiança */}
      <CriarFiancaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          refetch();
        }}
        cnpjPlaceholder={cnpj}
      />
    </Layout>
  );
};

export default FiancasImobiliaria;
