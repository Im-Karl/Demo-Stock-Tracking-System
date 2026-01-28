import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewsFeed from './NewsFeed';

const queryClient = new QueryClient();

export default function NewsFeedWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <NewsFeed />
    </QueryClientProvider>
  );
}