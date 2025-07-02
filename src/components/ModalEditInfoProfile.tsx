import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";
import { getSafeType } from "../functions/EditProfile";
import "../styles/EditProfile.css";

const ModalEditInfoProfile: React.FC<ModalEditInfoProfileProps> = ({
  isOpen,
  onClose,
  info,
}) => {
  console.log("ModalEditInfoProfile", info);
  return (
    <IonModal
      className="modal-edit-profile"
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      initialBreakpoint={info.initialBreakpoint}
      breakpoints={[0, info.breakpoints]}
      handleBehavior="none"
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/edit-profile" icon={chevronBack} />
          </IonButtons>
          <IonTitle >{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} >
        <div className="modal-edit-profile-content">
          {info.type === "text" || info.type === "password" ? (
            <>
              <IonInput
                className="IonInput"
                labelPlacement="floating"
                fill="outline"
                type={getSafeType(info.type)}
                label={info.label}
                placeholder={info.placeholder}
                value={info.result1}
                required={info.isRequired}
              />
              <IonInput
              className="IonInput"
                labelPlacement="floating"
                fill="outline" 
                type={getSafeType(info.type)}
                label={info.label2}
                placeholder={info.placeholder2}
                value={info.result2}
                required={info.isRequired}
              />
            </>
          ):null}
          {info.type === "date" ? (
            <IonDatetime 
              presentation="date"
              className="custom-datetime"
              >
              </IonDatetime>
          ):null}
          {info.type === "search" ? (
            <IonSearchbar
            className="IonSearchbar"
            ></IonSearchbar>
          ):null}
          {info.type === "select" ? (
            <IonSelect
            className="IonSelect"
            placeholder={info.placeholder}
            required={info.isRequired}
            >
              {info.options?.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          ):null}
          {info.type === "textarea" ? (
            <IonTextarea
            className="IonTextarea"
              placeholder={info.placeholder}
              required={info.isRequired}
            />
          ):null}
          <div className="modal-edit-profile-buttons">
            <IonButton className="cancel">Cancelar</IonButton>
            <IonButton className="save">Guardar</IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditInfoProfile;
