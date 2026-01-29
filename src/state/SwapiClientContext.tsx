import React, { ReactNode, createContext, useContext } from 'react';

import { SwapiClient, swapiClient as defaultSwapiClient } from '../api/swapiClient';

const SwapiClientContext = createContext<SwapiClient>(defaultSwapiClient);

export interface SwapiClientProviderProps {
  client?: SwapiClient;
  children: ReactNode;
}

export function SwapiClientProvider({
  client = defaultSwapiClient,
  children,
}: SwapiClientProviderProps) {
  return <SwapiClientContext.Provider value={client}>{children}</SwapiClientContext.Provider>;
}

export function useSwapiClient(): SwapiClient {
  const client = useContext(SwapiClientContext);
  if (!client) {
    throw new Error('useSwapiClient must be used within SwapiClientProvider');
  }
  return client;
}
