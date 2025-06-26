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
  IonToolbar,
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

  const { weather } = UseOpenWeather();
  const [isModalOpenPrivacy, setIsModalOpenPrivacy] = useState(false);

  return (
    <IonModal
      className="modal-profile"
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={0.94} // Ocupa 85% de la pantalla
      breakpoints={[0, 0.94]}
      handleBehavior="none"
      backdropDismiss={true}
    >
      <IonContent className="ion-padding" fullscreen={true}>
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
              {currentUserData?.description?.replace(/\*/g, "")}
            </p>
            <IonCardSubtitle className="profile-subtitle">
              Ubicación
            </IonCardSubtitle>
            <p>
              {" "}
              <IonIcon icon={location} /> {weather?.name},{" "}
              {weather?.sys.country}
            </p>
            <IonCardSubtitle className="profile-subtitle">
              Logros
            </IonCardSubtitle>
            <p>🏆 1000 puntos de experiencia</p>
            <p>🏆 50 misiones completadas </p>
            <p>🏆 10 amigos en la comunidad</p>
          </IonCardContent>
        </IonCard>

        <IonFooter className="footer-profile">
          <IonToolbar className="toolbar-profile">
            <IonButton className="btn-edit-profile" routerLink="/edit-profile">
              Editar Perfil
            </IonButton>
          </IonToolbar>
          <IonToolbar className="toolbar-icon">
            <IonButton
              expand="block"
              onClick={() => setIsModalOpenPrivacy(true)}
              fill="clear"
            >
              <IonIcon className="icon-information" icon={informationCircle} />
            </IonButton>
          </IonToolbar>
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
