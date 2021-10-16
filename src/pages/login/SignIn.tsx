import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  IonRouterLink,
  useIonToast,
} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import { Redirect } from 'react-router-dom';

import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { useLogin } from '../../hooks/login';
import authService from '../../services/AuthService';
import './Login.css';

const SignIn: React.FC = () => {
  const {
    emailId,
    password,
    onEmailIdChange,
    onPasswordChange,
    validateEmailId,
    validatePassword,
    emailError,
    passwordError,
  } = useLogin();
  const { showSpinner, dismissSpinner } = useLoading();
  const [showToast, dismissToast] = useIonToast();
  const history = useHistory();
  const { isLoggedIn } = useAuth();

  const onLoginClick = React.useCallback(async () => {
    const isEmailValid = validateEmailId();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    showSpinner('login');
    try {
      await authService.signIn(emailId, password);
      history.push('/home');
    } catch (err: any) {
      console.error(err);
      showToast({
        message: err?.message ?? 'Invalid email id or password. Please try again',
        duration: 5000,
        buttons: [{ text: 'close', handler: () => dismissToast() }],
      });
    } finally {
      dismissSpinner('login');
    }
  }, [
    dismissSpinner,
    dismissToast,
    emailId,
    password,
    showSpinner,
    showToast,
    validateEmailId,
    validatePassword,
    history,
  ]);

  if (isLoggedIn) {
    return <Redirect to="/home" />;
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-grid">
          <IonCard className="login-form">
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">Login</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <Input
                label="Email ID"
                value={emailId}
                placeholder="test@example.com"
                required
                error={emailError}
                onIonChange={onEmailIdChange}
                onIonBlur={validateEmailId}
              />
              <Input
                label="Password"
                value={password}
                type="password"
                placeholder="password"
                required
                error={passwordError}
                onIonChange={onPasswordChange}
                onIonBlur={validatePassword}
              />
            </IonCardContent>

            <IonCardContent>
              <IonButton expand="block" disabled={!!(emailError || passwordError)} onClick={onLoginClick}>
                Login
              </IonButton>
            </IonCardContent>

            <IonCardContent>
              <IonCardSubtitle className="ion-text-center">
                Don't have an account yet? <IonRouterLink routerLink="/signup">Sign Up.</IonRouterLink>
              </IonCardSubtitle>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
