import React, { useState } from 'react'
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { bookmark, chevronBack, locationOutline } from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext';
import { SavedItem } from '../Interfaces/iUser';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useAlert } from '../hooks/UseAlert';
const Saved: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const { showAlert, AlertComponent } = useAlert();

  const [isCheckMark, setIsCheckMark] = useState(false);
  const [btnAction, setBtnAction] = useState(true)
  const [OnConfirm, setOnConfirm] = useState(false);
  const [onCancel, setOnCancel] = useState(false);

  const [isDeleteAll, setIsDeleteAll] = useState<string[]>([]);

  const handleRemoveSaved = () => {
    try {
      const todosLosIds = currentUserData.savedPlaces?.map((saved: SavedItem) => saved.id) || [];
      setIsDeleteAll(todosLosIds);  // ← esto marca todos los checkboxes
      setOnConfirm(true);
      setOnCancel(true);
      setIsCheckMark(true);
      setBtnAction(false);

    } catch (error) {
      console.log("Ocurrio un error al querer eliminar", error)
    }
  };

  const handleSelectSaved = (id: string, checked: boolean) => {
    if (checked) {
      setIsDeleteAll(prev => [...prev, id]); // lo agrega si está marcado
    } else {
      setIsDeleteAll(prev => prev.filter(favId => favId !== id)); // lo quita si lo desmarca
    }
  };

  const ConfirmDeletSaved = async () => {
    try {

      console.log("Favoritos Eliminados:", isDeleteAll)
      const savedFilter = currentUserData.savedPlaces.filter((saved: SavedItem) => !isDeleteAll.includes(saved.id))

      const refDocument = doc(db, 'USERS', currentUserData.uid);
      await updateDoc(refDocument, { sp: savedFilter })

      showAlert(
        'Elimación Correcta',
        'Se han eliminado correctamente tus guardados ✨'
      );
      setIsCheckMark(false);
      setOnConfirm(false)
      setIsDeleteAll([]); // limpia selección
      setBtnAction(true);
    } catch (error) {
      console.log("Ocurrio un error al querer eliminar", error)
    }
  }
  console.log("Todos los ids a eliminar:", isDeleteAll)
  const CalcelDeletSaved = () => {
    setIsCheckMark(false);
    setOnConfirm(false);
    setOnCancel(false);
    setBtnAction(true);
    setIsDeleteAll([]); // limpia selección
  }

  return (
    <IonPage>
      {AlertComponent}
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">Guardados ({currentUserData.savedPlaces?.length || 0})</IonTitle>
          {
            btnAction && (
              <IonButton
                onClick={handleRemoveSaved}
                disabled={currentUserData.savedPlaces.length === 0}
                fill="outline"
                className="btn-action btn-delete"
                slot='end'
              >
                Eliminar todo
              </IonButton>
            )
          }
        </IonToolbar>
      </IonHeader>
      <IonContent className="favorite-content tema-oscuro">
        <IonList className='history-list tema-oscuro2'>
          <>
            <div className="button-container">

              {
                OnConfirm && (
                  <IonButton
                    onClick={ConfirmDeletSaved}
                    fill="solid"
                    color="success"
                    className="btn-action btn-confirm"
                  >
                    Confirmar
                  </IonButton>
                )
              }
              {
                onCancel && (
                  <IonButton
                    onClick={CalcelDeletSaved}
                    fill="outline"
                    color="danger"
                    className="btn-action btn-cancel"
                  >
                    Cancelar
                  </IonButton>
                )
              }
            </div>
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
                    <div  className="header-content">
                      <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                    <IonLabel className='place-name place-name-history texto-primario'>{place.name}</IonLabel>
                    {isCheckMark && (
                      <IonCheckbox
                        checked={isDeleteAll.includes(place.id)}
                        onIonChange={(e) => handleSelectSaved(place.id, e.detail.checked)}
                      />
                    )}
                    </div>
                  </IonItem>
                ))
              )

            }
          </>
        </IonList>
      </IonContent>
    </IonPage>
  )
}

export default Saved
