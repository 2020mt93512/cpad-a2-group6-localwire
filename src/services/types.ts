import type { User } from '@firebase/auth';
import type { Unsubscribe } from '@firebase/database';
import type React from 'react';

import type { EventEntry, EventTag, UpdateEventDataPayload } from '../models';
import type { LocationCoords } from '../utils/location';

export interface DbService {
  addNewUser: (newUser: User) => Promise<void>;
  addEvent: (newEvent: EventEntry, userUid: string) => Promise<void>;
  setupOnEventValueChange: (
    currentLocation: LocationCoords,
    setEventsList: React.Dispatch<React.SetStateAction<EventEntry[]>>,
    radiusInM?: number
  ) => Unsubscribe;
  setupOnMyEventsValueChange: (
    userUid: string,
    setEventsList: React.Dispatch<React.SetStateAction<EventEntry[]>>
  ) => Unsubscribe;
  getNearbyEvents: (currentLocation: LocationCoords, radiusInM?: number) => Promise<EventEntry[]>;
  getEventTags: () => Promise<EventTag[]>;
  getMyEvents: (userUid: string) => Promise<EventEntry[]>;
  getEventData: (userUid: string, eventUid: string) => Promise<EventEntry | null>;
  updateEvent: (userUid: string, eventUid: string, eventData: UpdateEventDataPayload) => Promise<void>;
  deleteEvent: (userUid: string, eventUid: string) => Promise<void>;
  verifyEvent: (createdByUid: string, userUid: string, eventUid: string) => Promise<void>;
  unverifyEvent: (createdByUid: string, userUid: string, eventUid: string) => Promise<void>;
  cancelVerifyEvent: (createdByUid: string, userUid: string, eventUid: string) => Promise<void>;
  cancelUnverifyEvent: (createdByUid: string, userUid: string, eventUid: string) => Promise<void>;
}
