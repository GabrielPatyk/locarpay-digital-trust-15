import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a stable instance outside of the component
let queryClient: QueryClient;

function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    });
  }
  return queryClient;
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const client = getQueryClient();
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;