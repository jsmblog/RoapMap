import React from 'react'
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { bookmark, chevronBack, locationOutline } from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext';
import { SavedItem } from '../Interfaces/iUser';
const Saved: React.FC = () => {
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
          <IonTitle className="settings-ion-title texto-quinto">Guardados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="favorite-content tema-oscuro">
        <IonList className='history-list tema-oscuro2'>
          {
            !currentUserData.savedPlaces || currentUserData.savedPlaces.length === 0 ? (
              <div className="empty-state">
                <IonIcon icon={bookmark} size="large" className="empty-icon" />
                <h2>No tienes lugares guardados.</h2>
                <p>Busca lugares desde la barra de búsqueda que está en la pantalla principal para guardarlos aquí.</p>
              </div>
            ) : (
              currentUserData.savedPlaces.map((place: SavedItem, index: number) => (
                <IonItem key={index} className="history-item tema-oscuro">
                  <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                  <IonLabel className='place-name place-name-history texto-primario'>{place.name}</IonLabel>
                  <p className="place-vicinity texto-secundario">Latitud: {place.location.lat}, Longitud: {place.location.lng}</p>
                </IonItem>
              ))
            )

          }
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Saved
