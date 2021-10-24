import { IonApp, IonRouterOutlet, IonLoading, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';

import SideMenu from './components/SideMenu';
import TabMenu from './components/TabMenu';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import SignIn from './pages/login/SignIn';
import SignUp from './pages/login/SignUp';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const AppRouter: React.FC = () => {
  const { loading, isLoggedIn } = useAuth();

  return (
    <>
      {loading ? (
        <IonLoading isOpen translucent spinner="lines" />
      ) : (
        <IonReactRouter>
          <>
            {isLoggedIn ? (
              <IonSplitPane contentId="main" when={false}>
                <SideMenu />
                <IonRouterOutlet id="main">
                  <Switch>
                    <TabMenu />
                  </Switch>
                </IonRouterOutlet>
              </IonSplitPane>
            ) : (
              <IonRouterOutlet>
                <Switch>
                  <Route exact path="/login" component={SignIn} />
                  <Route exact path="/signup" component={SignUp} />
                  <Redirect from="/" to="/login" exact />
                  <Redirect from="*" to="/login" exact />
                </Switch>
              </IonRouterOutlet>
            )}
          </>
        </IonReactRouter>
      )}
    </>
  );
};

const App: React.FC = () => (
  <IonApp>
    <LoadingProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LoadingProvider>
  </IonApp>
);

export default App;
