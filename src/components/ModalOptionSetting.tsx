import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useState } from "react";
import { ModalOptionSettingProps } from "../Interfaces/iProps";

const ModalOptionSetting: React.FC<ModalOptionSettingProps> = ({
  isOpen,
  onClose,
  info,
  setInfo,
}) => {
  /*estado para mostrar el valor seleccionado */
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  return (
    <IonModal
      className="modal-setting-options"
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      initialBreakpoint={info.initialBreakpoint}
      breakpoints={[0, info.breakpoints]}
      handleBehavior="none"
    >
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="modal-edit-profile-toolbar">
          <IonButtons className="ion-buttons-modal-edit-profile" slot="start" onClick={onClose}>
            <IonIcon className="chevron-icon" icon={close} />
          </IonButtons>
          <IonTitle className="ion-title">{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="animacion-slide-top">
        <IonList className="modal-contente-setting">
          <IonLabel>{info.subtitle}</IonLabel>
          {info.options?.map((option, index) => (
            <IonItem
              key={index}
              button
              onClick={() => setSelectedOptionIndex(index)}
              className={selectedOptionIndex === index ? "option-selected-setting" : ""}
            >
              {option.icon === "none" ? (
                <div>
                  <IonLabel>
                    {option.label}
                  </IonLabel>
                </div>
              ) : (
                <>
                  <IonIcon className="setting-icons" icon={option.icon} />
                  <IonLabel>{option.label} </IonLabel>
                </>
              )}
              {/* Este span será el visto ✔️ */}
              <span className="checkmark">✔</span>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ModalOptionSetting;
