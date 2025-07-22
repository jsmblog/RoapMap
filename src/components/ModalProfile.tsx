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
import { informationCircle, location } from "ionicons/icons";
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
      initialBreakpoint={0.94} // Ocupa 85% de la pantalla
      breakpoints={[0, 0.94]}
      handleBehavior="none"
      backdropDismiss={true}
    >
      <IonContent className="ion-padding" fullscreen={true}>
        <IonCard className="card-profile">
          <img
            className="modal-profile-avatar"
            src={currentUserData.photo ? currentUserData.photo : "https://ionicframework.com/docs/img/demos/avatar.svg"}
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
                :  t("loadingLocation")}
            </span>
            <IonCardSubtitle className="profile-subtitle texto-quinto">
              {t("achievements")}
            </IonCardSubtitle>
          
          </IonCardContent>
        </IonCard>

        <IonFooter className="footer-profile">
          <IonToolbar className="toolbar-profile">
            <IonButton className="btn-edit-profile" routerLink="/edit-profile">
               {t("editProfile")}
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
