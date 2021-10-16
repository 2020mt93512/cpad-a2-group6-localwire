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
import firestoreService from '../../services/FirestoreService';
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
      const userCredential = await authService.signUp(emailId, password);
      if (!userCredential) {
        throw new Error('Unable to create user');
      }
      await firestoreService.addNewUser(userCredential.user);
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
    dismissSpinner,
    dismissToast,
    emailId,
    password,
    showSpinner,
    showToast,
    validateEmailId,
    validatePassword,
    redirectToLogin,
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
