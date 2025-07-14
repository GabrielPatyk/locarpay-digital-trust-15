
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import InactivityWarningModal from '@/components/InactivityWarningModal';
import ContratoChecker from '@/components/ContratoChecker';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 md:p-8">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
      <Toaster />
      <InactivityWarningModal />
      <ContratoChecker />
    </SidebarProvider>
  );
};

export default Layout;
