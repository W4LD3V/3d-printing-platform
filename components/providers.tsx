'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { apolloClient } from '@/lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ApolloProvider client={apolloClient}>
        <SWRConfig value={{ refreshInterval: 120_000 }}>
          {children}
        </SWRConfig>
      </ApolloProvider>
    </SessionProvider>
  );
}
