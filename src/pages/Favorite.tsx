import React, { useState } from 'react'
import '../styles/Favorites.css'
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonIcon,
    IonButton,
    IonItem,
    IonLabel,
    IonCheckbox,
} from '@ionic/react'
import {
    chevronBack,
    heart,
    locationOutline,
} from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext';
import { FavoriteItem } from '../Interfaces/iUser';
import { useAlert } from '../hooks/UseAlert';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';

const Favorite: React.FC = () => {
    const { currentUserData } = useAuthContext();
    const { showAlert, AlertComponent } = useAlert();

    const [isCheckMark, setIsCheckMark] = useState(false);
    const [btnAction, setBtnAction] = useState(true)
    const [OnConfirm, setOnConfirm] = useState(false);
    const [onCancel, setOnCancel] = useState(false);
    const [isDeleteAll, setIsDeleteAll] = useState<string[]>([]);

    const handleRemoveFavorite = () => {
        try {
            const todosLosIds = currentUserData.favorites?.map((favorite: FavoriteItem) => favorite.id) || [];
            setIsDeleteAll(todosLosIds);  // ← esto marca todos los checkboxes
            setOnConfirm(true);
            setOnCancel(true);
            setIsCheckMark(true);
            setBtnAction(false);

        } catch (error) {
            console.log("Ocurrio un error al querer eliminar", error)
        }
    };

    const handleSelectFavorite = (id: string, checked: boolean) => {
        if (checked) {
            setIsDeleteAll(prev => [...prev, id]); // lo agrega si está marcado
        } else {
            setIsDeleteAll(prev => prev.filter(favId => favId !== id)); // lo quita si lo desmarca
        }
    };

    const ConfirmDeletFavorites = async () => {
        try {

            console.log("Favoritos Eliminados:", isDeleteAll)
            const favFilter = currentUserData.favorites.filter((fav: FavoriteItem) => !isDeleteAll.includes(fav.id))

            const refDocument = doc(db, 'USERS', currentUserData.uid);
            await updateDoc(refDocument, { fav: favFilter })

            showAlert(
                'Elimación Correcta',
                'Se han eliminado correctamente tus favoritos ✨'
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
    const CalcelDeletFavorites = () => {
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
                    <IonTitle className="settings-ion-title texto-quinto">Favoritos ({currentUserData.favorites?.length || 0})</IonTitle>
                    {
                        btnAction && (
                            <IonButton
                                onClick={handleRemoveFavorite}
                                disabled={currentUserData.favorites.length === 0}
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

            <IonContent className="favorite-content tema-oscuro">
                {!currentUserData.favorites || currentUserData.favorites.length === 0 ? (
                    <div className="empty-state">
                        <IonIcon icon={heart} size="large" className="empty-icon" />
                        <h3>Sin favoritos aún</h3>
                        <p>Marca lugares como favoritos desde el mapa para verlos aquí</p>
                    </div>
                ) : (

                    <IonList className="favorites-list tema-oscuro2">
                        <>
                            <div className="button-container">

                                {
                                    OnConfirm && (
                                        <IonButton
                                            onClick={ConfirmDeletFavorites}
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
                                            onClick={CalcelDeletFavorites}
                                            fill="outline"
                                            color="danger"
                                            className="btn-action btn-cancel">
                                            Cancelar
                                        </IonButton>
                                    )
                                }
                            </div>
                            {currentUserData.favorites.map((favorite: FavoriteItem, index: number) => (

                                <IonItem
                                    key={index}
                                    className='favorite-content tema-oscuro'

                                >
                                    <div className="header-content">
                                        <div className="place-info">
                                            <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                                            <div className="text-content">
                                                <IonLabel className="place-name texto-primario">
                                                    {favorite.name}
                                                </IonLabel>
                                                <IonLabel className="place-vicinity texto-secundario">
                                                    {favorite.vicinity}
                                                </IonLabel>
                                                {isCheckMark && (
                                                    <IonCheckbox
                                                        checked={isDeleteAll.includes(favorite.id)}
                                                        onIonChange={(e) => handleSelectFavorite(favorite.id, e.detail.checked)}
                                                    />
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </IonItem>
                            ))}
                        </>
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Favorite