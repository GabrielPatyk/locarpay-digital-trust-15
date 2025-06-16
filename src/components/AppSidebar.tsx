
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
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { state, setOpen } = useSidebar();

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
                        text-white transition-all duration-300 relative group
                        ${isActive 
                          ? 'bg-transparent text-transparent bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text' 
                          : 'hover:border hover:border-gradient-to-r hover:from-[#F4D573] hover:to-[#BC942C] hover:bg-gradient-to-r hover:from-[#F4D573]/10 hover:to-[#BC942C]/10'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                        before:absolute before:inset-0 before:rounded-md before:p-[1px] before:bg-gradient-to-r before:from-[#F4D573] before:to-[#BC942C] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                        after:absolute after:inset-[1px] after:bg-[#0C1C2E] after:rounded-md after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300
                      `}
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 relative z-10 ${
                        isActive 
                          ? 'text-transparent bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text' 
                          : 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#F4D573] group-hover:to-[#BC942C] group-hover:bg-clip-text'
                      }`} />
                      {showExpandedContent && (
                        <span className={`relative z-10 ${
                          isActive 
                            ? 'text-transparent bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text font-medium' 
                            : 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#F4D573] group-hover:to-[#BC942C] group-hover:bg-clip-text'
                        }`}>
                          {item.title}
                        </span>
                      )}
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
            <div>
              <p className="text-sm text-gray-300">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.type}</p>
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
