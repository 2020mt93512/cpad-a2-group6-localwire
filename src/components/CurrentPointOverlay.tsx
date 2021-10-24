import { IonCardSubtitle, IonNote } from '@ionic/react';
import React from 'react';

import './MapOverlay.css';

const CurrentPointOverlay: React.FC = () => (
  <div className="overlay-container">
    <IonCardSubtitle>Current Location</IonCardSubtitle>
    <IonNote color="medium">
      Click on the lightning button then choose a new point on the map to view events around that point.
    </IonNote>
  </div>
);

export default CurrentPointOverlay;
