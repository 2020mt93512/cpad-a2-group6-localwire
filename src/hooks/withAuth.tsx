import { IonLoading } from '@ionic/react';
import React from 'react';
import { Redirect } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const withAuth =
  (Component: React.FC): React.FC =>
  () => {
    const { loading, isLoggedIn } = useAuth();

    if (loading) {
      return <IonLoading isOpen translucent spinner="lines" />;
    } else if (isLoggedIn) {
      return <Component />;
    } else {
      return <Redirect to="/login" />;
    }
  };

export { withAuth };
