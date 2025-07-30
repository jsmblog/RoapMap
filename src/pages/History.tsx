import React from 'react'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { chevronBack, locationOutline } from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext'
import '../styles/History.css'

const History: React.FC = () => {
    const { currentUserData } = useAuthContext();

    return (
        <IonPage>
            <IonHeader className="edit-profile-hearder">
                <IonToolbar className="setting-toolbar tema-oscuro">
                    <IonButtons slot="start">
                        <IonBackButton
                            defaultHref="/tab/settings"
                            className="iconos-oscuros"
                            icon={chevronBack}
                        />
                    </IonButtons>
                    <IonTitle className="settings-ion-title texto-quinto">Historial</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="favorite-content tema-oscuro ">
                {
                    !currentUserData.history || currentUserData.history.length === 0 ? (
                        <div className="empty-state">
                            <IonIcon icon={locationOutline} size="large" className="empty-icon" />
                            <h2>No tienes historial de lugares visitados.</h2>
                            <p>Busca lugares  desde la barra de busqueda que esdta en la pantalla principal para verlos aquí</p>
                        </div>
                    ) : (
                        <IonList className='history-list tema-oscuro2'>
                            {
                                currentUserData.history.map((place: any, index: number) => (
                                    <IonItem key={index} className="history-item tema-oscuro">
                                        <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                                        <IonLabel className='place-name place-name-history texto-primario'>
                                            {place}
                                        </IonLabel>
                                    </IonItem>
                                ))
                            }
                        </IonList>
                    )
                }
            </IonContent>

        </IonPage>
    )
}

export default History
