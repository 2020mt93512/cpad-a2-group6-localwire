import { useIonLoading } from '@ionic/react';
import React from 'react';

type LoadingContextType = {
  loading: boolean;
  showSpinner: (id: string) => void;
  dismissSpinner: (id: string) => void;
};

const LoadingContext = React.createContext<LoadingContextType>({
  loading: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showSpinner: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dismissSpinner: () => {},
});

const pendingSpinners: string[] = [];

const LoadingProvider: React.FC = ({ children }) => {
  const [showLoader, dismissLoader] = useIonLoading();

  const updateLoaderVisibility = React.useCallback(
    (isSpinnerAlreadyVisible?: boolean) => {
      if (pendingSpinners.length === 0) {
        dismissLoader();
      } else if (!isSpinnerAlreadyVisible) {
        showLoader({ spinner: 'lines' });
      }
    },
    [dismissLoader, showLoader]
  );

  const showSpinner = React.useCallback(
    (id: string): void => {
      pendingSpinners.push(id);
      updateLoaderVisibility(pendingSpinners.length > 1);
    },
    [updateLoaderVisibility]
  );

  const dismissSpinner = React.useCallback(
    (id: string): void => {
      const idx = pendingSpinners.findIndex((item) => item === id);
      if (idx !== -1) {
        pendingSpinners.splice(idx, 1);
      }
      updateLoaderVisibility();
    },
    [updateLoaderVisibility]
  );

  const value: LoadingContextType = { loading: pendingSpinners.length > 0, showSpinner, dismissSpinner };

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

const useLoading = (): LoadingContextType => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export { LoadingProvider, useLoading };
