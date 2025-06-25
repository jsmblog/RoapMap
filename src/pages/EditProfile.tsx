import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import "../styles/EditProfile.css";
import { useAuthContext } from "../context/UserContext";
import { chevronForwardOutline } from "ionicons/icons";
import { UseOpenWeather } from "../hooks/UseOpenWeather";
const EditProfile: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const { weather } = UseOpenWeather();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="edit-profile-header">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/user" />
          </IonButtons>
          <IonTitle>Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-profile-content" fullscreen>
        <div className="edit-profile-info-container">
            <IonAvatar>
              <IonImg
                className="edit-profile-avatar"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                alt="Avatar"
              />
            </IonAvatar>

            <IonItem className="edit-profile-item">
              <IonLabel>Nombre</IonLabel>
              <IonLabel>{currentUserData?.name} <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
            <IonItem className="edit-profile-item">
              <IonLabel>Genero</IonLabel>
              <IonLabel>Ninguno <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
            <IonItem className="edit-profile-item">
              <IonLabel>Fecha de Nacimiento</IonLabel>
              <IonLabel>01/01/2000 <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
            <IonItem className="edit-profile-item">
              <IonLabel>Ubicación</IonLabel>
              <IonLabel>{weather?.name},{weather?.sys.country} <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
            <IonItem className="edit-profile-item">
              <IonLabel>Descripción</IonLabel>
              <IonLabel>{currentUserData?.description?.replace(/\*/g, '')} <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
            <IonItem className="edit-profile-item">
              <IonLabel>Contraseña</IonLabel>
              <IonLabel>******** <IonIcon icon={chevronForwardOutline} /></IonLabel>
            </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
