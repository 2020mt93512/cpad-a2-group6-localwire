import * as firebaseAuth from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

import validators from '../utils/validators';

const validateEmailAndPassword = (inEmailId: string, inPassword: string): boolean => {
  return validators.emailId(inEmailId) && validators.password(inPassword);
};

const signUp = async (inEmailId: string, inPassword: string): Promise<UserCredential | null> => {
  if (!validateEmailAndPassword(inEmailId, inPassword)) {
    return null;
  }

  const auth = firebaseAuth.getAuth();
  return await firebaseAuth.createUserWithEmailAndPassword(auth, inEmailId, inPassword);
};

const signIn = async (inEmailId: string, inPassword: string): Promise<UserCredential | null> => {
  if (!validateEmailAndPassword(inEmailId, inPassword)) {
    return null;
  }

  const auth = firebaseAuth.getAuth();
  return await firebaseAuth.signInWithEmailAndPassword(auth, inEmailId, inPassword);
};

const signOut = (): Promise<void> => firebaseAuth.getAuth().signOut();

const authService = { signIn, signUp, signOut };

export default authService;
