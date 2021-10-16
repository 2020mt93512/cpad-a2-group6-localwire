import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import { withAuth } from '../../hooks/withAuth';
import './Home.css';

const Home: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>LocalWire</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent fullscreen>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">LocalWire</IonTitle>
        </IonToolbar>
      </IonHeader>
    </IonContent>
  </IonPage>
);

export default withAuth(Home);
