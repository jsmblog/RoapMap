import React from 'react'
import '../styles/Saved-Record-Favorite.css'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { chevronBack } from 'ionicons/icons'
const Saved :React.FC= () => {
  return (
    <IonPage>
<IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle>Guardados</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent>
            <IonTitle>En esta seccion podras ver todos tus lugares que hayas guardado</IonTitle>
        </IonContent>
    </IonPage>
  )
}

export default Saved
