import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonPage,
  useIonToast,
} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';

import Input from '../../components/Input';
import { useLoading } from '../../context/LoadingContext';
import { useLogin } from '../../hooks/login';
import authService from '../../services/AuthService';
import dbService from '../../services/DbServiceImpl';
import './Login.css';

const SignUp: React.FC = () => {
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
  const [displayName, setDisplayName] = React.useState<string>('');
  const history = useHistory();

  const { showSpinner, dismissSpinner } = useLoading();
  const [showToast, dismissToast] = useIonToast();

  const redirectToLogin = React.useCallback(() => {
    history.replace('/login');
  }, [history]);

  const onRegisterClick = React.useCallback(async () => {
    const isEmailValid = validateEmailId();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    showSpinner('login');
    try {
      const userCredential = await authService.signUp(emailId, password, displayName);
      if (!userCredential) {
        throw new Error('Unable to create user');
      }
      await dbService.addNewUser(userCredential.user);
      redirectToLogin();
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
    validateEmailId,
    validatePassword,
    showSpinner,
    emailId,
    password,
    displayName,
    redirectToLogin,
    showToast,
    dismissToast,
    dismissSpinner,
  ]);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-grid">
          <IonCard className="login-form">
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">Sign Up</IonCardTitle>
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
              <Input
                label="Display Name"
                value={displayName}
                onIonChange={(e) => setDisplayName(e.detail.value ?? '')}
              />
            </IonCardContent>

            <IonCardContent>
              <IonButton expand="block" disabled={!!(emailError || passwordError)} onClick={onRegisterClick}>
                Register
              </IonButton>
            </IonCardContent>

            <IonCardContent>
              <IonCardSubtitle className="ion-text-center">
                Already have an account? {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={redirectToLogin}>Login.</a>
              </IonCardSubtitle>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
