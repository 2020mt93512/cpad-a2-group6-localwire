import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon } from '@ionic/react';
import { mapOutline, listOutline } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';

import MapView from '../pages/map/MapView';
import MyEvents from '../pages/my-events/MyEvents';
import ViewEvent from '../pages/view-event/ViewEvent';

/* Theme variables */
import './TabMenu.css';

export interface TabMenuItem {
  id: string;
  title: string;
  iosIcon: string;
  mdIcon: string;
  path: string;
  component: React.ComponentType;
}

const tabs: TabMenuItem[] = [
  {
    id: 'tab1',
    title: 'Local Events',
    iosIcon: mapOutline,
    mdIcon: mapOutline,
    path: '/events/local',
    component: MapView,
  },
  {
    id: 'tab2',
    title: 'All Events',
    iosIcon: listOutline,
    mdIcon: listOutline,
    path: '/events/my',
    component: MyEvents,
  },
];

const TabMenu: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      {tabs.map((tabMenuItem) => (
        <Route key={tabMenuItem.id} exact path={tabMenuItem.path} component={tabMenuItem.component} />
      ))}
      <Route exact path="/events/:useruid/:eventuid">
        <ViewEvent />
      </Route>
      <Redirect from="/login" to="/events/local" exact />
      <Redirect from="/signup" to="/events/local" exact />
      <Redirect from="/" to="/events/local" exact />
      <Redirect to="/events/local" />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      {tabs.map((tabMenuItem) => (
        <IonTabButton key={tabMenuItem.id} tab={tabMenuItem.id} href={tabMenuItem.path}>
          <IonIcon icon={tabMenuItem.iosIcon} />
        </IonTabButton>
      ))}
    </IonTabBar>
  </IonTabs>
);

export default TabMenu;
