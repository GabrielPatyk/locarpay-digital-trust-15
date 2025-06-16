
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Funnel, 
  Plus, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CRMPage } from '@/pages/CRM';

interface CRMSidebarProps {
  currentPage: CRMPage;
  onPageChange: (page: CRMPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const CRMSidebar: React.FC<CRMSidebarProps> = ({
  currentPage,
  onPageChange,
  collapsed,
  onToggleCollapse
}) => {
  const menuItems = [
    {
      id: 'leads' as CRMPage,
      title: 'Leads',
      icon: Users,
    },
    {
      id: 'funnels' as CRMPage,
      title: 'Funis de Vendas',
      icon: Funnel,
    },
    {
      id: 'create-funnel' as CRMPage,
      title: 'Criar Funil',
      icon: Plus,
    },
    {
      id: 'history' as CRMPage,
      title: 'Histórico de Conversas',
      icon: FileText,
    },
    {
      id: 'settings' as CRMPage,
      title: 'Configurações do CRM',
      icon: Settings,
    },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-[#0C1C2E] text-white transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-600 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/1fc475c2-f7e6-4e6e-bf1b-b349783c2b93.png" 
              alt="LocarPay Logo" 
              className="w-8 h-8 object-contain"
            />
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#F4D573] to-[#BC942C] bg-clip-text text-transparent">
              CRM
            </h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-white hover:bg-[#1A2F45] p-1"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onPageChange(item.id)}
              className={`w-full justify-start transition-all duration-200 ${
                isActive 
                  ? 'text-[#F4D573] bg-gradient-to-r from-[#F4D573]/10 to-[#BC942C]/10 border-r-2 border-[#F4D573]'
                  : 'text-white hover:bg-[#1A2F45] hover:text-[#F4D573] hover:border hover:border-[#F4D573] hover:shadow-lg hover:shadow-[#F4D573]/20'
              } ${collapsed ? 'px-2' : 'px-4'}`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-[#F4D573]' : ''} ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className={isActive ? 'text-[#F4D573]' : ''}>{item.title}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Floating New Lead Button */}
      <div className="p-4">
        <Button
          onClick={() => onPageChange('leads')}
          className={`w-full bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#BC942C] hover:to-[#F4D573] text-[#0C1C2E] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#F4D573]/30 ${
            collapsed ? 'px-2' : 'px-4'
          }`}
        >
          <Plus className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Novo Lead</span>}
        </Button>
      </div>
    </div>
  );
};

export default CRMSidebar;
