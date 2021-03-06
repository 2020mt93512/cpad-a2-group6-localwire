import type { User } from '@firebase/auth';
import type { Unsubscribe } from '@firebase/database';
import * as firebaseFirestore from '@firebase/firestore';

import type { EventEntry, EventTag, UpdateEventDataPayload } from '../models';
import type { LocationCoords } from '../utils/location';

import type { DbService } from './types';

const addNewUser = (newUser: User): Promise<void> => {
  const userDoc = firebaseFirestore.doc(firebaseFirestore.getFirestore(), 'users', newUser.uid);
  return firebaseFirestore.setDoc(userDoc, {
    displayName: newUser.displayName,
    email: newUser.email,
    uid: newUser.uid,
  });
};

const addEvent = (newEvent: EventEntry, userUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const setupOnEventValueChange = (
  currentLocation: LocationCoords,
  setEventsList: React.Dispatch<React.SetStateAction<EventEntry[]>>,
  radiusInM = 50000
): Unsubscribe => {
  console.error('not implemented yet');
  return () => null;
};

const setupOnMyEventsValueChange = (
  userUid: string,
  setEventsList: React.Dispatch<React.SetStateAction<EventEntry[]>>
): Unsubscribe => {
  console.error('not implemented yet');
  return () => null;
};

const getNearbyEvents = (currentLocation: LocationCoords, radiusInM = 50000): Promise<EventEntry[]> => {
  return Promise.reject('not implemented yet');
};

const getEventTags = (): Promise<EventTag[]> => {
  return Promise.reject('not implemented yet');
};

const getMyEvents = async (userUid: string): Promise<EventEntry[]> => {
  return Promise.reject('not implemented yet');
};

const getEventData = async (userUid: string, eventUid: string): Promise<EventEntry | null> => {
  return Promise.reject('not implemented yet');
};

const updateEvent = async (userUid: string, eventUid: string, eventData: UpdateEventDataPayload): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const deleteEvent = async (userUid: string, eventUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const verifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const unverifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const cancelVerifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const cancelUnverifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  return Promise.reject('not implemented yet');
};

const firestoreService: DbService = {
  addNewUser,
  addEvent,
  setupOnEventValueChange,
  setupOnMyEventsValueChange,
  getNearbyEvents,
  getEventTags,
  getMyEvents,
  getEventData,
  updateEvent,
  deleteEvent,
  verifyEvent,
  unverifyEvent,
  cancelVerifyEvent,
  cancelUnverifyEvent,
};

export default firestoreService;
