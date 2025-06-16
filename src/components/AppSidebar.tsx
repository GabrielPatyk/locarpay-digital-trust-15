
import React from 'react';
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
} from '@/components/ui/sidebar';
import { 
  Home, 
  FileText, 
  Building, 
  Briefcase, 
  ClipboardList, 
  Phone, 
  Settings,
  Menu
} from 'lucide-react';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
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

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="bg-[#0C1C2E] p-4">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
            alt="LocarPay Logo" 
            className="w-8 h-8 object-contain"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text text-transparent">
              LocarPay
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <SidebarTrigger className="text-white hover:bg-[#1A2F45] w-full justify-start">
            <Menu className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden ml-2">Menu</span>
          </SidebarTrigger>
        </div>
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
                      `}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info section */}
        <div className="mt-auto p-4 border-t border-gray-600">
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm text-gray-300">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.type}</p>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
