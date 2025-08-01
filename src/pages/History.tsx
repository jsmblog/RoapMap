import React, { useState } from 'react'
import { IonBackButton, IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { chevronBack, locationOutline } from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext'
import '../styles/History.css'
import { HistoryItem } from '../Interfaces/iUser'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../Firebase/initializeApp'
import { useAlert } from '../hooks/UseAlert'

const History: React.FC = () => {
    const { currentUserData } = useAuthContext();
    const { showAlert, AlertComponent } = useAlert();

    const [isCheckMark, setIsCheckMark] = useState(false);
    const [btnAction, setBtnAction] = useState(true)
    const [OnConfirm, setOnConfirm] = useState(false);
    const [onCancel, setOnCancel] = useState(false);
    const [isDeleteAll, setIsDeleteAll] = useState<string[]>([]);

    const handleRemoveHistory = () => {
        try {
            const todosLosIds = currentUserData.history?.map((history: HistoryItem) => history.id) || [];
            setIsDeleteAll(todosLosIds);  // ← esto marca todos los checkboxes
            setOnConfirm(true);
            setOnCancel(true);
            setIsCheckMark(true);
            setBtnAction(false);

        } catch (error) {
            console.log("Ocurrio un error al querer eliminar", error)
        }
    };

    const handleSelectHistory = (id: string, checked: boolean) => {
        if (checked) {
            setIsDeleteAll(prev => [...prev, id]); // lo agrega si está marcado
        } else {
            setIsDeleteAll(prev => prev.filter(favId => favId !== id)); // lo quita si lo desmarca
        }
    };

    const ConfirmDeletHistory = async () => {
        try {

            console.log("Favoritos Eliminados:", isDeleteAll)
            const historyFilter = currentUserData.history.filter((h: HistoryItem) => !isDeleteAll.includes(h.id))

            const refDocument = doc(db, 'USERS', currentUserData.uid);
            await updateDoc(refDocument, { h: historyFilter })

            showAlert(
                'Elimación Correcta',
                'Se han eliminado correctamente tu historial ✨'
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
    const CalcelDeletHistory = () => {
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
                    <IonTitle className="settings-ion-title texto-quinto">Historial</IonTitle>
                    {
                        btnAction && (
                            <IonButton
                                onClick={handleRemoveHistory}
                                disabled={currentUserData.history.length === 0}
                                fill="outline"
                                className="btn-action btn-delete"
                                slot="end"
                            >
                                Eliminar todo
                            </IonButton>
                        )
                    }
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
                            <>
                                <div className="button-container">

                                    {
                                        OnConfirm && (
                                            <IonButton
                                                onClick={ConfirmDeletHistory}
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
                                                onClick={CalcelDeletHistory}
                                                fill="outline"
                                                color="danger"
                                                className="btn-action btn-cancel">
                                                Cancelar
                                            </IonButton>
                                        )
                                    }
                                </div>
                                {
                                    currentUserData.history.map((place: HistoryItem, index: number) => (
                                        <IonItem key={index} className="history-item tema-oscuro">
                                            <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                                            <IonLabel className='place-name place-name-history texto-primario'>
                                                {place.name}
                                            <p className='history-date'>{place.date}</p>
                                            </IonLabel>
                                            {isCheckMark && (
                                                <IonCheckbox
                                                    checked={isDeleteAll.includes(place.id)}
                                                    onIonChange={(e) => handleSelectHistory(place.id, e.detail.checked)}
                                                />
                                            )}
                                        </IonItem>
                                    ))
                                }
                            </>
                        </IonList>
                    )
                }
            </IonContent>

        </IonPage>
    )
}

export default History
