import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          style: {
            background: '#d1fae5',
            color: '#065f46',
            border: '1px solid #34d399',
          },
        },
        error: {
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #f87171',
          },
        },
      }}
    />
  );
}
