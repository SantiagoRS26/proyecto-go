// ReduxProvider.tsx
'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from '@/infrastructure/store';
import { PersistGate } from 'redux-persist/integration/react';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
