
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';
import PrimeiroAcessoModal from '@/components/PrimeiroAcessoModal';
import ContratoPendenteModal from '@/components/ContratoPendenteModal';
import ContratoAssinadoModal from '@/components/ContratoAssinadoModal';
import { usePrimeiroAcesso } from '@/hooks/usePrimeiroAcesso';
import { useContratosLocarpay } from '@/hooks/useContratosLocarpay';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isPrimeiroAcesso } = usePrimeiroAcesso();
  
  // Estados para controlar os modais
  const [showContratoPendente, setShowContratoPendente] = useState(false);
  const [showContratoAssinado, setShowContratoAssinado] = useState(false);
  const [contratoAssinadoMostrado, setContratoAssinadoMostrado] = useState(false);

  // Hook dos contratos (apenas para imobiliárias)
  const { 
    verificarECriarContrato,
    temContratoPendente,
    temContratoAssinado,
    getContratoPendente,
    isLoading
  } = useContratosLocarpay();

  // Verificar contratos ao carregar o componente
  useEffect(() => {
    if (user?.type === 'imobiliaria' && !isLoading) {
      verificarECriarContrato();
    }
  }, [user, isLoading, verificarECriarContrato]);

  // Controlar exibição dos modais
  useEffect(() => {
    if (user?.type === 'imobiliaria' && !isLoading) {
      const hasAssinado = temContratoAssinado();
      const hasPendente = temContratoPendente();

      if (hasAssinado && !contratoAssinadoMostrado) {
        // Mostrar modal de sucesso apenas uma vez
        setShowContratoAssinado(true);
        setContratoAssinadoMostrado(true);
        setShowContratoPendente(false);
      } else if (hasPendente && !hasAssinado) {
        // Mostrar modal de pendente se não foi assinado
        setShowContratoPendente(true);
        setShowContratoAssinado(false);
      } else {
        // Fechar ambos os modais se não há pendente nem assinado recente
        setShowContratoPendente(false);
        if (contratoAssinadoMostrado) {
          setShowContratoAssinado(false);
        }
      }
    }
  }, [user, isLoading, temContratoPendente, temContratoAssinado, contratoAssinadoMostrado]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    if (user?.type === 'imobiliaria') {
      navigate('/configuracoes-imobiliaria');
    } else if (user?.type === 'analista') {
      navigate('/configuracoes-analista');
    } else if (user?.type === 'sdr') {
      navigate('/configuracoes-sdr');
    }
    // Para outros tipos de usuário, não faz nada ainda
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      analista: 'Analista de Fiança',
      juridico: 'Departamento Jurídico',
      sdr: 'SDR - Comercial',
      executivo: 'Executivo de Conta',
      imobiliaria: 'Imobiliária',
      inquilino: 'Inquilino',
      financeiro: 'Departamento Financeiro',
      admin: 'Administrador'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  const contratoPendente = getContratoPendente();

  // Header específico para mobile
  if (isMobile) {
    return (
      <SidebarInset>
        <ProfileCompletionCheck />
        {/* Header Mobile */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo e Texto */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                  alt="LocarPay Logo" 
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text text-transparent">
                    LocarPay
                  </h2>
                  <p className="text-xs text-gray-600">{getUserTypeLabel(user?.type || '')}</p>
                </div>
              </div>
              
              {/* Menu Hambúrguer */}
              <SidebarTrigger>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4">
            {children}
          </div>
        </main>
        
        {/* Modals */}
        <PrimeiroAcessoModal open={isPrimeiroAcesso} />
        
        {user?.type === 'imobiliaria' && (
          <>
            <ContratoPendenteModal 
              isOpen={showContratoPendente}
              onClose={() => setShowContratoPendente(false)}
              linkAssinatura={contratoPendente?.link_assinatura}
            />
            <ContratoAssinadoModal
              isOpen={showContratoAssinado}
              onClose={() => setShowContratoAssinado(false)}
            />
          </>
        )}
      </SidebarInset>
    );
  }

  // Header padrão para desktop
  return (
    <SidebarInset>
      <ProfileCompletionCheck />
      <PrimeiroAcessoModal open={isPrimeiroAcesso} />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="md:hidden" />
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-[#0C1C2E]">{title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {user?.imagem_perfil ? (
                    <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold">
                      {getInitials(user?.name || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{getUserTypeLabel(user?.type || '')}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSettings}
                disabled={user?.type !== 'imobiliaria' && user?.type !== 'analista' && user?.type !== 'sdr'}
              >
                <Settings className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Modals para Imobiliárias */}
      {user?.type === 'imobiliaria' && (
        <>
          <ContratoPendenteModal 
            isOpen={showContratoPendente}
            onClose={() => setShowContratoPendente(false)}
            linkAssinatura={contratoPendente?.link_assinatura}
          />
          <ContratoAssinadoModal
            isOpen={showContratoAssinado}
            onClose={() => setShowContratoAssinado(false)}
          />
        </>
      )}
    </SidebarInset>
  );
};

export default Layout;
