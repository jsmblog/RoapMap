import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { chatbubbles, compass, home, people, settings } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route } from 'react-router'
import Home from '../pages/Home'
import Setting from '../pages/Setting'
import '../styles/tabs.css'
import Community from '../pages/Community'
const Tabs:React.FC = () => {
  return (
    <IonTabs>
    {/**esto logra la redireccion */}
      <IonRouterOutlet> 
        <Route exact path="/tab/home" component={Home} />
         <Route exact path="/tab/discover"/>
         <Route exact path="/tab/peopleGroup"/>
         <Route exact path= "/tab/community" component={Community} />
         <Route exact path="/tab/settings" component={Setting} />
        <Redirect exact from="/tab" to="/tab/home" />
      </IonRouterOutlet>

      <IonTabBar className="tab" slot="bottom">
        <IonTabButton className="tabButton" tab="home" href="/tab/home">
          <IonIcon className='icons-tab iconos-oscuros' icon={home} />
        </IonTabButton>
        <IonTabButton className="tabButton" tab="discover" href="/tab/descubir">
          <IonIcon className='icons-tab iconos-oscuros' icon={compass} />
        </IonTabButton>
        <IonTabButton className="taButton" tab="peopleGroup" href="/tab/peopleGroup">
          <IonIcon className='icons-tab iconos-oscuros' icon={people} />
        </IonTabButton>
        <IonTabButton className="taButton" tab="community" href="/tab/community">
          <IonIcon className='icons-tab iconos-oscuros' icon={chatbubbles} />
        </IonTabButton>
        <IonTabButton  className="tabButton" tab="settings" href="/tab/settings">
          <IonIcon className='icons-tab iconos-oscuros' icon={settings} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

export default Tabs
