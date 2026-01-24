import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewsFeed from './NewsFeed';

// Tạo client một lần ở phía ngoài component để tránh tạo lại khi re-render
const queryClient = new QueryClient();

export default function NewsFeedWrapper() {
  return (
    // Cung cấp Context cho NewsFeed hoạt động
    <QueryClientProvider client={queryClient}>
      <NewsFeed />
    </QueryClientProvider>
  );
}