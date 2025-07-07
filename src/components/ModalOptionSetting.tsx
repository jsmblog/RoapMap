import { IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { close } from "ionicons/icons";
import React from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";

const ModalOptionSetting: React.FC<ModalEditInfoProfileProps> = ({isOpen, onClose}) => {
  return (
    <IonModal>
      <IonHeader>
        <IonToolbar>
          <IonButtons
            className="ion-buttons-modal-edit-profile"
            slot="start"
          >
            <IonIcon className="chevron-icon" icon={close} />
          </IonButtons>
          <IonTitle className="ion-title">Modal Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        contenido modal
      </IonContent>
    </IonModal>
  );
};

export default ModalOptionSetting;
