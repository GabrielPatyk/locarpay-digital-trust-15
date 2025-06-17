
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ContractModal from '@/components/ContractModal';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [showContractModal, setShowContractModal] = useState(false);

  useEffect(() => {
    // Check if user is imobiliaria, first login, and hasn't accepted contract
    if (user?.type === 'imobiliaria' && user?.firstLogin && !user?.contractAccepted) {
      setShowContractModal(true);
    }
  }, [user]);

  const handleContractAccept = () => {
    if (user) {
      const updatedUser = {
        ...user,
        firstLogin: false,
        contractAccepted: true
      };
      updateUser(updatedUser);
      setShowContractModal(false);
      
      toast({
        title: "Contrato aceito com sucesso!",
        description: "Bem-vindo à plataforma LOCARPAY.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="tracking-tight text-sm font-medium">Bem-vindo</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{user?.name}</div>
              <p className="text-xs text-muted-foreground">
                Tipo: {user?.type}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Informações do Sistema</h3>
          <p className="text-muted-foreground">
            Esta é a área principal do dashboard. Aqui você encontrará as principais funcionalidades da plataforma.
          </p>
        </div>
      </div>

      <ContractModal
        isOpen={showContractModal}
        onAccept={handleContractAccept}
      />
    </div>
  );
};

export default Dashboard;
