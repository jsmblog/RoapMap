import {
  IonButton,
  IonButtons,
  IonContent,
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
import { useLanguage } from "../context/LanguageContext";

const ModalOptionSetting: React.FC<ModalOptionSettingProps> = ({
  isOpen,
  onClose,
  info
}) => {
  /*estado para mostrar el valor seleccionado */
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const { changeLanguage, currentLang } = useLanguage();

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
          <IonButtons
            className="ion-buttons-modal-edit-profile"
            slot="start"
            onClick={onClose}
          >
            <IonIcon className="chevron-icon  iconos-oscuros" icon={close} />
          </IonButtons>
          <IonTitle className="ion-title texto-quinto">{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="animacion-slide-top">
        <IonList className="modal-contente-setting">
          <IonLabel>{info.subtitle}</IonLabel>
          {info.options?.map((option, index) => (
            <IonItem
              key={index}
              button
              onClick={() => {
                setSelectedOptionIndex(index);
                // 🌓 Si hay una acción (como cambiar tema), se ejecúta
                if (option.action) {
                  option.action(); // cambia tema aquí
                }
                // 🌐 Si la opción tiene  isLanguage:true, se ejecuta
                if (info.isLanguage && option.value) {
                  changeLanguage(option.value);
                }
              }}
              className={
                  (option.value && currentLang === option.value) ||
                    selectedOptionIndex === index
                  ? "option-selected-setting"
                  : ""
              }
            >
              {option.icon === "none" ? (
                <IonLabel className="texto-quinto">{option.label}</IonLabel>
              ) : (
                <IonButton
                  className="button-options"
                  fill="clear"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IonIcon
                    className="setting-icons iconos-oscuros"
                    icon={option.icon}
                  />
                  <IonLabel className="texto-quinto">{option.label}</IonLabel>
                </IonButton>
              )}
              <span className="checkmark">✔</span>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ModalOptionSetting;
