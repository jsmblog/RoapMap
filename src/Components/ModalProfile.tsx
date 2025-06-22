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
import { informationCircle } from "ionicons/icons";
import { useAuthContext } from "../context/UserContext";
import ModalPrivacy from "./ModalPrivacy";

// Le pasamos "isOpen" y "onClose" como props
const ModalProfile: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
  const { currentUserData } = useAuthContext();
  console.log("datos del usuario", currentUserData);
  const [isModalOpenPrivacy, setIsModalOpenPrivacy] = useState(false);

  return (
    <IonModal
      className="modal-profile"
      trigger="open-modal"
      initialBreakpoint={0.9} // Ocupa 85% de la pantalla
      breakpoints={[0, 0.3, 0.5, 0.75]}
      handleBehavior="cycle"
      isOpen={isOpen}
      onDidDismiss={onClose}
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
              {currentUserData.name}{" "}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent className="profile-info">
            <IonCardSubtitle className="profile-subtitle">
              Sobre mi
            </IonCardSubtitle>
            <p className="profile-text">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores
              neque earum sit maiores repellat quisquam esse quod hic. In unde
              magnam quae alias, sed repellendus doloribus inventore culpa velit
              mollitia.
            </p>
            <IonCardSubtitle className="profile-subtitle">
              Ubicación
            </IonCardSubtitle>
            <p>Chone, Manabí, Ecuador, 9:30pm</p>
            <IonCardSubtitle className="profile-subtitle">
              Logros
            </IonCardSubtitle>
            <p>🏆 1000 puntos de experiencia</p>
          </IonCardContent>
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
        </IonCard>

        <ModalPrivacy
          isOpen={isModalOpenPrivacy}
          onClose={() => setIsModalOpenPrivacy(false)}
        />
      </IonContent>
    </IonModal>
  );
};

export default ModalProfile;
