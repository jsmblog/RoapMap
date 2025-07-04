import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
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
import React from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";
import { getSafeType } from "../functions/EditProfile";
import "../styles/EditProfile.css";
import { doc, setDoc } from "firebase/firestore";
import { AUTH_USER, db } from "../Firebase/initializeApp";
import { useAuthContext } from "../context/UserContext";
import { useToast } from "../hooks/UseToast";
import { updatePassword } from "firebase/auth";

const ModalEditInfoProfile: React.FC<ModalEditInfoProfileProps> = ({
  isOpen,
  onClose,
  info,
  setInfo
}) => {
  const {currentUserData} = useAuthContext();
  const {ToastComponent,showToast} = useToast();

const handleSave = (field: "result1" | "result2") => (e: CustomEvent) => {
  const { value } = e.detail;
  setInfo((prev) => ({
    ...prev,
    [field]: value
  }));
};

const upInfoUser = async () => {
    try {
      const { name: field, result1, result2 } = info;
      let value = result1 || "";

      if (field === "pass" && AUTH_USER.currentUser) {
        if (value !== result2) {
          showToast("Las contraseñas no coinciden", 4000, "danger");
          return;
        }
          await updatePassword(AUTH_USER.currentUser, value);
          showToast("Contraseña actualizada", 4000, "success");
          return;
        }

      if (field === "n") {
        if(!result2){
          return showToast('Añade tu apellido',3000,'danger')
        }
        value = `${value} ${result2}`;
      }

      const refDocUser = doc(db, "USERS", currentUserData?.uid);
      await setDoc(refDocUser, { [field]: value }, { merge: true });
      showToast("Campo actualizado con éxito", 4000, "success");
    } catch (error) {
      console.error(error);
      showToast("Error al intentar actualizar", 4000, "danger");
    }
  };
  const handleCancel = ()=>{
     setInfo((prev) => ({
      ...prev,
      result1:'',
      result2:''
     }))
     onClose();
  }

  console.log(info)
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
          <IonButtons className="ion-buttons-modal-edit-profile" slot="start" onClick={onClose} >
             <IonIcon 
             className="chevron-icon"
             icon={chevronBack}/>
          </IonButtons>
          <IonTitle className="ion-title">{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true} >
        {ToastComponent}
        <form className="modal-edit-profile-content animacion-slide-top">
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
                required={true}
                onIonInput={handleSave('result1')}
              />
              <IonInput
              className="IonInput"
                labelPlacement="floating"
                fill="outline" 
                type={getSafeType(info.type)}
                label={info.label2}
                placeholder={info.placeholder2}
                value={info.result2}
                required={true}
                onIonInput={handleSave('result2')}
              />
            </>
          ):null}
          {info.type === "date" ? (
            <IonDatetime 
              presentation="date"
              className="custom-datetime"
              onIonChange={handleSave('result1')}
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
            required={true}
            onIonChange={handleSave('result1')}
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
              required={true}
              onIonChange={handleSave('result1')}
            />
          ):null}
          <div className="modal-edit-profile-buttons">
            <IonButton onClick={handleCancel} className="cancel">Cancelar</IonButton>
            <IonButton disabled={!info.result1} onClick={upInfoUser} className="save btn-edit-profile">Guardar</IonButton>
          </div>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default ModalEditInfoProfile;
