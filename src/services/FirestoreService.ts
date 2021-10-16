import type { User } from '@firebase/auth';
import * as firebaseFirestore from '@firebase/firestore';

const addNewUser = (newUser: User): Promise<void> => {
  const userDoc = firebaseFirestore.doc(firebaseFirestore.getFirestore(), 'users', newUser.uid);
  return firebaseFirestore.setDoc(userDoc, {
    displayName: newUser.displayName,
    email: newUser.email,
    uid: newUser.uid,
  });
};

const firestoreService = { addNewUser };

export default firestoreService;
