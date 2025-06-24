
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileCompletionCheck from '@/components/ProfileCompletionCheck';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    if (user?.type === 'imobiliaria') {
      navigate('/configuracoes-imobiliaria');
    } else if (user?.type === 'analista') {
      navigate('/configuracoes-analista');
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

  // Header específico para mobile
  if (isMobile) {
    return (
      <SidebarInset>
        <ProfileCompletionCheck />
        {/* Header Mobile */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo e Texto */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <img 
                  src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                  alt="LocarPay Logo" 
                  className="w-8 h-8 object-contain flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text text-transparent truncate">
                    LocarPay
                  </h2>
                  <p className="text-xs text-gray-600 truncate">{getUserTypeLabel(user?.type || '')}</p>
                </div>
              </div>
              
              {/* Menu Hambúrguer */}
              <SidebarTrigger className="flex-shrink-0">
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-2 sm:p-4">
            {children}
          </div>
        </main>
      </SidebarInset>
    );
  }

  // Header padrão para desktop
  return (
    <SidebarInset>
      <ProfileCompletionCheck />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <SidebarTrigger className="md:hidden flex-shrink-0" />
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-[#0C1C2E] truncate">{title}</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Button variant="ghost" size="sm" className="relative hidden sm:flex">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center text-[10px] sm:text-xs">
                  3
                </span>
              </Button>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                  {user?.imagem_perfil ? (
                    <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs sm:text-sm">
                      {getInitials(user?.name || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden lg:block text-sm min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-gray-500 text-xs truncate">{getUserTypeLabel(user?.type || '')}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSettings}
                disabled={user?.type !== 'imobiliaria' && user?.type !== 'analista'}
                className="hidden sm:flex"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 max-w-full">
          {children}
        </div>
      </main>
    </SidebarInset>
  );
};

export default Layout;
