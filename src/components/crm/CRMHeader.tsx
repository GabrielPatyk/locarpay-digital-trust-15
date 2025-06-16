
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Filter } from 'lucide-react';
import { CRMPage } from '@/pages/CRM';

interface CRMHeaderProps {
  title: string;
  currentPage: CRMPage;
  onNewLead: () => void;
}

const CRMHeader: React.FC<CRMHeaderProps> = ({ title, currentPage, onNewLead }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-[#0C1C2E]">{title}</h1>
          
          {/* Search Bar */}
          {(currentPage === 'leads' || currentPage === 'funnels') && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar leads..."
                className="pl-10 w-64"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Page-specific actions */}
          {currentPage === 'leads' && (
            <>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={onNewLead}
                className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#BC942C] hover:to-[#F4D573] text-[#0C1C2E] font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </>
          )}

          {currentPage === 'funnels' && (
            <Button
              className="bg-gradient-to-r from-[#F4D573] to-[#BC942C] hover:from-[#BC942C] hover:to-[#F4D573] text-[#0C1C2E] font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Funil
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CRMHeader;
