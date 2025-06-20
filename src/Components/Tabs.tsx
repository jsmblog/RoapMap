import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { home, location, people, person, settings } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route } from 'react-router'
import Home from '../pages/Home'
import Profile from '../pages/EditProfile'

const Tabs:React.FC = () => {
  return (
    <IonTabs>
    {/**esto logra la redireccion */}
      <IonRouterOutlet> 
        <Route exact path="/tab/home" component={Home} />
         <Route exact path="/tab/location" />
         <Route exact path="/tab/peopleGroup"/>
         <Route exact path="/tab/settings"  />
        <Redirect exact from="/tab" to="/tab/home" />
      </IonRouterOutlet>

      <IonTabBar className="tab" slot="bottom">
        <IonTabButton className="tabButton" tab="home" href="/tab/home">
          <IonIcon icon={home} />
        </IonTabButton>
        <IonTabButton className="tabButton" tab="location" href="/tab/location">
          <IonIcon icon={location} />
        </IonTabButton>
        <IonTabButton className="taButton" tab="peopleGroup" href="/tab/peopleGroup">
          <IonIcon icon={people} />
        </IonTabButton>
        <IonTabButton  className="tabButton" tab="settings" href="/tab/settings">
          <IonIcon icon={settings} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

export default Tabs
