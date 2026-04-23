import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StockDetailContent from './StockDetailContent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function StockDetailClient(props) {
  return (
    <QueryClientProvider client={queryClient}>
      <StockDetailContent {...props} />
    </QueryClientProvider>
  );
}
