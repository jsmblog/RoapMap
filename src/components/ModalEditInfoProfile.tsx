import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonList,
  IonModal,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React, { useState } from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";
import { getSafeType } from "../functions/EditProfile";
import "../styles/EditProfile.css";

const ModalEditInfoProfile: React.FC<ModalEditInfoProfileProps> = ({
  isOpen,
  onClose,
  info,
}) => {
  console.log("ModalEditInfoProfile", info);
  const [InfoUser,setInfoUser] = useState("");
  console.log("Datos por enviar", InfoUser);

  const handleSave = (e: CustomEvent) => {
   const { value } = e.detail;
   setInfoUser(value);
  }
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
        <IonToolbar className="modal-edit-profile-toolbar" >
          <IonButtons slot="start">
            <IonBackButton defaultHref="/edit-profile" icon={chevronBack} />
          </IonButtons>
          <IonTitle className="ion-title">{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} >
        <div className="modal-edit-profile-content animacion-slide-top">
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
                onChange={() => handleSave}
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
            <>
            <IonSearchbar
            className="IonSearchbar"
            placeholder={info.placeholder}
            ></IonSearchbar>
            <IonList className="ion-list-ubicion">
               <p>Calceta</p>
               <p>chone</p>
               <p>Canuto</p>
            </IonList>
            </>
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
            <IonButton className="save btn-edit-profile">Guardar</IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditInfoProfile;
