import React from 'react'
import '../styles/Saved-Record-Favorite.css'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { chevronBack } from 'ionicons/icons'

const Record: React.FC = () => {
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
                    <IonTitle>Historial</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonTitle>
                   En esta sección encontrarás todo tu historial de búsquedas
                </IonTitle>
            </IonContent>

        </IonPage>
    )
}

export default Record
