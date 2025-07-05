import { IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { chatbubble, chatbubbles, compass, compassOutline, home, location, people, settings } from 'ionicons/icons'
import React from 'react'
import { Redirect, Route } from 'react-router'
import Home from '../pages/Home'
import Setting from '../pages/Setting'
import '../styles/tabs.css'
const Tabs:React.FC = () => {
  return (
    <IonTabs className='ion-tab'>
    {/**esto logra la redireccion */}
      <IonRouterOutlet> 
        <Route exact path="/tab/home" component={Home} />
         <Route exact path="/tab/descubir" />
         <Route exact path="/tab/peopleGroup"/>
         <Route exact path= "/tab/community"/>
         <Route exact path="/tab/settings" component={Setting} />
        <Redirect exact from="/tab" to="/tab/home" />
      </IonRouterOutlet>

      <IonTabBar className="tab" slot="bottom">
        <IonTabButton className="tabButton" tab="home" href="/tab/home">
          <IonIcon className='icons-tab' icon={home} />
        </IonTabButton>
        <IonTabButton className="tabButton" tab="descubir" href="/tab/descubir">
          <IonIcon className='icons-tab' icon={compass} />
        </IonTabButton>
        <IonTabButton className="taButton" tab="peopleGroup" href="/tab/peopleGroup">
          <IonIcon className='icons-tab' icon={people} />
        </IonTabButton>
        <IonTabButton className="taButton" tab="community" href="/tab/community">
          <IonIcon className='icons-tab' icon={chatbubbles} />
        </IonTabButton>
        <IonTabButton  className="tabButton" tab="settings" href="/tab/settings">
          <IonIcon className='icons-tab' icon={settings} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  )
}

export default Tabs
