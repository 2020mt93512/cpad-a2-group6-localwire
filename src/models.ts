export interface EventEntry {
  title: string;
  uid: string;
  description: string;
  tags: number[];
  lat: number;
  long: number;
  geohash: string;
  createdBy: string;
  timestamp: number;
  verifiedBy: string[];
  unverifiedBy: string[];
}

export interface EventTag {
  uid: number;
  name: string;
}

export type UpdateEventDataPayload = Partial<{ title: string; description: string; tags: number[] }>;
