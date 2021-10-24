import type { User } from '@firebase/auth';
import * as firebaseDatabase from '@firebase/database';
import type { DataSnapshot, DatabaseReference, Unsubscribe } from '@firebase/database';

import type { EventEntry, EventTag, UpdateEventDataPayload } from '../models';
import type { LocationCoords } from '../utils/location';
import { filterFalsePositiveGeoHash, getGeohashQueryBounds } from '../utils/location';

import type { DbService } from './types';

const addNewUser = (newUser: User): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const userRef = firebaseDatabase.ref(db, `users/${newUser.uid}`);
  return firebaseDatabase.set(userRef, {
    displayName: newUser.displayName,
    email: newUser.email,
    uid: newUser.uid,
  });
};

const addEvent = async (newEvent: EventEntry, userUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${userUid}`);
  const pushRef = await firebaseDatabase.push(eventsRef, newEvent);
  await firebaseDatabase.update(firebaseDatabase.ref(db, `events/${userUid}/${pushRef.key}`), { uid: pushRef.key });
};

const nearbyEventsQuery = (ref: DatabaseReference, bounds: string[]) =>
  firebaseDatabase.query(
    ref,
    firebaseDatabase.orderByChild('geohash'),
    firebaseDatabase.startAt(bounds[0]),
    firebaseDatabase.endAt(bounds[1])
  );

const setupOnEventValueChange = (
  currentLocation: LocationCoords,
  setEventsList: React.Dispatch<React.SetStateAction<EventEntry[]>>,
  radiusInM = 50000
): Unsubscribe => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, 'events');
  // const q = nearbyEventsQuery(eventsRef, []);
  const unsub = firebaseDatabase.onValue(eventsRef, (snapshot: DataSnapshot) => {
    const itemsByUser: Record<string, Record<string, EventEntry>> = snapshot.val();
    if (itemsByUser) {
      const itemsById = Object.values(itemsByUser);
      const items = itemsById.flatMap((i) => Object.values(i));

      const nearbyEvents = items
        .filter((eventItem) => {
          const { lat: latitude, long: longitude }: EventEntry = eventItem;
          return filterFalsePositiveGeoHash({ latitude, longitude }, currentLocation, radiusInM);
        })
        .map((items) => ({
          ...items,
          tags: items.tags ? Object.values(items.tags) : [],
          verifiedBy: items.verifiedBy ? Object.values(items.verifiedBy) : [],
          unverifiedBy: items.unverifiedBy ? Object.values(items.unverifiedBy) : [],
        }));
      setEventsList(nearbyEvents);
    } else {
      setEventsList([]);
    }
  });

  return unsub;
};

const getNearbyEvents = async (currentLocation: LocationCoords, radiusInM = 50000): Promise<EventEntry[]> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, 'events');

  const bounds = getGeohashQueryBounds(currentLocation);
  const promises = [];

  for (const b of bounds) {
    const q = firebaseDatabase.get(nearbyEventsQuery(eventsRef, b));
    promises.push(q);
  }

  const snapshots = await Promise.all(promises);
  return snapshots
    .filter((snapshot) => {
      const val = snapshot.val();
      if (val) {
        const { lat: latitude, long: longitude }: EventEntry = val;
        return filterFalsePositiveGeoHash({ latitude, longitude }, currentLocation, radiusInM);
      }
      return false;
    })
    .map((snapshot) => snapshot.val()) as EventEntry[];
};

const getMyEvents = async (userUid: string): Promise<EventEntry[]> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${userUid}`);
  const itemsSnapshot = await firebaseDatabase.get(eventsRef);
  const items: EventEntry[] = itemsSnapshot.val();
  return items
    ? Object.values(items).map((items) => ({
        ...items,
        tags: items.tags ? Object.values(items.tags) : [],
        verifiedBy: items.verifiedBy ? Object.values(items.verifiedBy) : [],
        unverifiedBy: items.unverifiedBy ? Object.values(items.unverifiedBy) : [],
      }))
    : [];
};

const getEventTags = async (): Promise<EventTag[]> => {
  const db = firebaseDatabase.getDatabase();
  const tagsRef = firebaseDatabase.ref(db, 'tags');
  const tagSnapshots = await firebaseDatabase.get(tagsRef);
  return tagSnapshots.val() as EventTag[];
};

const getEventData = async (userUid: string, eventUid: string): Promise<EventEntry | null> => {
  if (userUid && eventUid) {
    const db = firebaseDatabase.getDatabase();
    const eventsRef = firebaseDatabase.ref(db, `events/${userUid}/${eventUid}`);
    const itemsSnapshot = await firebaseDatabase.get(eventsRef);
    return itemsSnapshot?.val() ?? null;
  }

  return null;
};

const updateEvent = async (userUid: string, eventUid: string, eventData: UpdateEventDataPayload): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${userUid}/${eventUid}`);
  await firebaseDatabase.update(eventsRef, eventData);
};

const deleteEvent = async (userUid: string, eventUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${userUid}/${eventUid}`);
  return firebaseDatabase.remove(eventsRef);
};

const verifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${createdByUid}/${eventUid}/verifiedBy`);
  await firebaseDatabase.update(eventsRef, { [userUid]: userUid });
  await cancelUnverifyEvent(createdByUid, userUid, eventUid);
};

const unverifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${createdByUid}/${eventUid}/unverifiedBy`);
  await firebaseDatabase.update(eventsRef, { [userUid]: userUid });
  await cancelVerifyEvent(createdByUid, userUid, eventUid);
};

const cancelVerifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${createdByUid}/${eventUid}/verifiedBy/${userUid}`);
  await firebaseDatabase.remove(eventsRef);
};

const cancelUnverifyEvent = async (createdByUid: string, userUid: string, eventUid: string): Promise<void> => {
  const db = firebaseDatabase.getDatabase();
  const eventsRef = firebaseDatabase.ref(db, `events/${createdByUid}/${eventUid}/unverifiedBy/${userUid}`);
  await firebaseDatabase.remove(eventsRef);
};

const realtimeDbService: DbService = {
  addNewUser,
  addEvent,
  setupOnEventValueChange,
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

export default realtimeDbService;
