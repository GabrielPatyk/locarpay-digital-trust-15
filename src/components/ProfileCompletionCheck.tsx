
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ProfileCompletionCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = React.useState(false);

  const isProfileComplete = (profile: any) => {
    if (!profile) return false;
    
    const requiredFields = ['nome_empresa', 'cnpj', 'endereco', 'numero', 'bairro', 'cidade', 'estado'];
    return requiredFields.every(field => profile[field] && profile[field].trim() !== '');
  };

  useEffect(() => {
    if (user?.type === 'imobiliaria' && profile !== null) {
      const isComplete = isProfileComplete(profile);
      const isOnConfigPage = location.pathname === '/configuracoes-imobiliaria';
      
      if (!isComplete && !isOnConfigPage) {
        setShowDialog(true);
        toast({
          title: "Perfil Incompleto",
          description: "É necessário completar o cadastro da sua imobiliária para continuar usando a plataforma.",
          variant: "destructive",
        });
      }
    }
  }, [user, profile, location.pathname, toast]);

  const handleCompleteProfile = () => {
    setShowDialog(false);
    navigate('/configuracoes-imobiliaria');
  };

  if (user?.type === 'imobiliaria' && profile !== null && !isProfileComplete(profile) && location.pathname !== '/configuracoes-imobiliaria') {
    return (
      <>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastro Incompleto</DialogTitle>
              <DialogDescription>
                Para utilizar a plataforma, é necessário completar o cadastro da sua imobiliária com todas as informações obrigatórias.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCompleteProfile}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
              >
                Completar Cadastro
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default ProfileCompletionCheck;
