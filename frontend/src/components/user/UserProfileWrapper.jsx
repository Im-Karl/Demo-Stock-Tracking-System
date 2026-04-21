import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserProfile from './UserProfile';

const queryClient = new QueryClient();

export default function UserProfileWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProfile />
    </QueryClientProvider>
  );
}
