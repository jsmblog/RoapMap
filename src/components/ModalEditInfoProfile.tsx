import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";
import "../styles/ModalEditInfoProfile.css";

const ModalEditInfoProfile: React.FC<ModalEditInfoProfileProps> = ({
  isOpen,
  onClose,
  info
}) => {
    console.log("ModalEditInfoProfile", info);
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      initialBreakpoint={0.58} // Altura fija: 58% del alto de pantalla
      breakpoints={[0, 0.58]} // 👈 Solo permite bajar (cerrar), no subir
      handleBehavior="none" // 👈 Evita ciclo de breakpoints
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/edit-profile" icon={chevronBack} />
          </IonButtons>
          <IonTitle>title</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Content</h1>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditInfoProfile;
