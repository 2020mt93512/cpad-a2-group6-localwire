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
import './SideMenu.css';

interface SideMenuItem {
  url?: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  onClick?: () => void;
}

const menuItems: SideMenuItem[] = [
  {
    title: 'Log Out',
    iosIcon: logOutOutline,
    mdIcon: logOutOutline,
    onClick: authService.signOut,
  },
];

const SideMenu: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>LocalWire</IonListHeader>
          <IonNote>{user?.displayName ?? user?.email}</IonNote>
          {menuItems.map((menuItem, index) => (
            <IonMenuToggle key={index} autoHide={false}>
              <IonItem
                className={location.pathname === menuItem.url ? 'selected' : ''}
                routerLink={menuItem.url}
                routerDirection="none"
                lines="none"
                detail={false}
                onClick={menuItem.onClick}
              >
                <IonIcon slot="start" icon={menuItem.iosIcon} />
                <IonLabel>{menuItem.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
