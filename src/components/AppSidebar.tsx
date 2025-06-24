import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  FileText, 
  Building, 
  Briefcase, 
  ClipboardList, 
  DollarSign, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Users,
  Scale,
  Phone,
  CreditCard,
  TrendingDown,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state, setOpen, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const getMenuItems = () => {
    if (user?.type === 'inquilino') {
      return [
        {
          title: 'Dashboard',
          url: '/inquilino',
          icon: Home,
        },
        {
          title: 'Meus Contratos',
          url: '/contratos',
          icon: ClipboardList,
        },
        {
          title: 'Minhas Fianças',
          url: '/fiancas',
          icon: FileText,
        },
        {
          title: 'Pagamentos',
          url: '/pagamentos',
          icon: DollarSign,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-inquilino',
          icon: Settings,
        },
      ];
    }

    if (user?.type === 'analista') {
      return [
        {
          title: 'Dashboard',
          url: '/analista',
          icon: Home,
        },
        {
          title: 'Análises',
          url: '/analises',
          icon: FileText,
        },
        {
          title: 'Clientes',
          url: '/clientes',
          icon: Users,
        },
        {
          title: 'Relatórios',
          url: '/relatorios-analista',
          icon: ClipboardList,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-analista',
          icon: Settings,
        },
      ];
    }

    if (user?.type === 'juridico') {
      return [
        {
          title: 'Dashboard',
          url: '/juridico',
          icon: Home,
        },
        {
          title: 'Contratos',
          url: '/contratos-juridico',
          icon: FileText,
        },
        {
          title: 'Processos',
          url: '/processos',
          icon: Scale,
        },
        {
          title: 'Documentos',
          url: '/documentos',
          icon: ClipboardList,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-juridico',
          icon: Settings,
        },
      ];
    }

    if (user?.type === 'sdr') {
      return [
        {
          title: 'Dashboard',
          url: '/sdr',
          icon: Home,
        },
        {
          title: 'Leads',
          url: '/leads',
          icon: Users,
        },
        {
          title: 'Campanhas',
          url: '/campanhas',
          icon: Phone,
        },
        {
          title: 'Relatórios',
          url: '/relatorios-sdr',
          icon: BarChart3,
        },
      ];
    }

    if (user?.type === 'executivo') {
      return [
        {
          title: 'Dashboard',
          url: '/executivo',
          icon: Home,
        },
        {
          title: 'Imobiliárias',
          url: '/imobiliarias-executivo',
          icon: Building,
        },
        {
          title: 'Propostas',
          url: '/propostas-executivo',
          icon: FileText,
        },
        {
          title: 'Performance',
          url: '/performance-executivo',
          icon: TrendingUp,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-executivo',
          icon: Settings,
        },
      ];
    }

    if (user?.type === 'imobiliaria') {
      return [
        {
          title: 'Dashboard',
          url: '/imobiliaria',
          icon: Home,
        },
        {
          title: 'Fianças',
          url: '/fiancas-imobiliaria',
          icon: FileText,
        },
        {
          title: 'Inquilinos',
          url: '/inquilinos-imobiliaria',
          icon: Users,
        },
        {
          title: 'Contratos',
          url: '/contratos-imobiliaria',
          icon: FileText,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-imobiliaria',
          icon: Settings,
        },
      ];
    }

    if (user?.type === 'financeiro') {
      return [
        {
          title: 'Dashboard',
          url: '/financeiro',
          icon: Home,
        },
        {
          title: 'Pagamentos',
          url: '/pagamentos-financeiro',
          icon: CreditCard,
        },
        {
          title: 'Inadimplência',
          url: '/inadimplencia-financeiro',
          icon: TrendingDown,
        },
        {
          title: 'Relatórios',
          url: '/relatorios-financeiro',
          icon: BarChart3,
        },
        {
          title: 'Configurações',
          url: '/configuracoes-financeiro',
          icon: Settings,
        },
      ];
    }

    // Menu atualizado para admin com nova opção Relatórios
    return [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
      {
        title: 'Usuários',
        url: '/admin',
        icon: Users,
      },
      {
        title: 'Fianças',
        url: '/fiancas-admin',
        icon: FileText,
      },
      {
        title: 'Imobiliárias',
        url: '/imobiliarias-admin',
        icon: Building,
      },
      {
        title: 'Executivos',
        url: '/executivos-admin',
        icon: Briefcase,
      },
      {
        title: 'Contratos',
        url: '/contratos',
        icon: ClipboardList,
      },
      {
        title: 'Sinistros',
        url: '/sinistros-admin',
        icon: ClipboardList,
      },
      {
        title: 'Leads',
        url: '/leads-admin',
        icon: DollarSign,
      },
      {
        title: 'Relatórios',
        url: '/relatorios-admin',
        icon: BarChart3,
      },
      {
        title: 'Configurações',
        url: '/configuracoes-admin',
        icon: Settings,
      },
    ];
  };

  const menuItems = getMenuItems();

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const isCollapsed = state === 'collapsed';
  const showExpandedContent = state === 'expanded';

  const handleExpandClick = () => {
    setOpen(true);
  };

  const handleCollapseClick = () => {
    // Para mobile, fechar o sidebar completamente
    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  // Determinar o lado do sidebar baseado no dispositivo
  const sidebarSide = isMobile ? 'right' : 'left';

  // Determinar qual ícone usar para fechar/colapsar
  const getCollapseIcon = () => {
    if (isMobile) {
      return <X className="h-5 w-5" />; // X para fechar completamente em mobile
    }
    return sidebarSide === 'right' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />;
  };

  return (
    <Sidebar className="border-r border-gray-200" collapsible="icon" side={sidebarSide}>
      <SidebarHeader className="bg-[#0C1C2E] p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <button 
              onClick={handleExpandClick}
              className="text-white hover:bg-[#1A2F45] p-2 rounded transition-colors"
            >
              {sidebarSide === 'right' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
                alt="LocarPay Logo" 
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <h2 className="text-lg font-bold bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text text-transparent">
                LocarPay
              </h2>
            </div>
            <button 
              onClick={handleCollapseClick}
              className="text-white hover:bg-[#1A2F45] p-1 rounded"
            >
              {getCollapseIcon()}
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#0C1C2E]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Corrigir a lógica de ativo para Dashboard e outras páginas
                const isActive = location.pathname === item.url || 
                  (item.title === 'Dashboard' && location.pathname === '/dashboard') ||
                  (item.title === 'Usuários' && location.pathname === '/admin');
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.url)}
                      isActive={isActive}
                      className={`
                        text-white hover:bg-[#1A2F45] transition-all duration-300
                        ${isActive ? 'bg-gradient-to-r from-[#F4D573]/20 to-[#BC942C]/20 border-r-2 border-[#F4D573]' : ''}
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {showExpandedContent && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info section */}
        <div className="mt-auto p-4 border-t border-gray-600">
          {showExpandedContent ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {user?.imagem_perfil ? (
                    <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs">
                      {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm text-gray-300 font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{getUserTypeLabel(user?.type || '')}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-[#1A2F45] p-2 h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                {user?.imagem_perfil ? (
                  <AvatarImage src={user.imagem_perfil} alt="Foto de perfil" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
