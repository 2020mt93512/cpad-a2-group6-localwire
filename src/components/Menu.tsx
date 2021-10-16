import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import authService from '../services/AuthService';
import './Menu.css';

interface AppPage {
  url?: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  onClick?: () => void;
}

const appPages: AppPage[] = [
  {
    title: 'Log Out',
    iosIcon: logOutOutline,
    mdIcon: logOutOutline,
    onClick: authService.signOut,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>LocalWire</IonListHeader>
          <IonNote>{user?.displayName ?? user?.email}</IonNote>
          {appPages.map((appPage, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                className={location.pathname === appPage.url ? 'selected' : ''}
                routerLink={appPage.url}
                routerDirection="none"
                lines="none"
                detail={false}
                onClick={appPage.onClick}
              >
                <IonIcon slot="start" icon={appPage.iosIcon} />
                <IonLabel>{appPage.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
