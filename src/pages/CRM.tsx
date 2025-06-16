
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import CRMSidebar from '@/components/crm/CRMSidebar';
import CRMHeader from '@/components/crm/CRMHeader';
import LeadsPage from '@/components/crm/LeadsPage';
import FunnelsPage from '@/components/crm/FunnelsPage';
import CreateFunnelPage from '@/components/crm/CreateFunnelPage';
import ConversationHistoryPage from '@/components/crm/ConversationHistoryPage';
import CRMSettingsPage from '@/components/crm/CRMSettingsPage';

export type CRMPage = 'leads' | 'funnels' | 'create-funnel' | 'history' | 'settings';

const CRM = () => {
  const [currentPage, setCurrentPage] = useState<CRMPage>('leads');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'leads':
        return <LeadsPage />;
      case 'funnels':
        return <FunnelsPage />;
      case 'create-funnel':
        return <CreateFunnelPage onFunnelCreated={() => setCurrentPage('funnels')} />;
      case 'history':
        return <ConversationHistoryPage />;
      case 'settings':
        return <CRMSettingsPage />;
      default:
        return <LeadsPage />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'leads':
        return 'Gestão de Leads';
      case 'funnels':
        return 'Funis de Vendas';
      case 'create-funnel':
        return 'Criar Funil';
      case 'history':
        return 'Histórico de Conversas';
      case 'settings':
        return 'Configurações do CRM';
      default:
        return 'CRM';
    }
  };

  return (
    <Layout title="CRM - LocarPay">
      <div className="flex h-full bg-white">
        <CRMSidebar 
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <CRMHeader 
            title={getPageTitle()}
            currentPage={currentPage}
            onNewLead={() => setCurrentPage('leads')}
          />
          
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CRM;
