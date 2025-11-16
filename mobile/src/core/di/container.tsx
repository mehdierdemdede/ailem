import React, {PropsWithChildren, createContext, useContext, useMemo} from 'react';
import {AuthService} from '../network/authService';

export type Services = {
  authService: AuthService;
};

const ServiceContext = createContext<Services | null>(null);

export const AppContainer: React.FC<PropsWithChildren> = ({children}) => {
  const services = useMemo<Services>(() => ({
    authService: new AuthService(),
  }), []);

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
};

export const useServices = (): Services => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('Services not available: ensure AppContainer wraps your component tree.');
  }
  return context;
};
