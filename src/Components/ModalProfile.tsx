import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { ModalProfileProps } from "../Interfaces/iProps";

// Le pasamos "isOpen" y "onClose" como props
const ModalProfile: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
  return (
    <IonModal
      className="modal-profile"
      trigger="open-modal"
      initialBreakpoint={0.85} // Ocupa 85% de la pantalla
      breakpoints={[0, 0.3, 0.5, 0.75]}
      handleBehavior="cycle"
      isOpen={isOpen}
      onDidDismiss={onClose}
    >
      <IonHeader className="ion-padding">
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>Este es un modal reutilizable 🎉</p>
      </IonContent>
    </IonModal>
  );
};

export default ModalProfile;
