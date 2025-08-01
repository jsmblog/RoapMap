import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import { ModalProfileProps } from "../Interfaces/iProps";
import { checkmarkCircle, close, informationCircle, location } from "ionicons/icons";
import { useAuthContext } from "../context/UserContext";
import ModalPrivacy from "./ModalPrivacy";
import { useTranslation } from "react-i18next";


import "../styles/ModalProfile.css";

const ModalProfile: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
  const { currentUserData, locationDetails } = useAuthContext();
  const [isModalOpenPrivacy, setIsModalOpenPrivacy] = useState(false);
  const { t } = useTranslation();
  return (
    <IonModal
      className="modal-profile"
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      initialBreakpoint={0.98} // Altura fija: 58% del alto de pantalla
      breakpoints={[0, 0.98]} // 👈 Solo permite bajar (cerrar), no subir
      handleBehavior="none" 
    >
      <IonHeader>
        <IonToolbar className="tema-oscuro">
          <IonButtons slot="start" onClick={onClose}>
            <IonIcon className="close-icon texto-quinto " icon={close} />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">
            {t("profile")}
          </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen={true}>
        <IonCard className="card-profile">
          <img
            className="modal-profile-avatar"
            src={
              currentUserData?.photo
                ? currentUserData.photo
                : "https://ionicframework.com/docs/img/demos/avatar.svg"
            }
            alt="avatar"
          />
          <IonCardHeader>
            <IonCardTitle className="profile-name texto-quinto">
              {currentUserData?.name}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="profile-info">
            <IonCardSubtitle className="profile-subtitle texto-quinto">
              {t("aboutMe")}
            </IonCardSubtitle>
            <p className="profile-text texto-secundario">
              {currentUserData?.description?.replace(/\*/g, "")}
            </p>
            <IonCardSubtitle className="profile-subtitle texto-quinto">
              {t("location")}
            </IonCardSubtitle>
            <span className="profile-ubicacion texto-secundario">
              <IonIcon className="location-icon" icon={location} />
              {locationDetails
                ? `${locationDetails.city}, ${locationDetails.state}, ${locationDetails.country}`
                : t("loadingLocation")}
            </span>
          </IonCardContent>
        </IonCard>
        <div className="modal-profile-container-logros">
          <IonLabel className="profile-subtitle texto-quinto ionlabelSubtitle"> {t("achievements")}</IonLabel>
          {currentUserData.achievements && currentUserData.achievements.length > 0 && (
            <div className="highlights-section logros-contenedor tema-oscuro2">
              <div className="highlights-container modal-profile-logros">
                {currentUserData.achievements.map((achievement: string, index: number) => (
                  <div key={index} className="highlight-item">
                    <div className="highlight-circle">
                      <IonIcon icon={checkmarkCircle} />
                    </div>
                    <span className="highlight-label texto-primario ">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <IonFooter className="footer-profile">
          <IonToolbar className="toolbar-profile">
            <IonButton className="btn-edit-profile " routerLink="/edit-profile">
              {t("editProfile")}
            </IonButton>
          </IonToolbar>
          <IonToolbar>
            <IonButton
              slot="end"
              onClick={() => {
                setIsModalOpenPrivacy(true);
                onClose(); // <- aquí cierras la modal actual
              }}
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
