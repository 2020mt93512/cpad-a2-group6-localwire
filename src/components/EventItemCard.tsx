import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from '@ionic/react';
import React from 'react';

import type { EventEntry } from '../models';

export interface EventItemCardProps {
  event: EventEntry;
}

const EventItemCard: React.FC<EventItemCardProps> = ({ event }) => (
  <IonCard>
    <IonCardHeader>
      {/* <IonCardSubtitle>{event.region}</IonCardSubtitle> */}
      <IonCardTitle>{event.title}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{event.description}</IonCardContent>
  </IonCard>
);

export default EventItemCard;
