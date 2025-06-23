import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonIcon,
  IonModal,
} from "@ionic/react";
import React, { useState } from "react";
import { ModalProfileProps } from "../Interfaces/iProps";
import "../styles/ModalProfile.css";
import { informationCircle, location } from "ionicons/icons";
import { useAuthContext } from "../context/UserContext";
import ModalPrivacy from "./ModalPrivacy";
import { UseOpenWeather } from "../hooks/UseOpenWeather";

const ModalProfile: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
  const { currentUserData } = useAuthContext();
  console.log("datos del usuario", currentUserData);
  const description = currentUserData?.description;

  const { weather } = UseOpenWeather();
  const [isModalOpenPrivacy, setIsModalOpenPrivacy] = useState(false);

  return (
   <IonModal
      className="modal-profile"
      trigger="open-modal"
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.94} // Ocupa 85% de la pantalla
       breakpoints={[0, 0.94]}
       handleBehavior="none"
        backdropDismiss={true}
    >
      <IonContent className="ion-padding">
        <IonCard className="card-profile">
          <img
            className="profile-avatar"
            src="https://ionicframework.com/docs/img/demos/avatar.svg"
            alt="avatar"
          />
          <IonCardHeader>
            <IonCardTitle className="profile-name">
              {currentUserData?.name}{" "}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="profile-info">
            <IonCardSubtitle className="profile-subtitle">
              Sobre mi
            </IonCardSubtitle>
            <p className="profile-text">
              {description.replace(/\*/g, '')}
            </p>
            <IonCardSubtitle className="profile-subtitle">
              Ubicación
            </IonCardSubtitle>
            <p> <IonIcon icon={location} />  {weather?.name}, {weather?.sys.country}</p>
            <IonCardSubtitle className="profile-subtitle">
              Logros
            </IonCardSubtitle>
            <p>🏆 1000 puntos de experiencia</p>
            <p>🏆 50 misiones completadas </p>
            <p>🏆 10 amigos en la comunidad</p>
          </IonCardContent>
        </IonCard>

        <IonFooter className="footer-profile">
            <IonButton className="btn-edit-profile" routerLink="/edit-profile">
              Editar Perfil
            </IonButton>
            <IonButton
              className="icon-information"
              expand="block"
              onClick={() => setIsModalOpenPrivacy(true)}
              id="open-modal-privacy"
              fill="clear"
            >
              <IonIcon className="icon-information" icon={informationCircle} />
            </IonButton>
          </IonFooter>

        <ModalPrivacy
          isOpen={isModalOpenPrivacy}
          onClose={() => setIsModalOpenPrivacy(false)}
        />
      </IonContent>
    </IonModal>
  );
};

export default ModalProfile;
