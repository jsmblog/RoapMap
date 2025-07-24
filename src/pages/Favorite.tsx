import React from 'react'
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonItem,
    IonListHeader,
    IonLabel,
} from '@ionic/react'
import {
    chevronBack,
    heart,
    locationOutline,
    heartDislike,
} from 'ionicons/icons'
import { useAuthContext } from '../context/UserContext';
import { FavoriteItem } from '../Interfaces/iUser';
import { useAlert } from '../hooks/UseAlert';

const Favorite: React.FC = () => {
    const { currentUserData } = useAuthContext();
    const { showAlert, AlertComponent} = useAlert();
    


    const handleRemoveFavorite = (index: number) => {
        // Aquí iría la lógica para remover el favorito
        console.log('Remover favorito:', index);
        showAlert(
            '¿Eliminar favorito?',
            '¿Estás segura que quieres quitar este lugar de tus favoritos?',
            'dark',
            () => {
                // Aquí iría la lógica real para eliminar el favorito usando el índice
                console.log('Favorito eliminado:', index);
            }
        );
    };

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
                    <IonTitle className="settings-ion-title texto-quinto">Favoritos ({currentUserData.favorites?.length || 0} )</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="favorite-content ">
                {!currentUserData.favorites || currentUserData.favorites.length === 0 ? (
                    <div className="empty-state">
                        <IonIcon icon={heart} size="large" className="empty-icon" />
                        <h3>Sin favoritos aún</h3>
                        <p>Marca lugares como favoritos desde el mapa para verlos aquí</p>
                    </div>
                ) : (
                    <IonList className="favorites-list tema-oscuro2">
                        {currentUserData.favorites.map((favorite: FavoriteItem, index: number) => (
                            <IonItem key={index} className="favorite-card ">
                                <IonListHeader className="card-header">
                                    <div className="header-content">
                                        <div className="place-info">                                            <IonIcon
                                            icon={locationOutline}
                                            className="category-icon"
                                        />
                                            <div className="text-content">
                                                <IonLabel className="place-name">
                                                    {favorite.name}
                                                </IonLabel>
                                                <IonLabel className="place-vicinity texto-terciario">
                                                    {favorite.vicinity}
                                                </IonLabel>
                                            </div>
                                        </div>
                                        <div className="action-buttons">
                                            <IonButton
                                                fill="clear"
                                                className="action-btn remove-btn"
                                                onClick={() => handleRemoveFavorite(index)}
                                                aria-label={`Quitar ${favorite.name} de favoritos`}
                                            >
                                                <IonIcon icon={heartDislike} className='favorite-icon' />
                                            </IonButton>
                                        </div>

                                    </div>

                                </IonListHeader>
                            </IonItem>
                        ))}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Favorite