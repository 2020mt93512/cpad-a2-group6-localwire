import type { InputChangeEventDetail } from '@ionic/core';
import React from 'react';

import validators from '../utils/validators';

type LoginHook = {
  emailId: string;
  password: string;
  onEmailIdChange: (event: CustomEvent<InputChangeEventDetail>) => void;
  onPasswordChange: (event: CustomEvent<InputChangeEventDetail>) => void;
  validateEmailId: () => boolean;
  validatePassword: () => boolean;
  emailError: string;
  passwordError: string;
};

const useLogin = (): LoginHook => {
  const [emailId, setEmailId] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const onEmailIdChange = React.useCallback((event: CustomEvent<InputChangeEventDetail>) => {
    setEmailId(event.detail.value?.toString() ?? '');
  }, []);

  const onPasswordChange = React.useCallback((event: CustomEvent<InputChangeEventDetail>) => {
    setPassword(event.detail.value?.toString() ?? '');
  }, []);

  const validateEmailId = React.useCallback(() => {
    if (!emailId || emailId.length === 0) {
      setEmailError('This field is mandatory');
      return false;
    }

    const result = validators.emailId(emailId);
    setEmailError(!result ? 'Please enter a valid email address' : '');
    return result;
  }, [emailId]);

  const validatePassword = React.useCallback(() => {
    const result = validators.password(password);
    setPasswordError(!result ? 'This field is mandatory' : '');
    return result;
  }, [password]);

  return {
    emailId,
    password,
    onEmailIdChange,
    onPasswordChange,
    validateEmailId,
    validatePassword,
    emailError,
    passwordError,
  };
};

export { useLogin };
