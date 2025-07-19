import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import React from "react";
import { ModalEditInfoProfileProps } from "../Interfaces/iProps";
import { getSafeType } from "../functions/EditProfile";
import "../styles/EditProfile.css";
import { doc, setDoc } from "firebase/firestore";
import { AUTH_USER, db } from "../Firebase/initializeApp";
import { useAuthContext } from "../context/UserContext";
import { useToast } from "../hooks/UseToast";
import { updatePassword } from "firebase/auth";
import { useAchievements } from "../hooks/UseAchievements";

const ModalEditInfoProfile: React.FC<ModalEditInfoProfileProps> = ({
  isOpen,
  onClose,
  info,
  setInfo,
}) => {
  const { currentUserData } = useAuthContext();
  const { unlockAchievement,AchievementPopup, isAchievementUnlocked } = useAchievements();

  const { ToastComponent, showToast } = useToast();

  const handleSave = (field: "result1" | "result2") => (e: CustomEvent) => {
    const { value } = e.detail;
    setInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const upInfoUser = async () => {
    try {
      if (!isAchievementUnlocked("first_change")) {
        unlockAchievement("first_change");
      }
      const { name: field, result1, result2 } = info;
      let value = result1 || "";

      if (field === "pass" && AUTH_USER.currentUser) {
        if (value !== result2) {
          showToast("Las contraseñas no coinciden", 3000, "danger");
          return;
        }
        await updatePassword(AUTH_USER.currentUser, value);
        showToast("Contraseña actualizada", 3000, "success");
        return;
      }

      if (field === "n") {
        if (!result2) {
          return showToast("Añade tu apellido", 3000, "danger");
        }
        value = `${value} ${result2}`;
      }
      
      const refDocUser = doc(db, "USERS", currentUserData.uid);
      await setDoc(refDocUser, { [field]: value }, { merge: true });
      showToast("Campo actualizado con éxito", 3000, "success");
    } catch (error) {
      console.error(error);
      showToast("Error al intentar actualizar", 3000, "danger");
    } finally {
      onClose();
      setInfo(
        {
          initialBreakpoint: 0,
          breakpoints: 0,
          title: "",
          label: "",
          label2: "",
          placeholder: "",
          placeholder2: "",
          type: "text",
          result1: "",
          result2: "",
          options: [],
          name: "",
        }
      )
    }
  };
  const handleCancel = () => {
    setInfo((prev) => ({
      ...prev,
      result1: "",
      result2: "",
    }));
    onClose();
  };
  return (
    <>
    {AchievementPopup}
    {ToastComponent}
    <IonModal
      className="modal-edit-profile"
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
            <IonIcon className="chevron-icon iconos-oscuros" icon={close} />
          </IonButtons>
          <IonTitle className="ion-title texto-quinto">{info.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <form className="modal-edit-profile-content animacion-slide-top">
          {info.type === "text" || info.type === "password" ? (
            <>
              <IonInput
                className="IonInput inputs-background"
                labelPlacement="floating"
                fill="outline"
                type={getSafeType(info.type)}
                label={info.label}
                placeholder={info.placeholder}
                value={info.result1}
                required={true}
                onIonInput={handleSave("result1")}
              />
              <IonInput
                className="IonInput inputs-background"
                labelPlacement="floating"
                fill="outline"
                type={getSafeType(info.type)}
                label={info.label2}
                placeholder={info.placeholder2}
                value={info.result2}
                required={true}
                onIonInput={handleSave("result2")}
              />
            </>
          ) : null}
          {info.type === "date" ? (
            <IonDatetime
              presentation="date"
              className="custom-datetime"
              onIonChange={handleSave("result1")}
            ></IonDatetime>
          ) : null}
          {info.type === "select" ? (
            <IonSelect
              className="IonSelect inputs-background"
              interface="popover"
              placeholder={info.placeholder}
              required={true}
              onIonChange={handleSave("result1")}
            >
              {info.options?.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          ) : null}
          {info.type === "textarea" ? (
            <>
              <IonTextarea
                className="IonTextarea inputs-background"
                placeholder={info.placeholder}
                required={true}
                maxlength={500}
                onIonInput={handleSave("result1")}
              ></IonTextarea>
              <p className="char-counter">
                {info.result1?.length} / 500 caracteres
              </p>
            </>
          ) : null}

          <div className="modal-edit-profile-buttons">
            <IonButton onClick={handleCancel} className="cancel">
              Cancelar
            </IonButton>
            <IonButton
              disabled={!info.result1}
              onClick={upInfoUser}
              className="save btn-edit-profile"
            >
              Guardar
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonModal>
    </>
  );
};

export default ModalEditInfoProfile;
