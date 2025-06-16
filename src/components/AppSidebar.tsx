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
  Phone, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state, setOpen } = useSidebar();

  const getMenuItems = () => {
    if (user?.type === 'inquilino') {
      return [
        {
          title: 'Dashboard',
          url: '/dashboard',
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
          icon: Phone,
        },
      ];
    }

    // Menu padrão para outros tipos de usuário
    return [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: Home,
      },
      {
        title: 'Fianças',
        url: '/fiancas',
        icon: FileText,
      },
      {
        title: 'Imobiliárias',
        url: '/imobiliarias',
        icon: Building,
      },
      {
        title: 'Executivos',
        url: '/executivos',
        icon: Briefcase,
      },
      {
        title: 'Contratos',
        url: '/contratos',
        icon: ClipboardList,
      },
      {
        title: 'Sinistros',
        url: '/sinistros',
        icon: ClipboardList,
      },
      {
        title: 'Leads',
        url: '/leads',
        icon: Phone,
      },
      {
        title: 'Configurações',
        url: '/configuracoes',
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
      analista: 'Analista de Conta',
      juridico: 'Departamento Jurídico',
      sdr: 'SDR - Comercial',
      executivo: 'Executivo de Conta',
      imobiliaria: 'Imobiliária',
      inquilino: 'Inquilino',
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
    setOpen(false);
  };

  return (
    <Sidebar className="border-r border-gray-200" collapsible="icon">
      <SidebarHeader className="bg-[#0C1C2E] p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-3">
            <button 
              onClick={handleExpandClick}
              className="text-white hover:bg-[#1A2F45] p-2 rounded transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
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
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-[#0C1C2E]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
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
                  <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
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
                <AvatarFallback className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] text-[#0C1C2E] font-semibold text-xs">
                  {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
