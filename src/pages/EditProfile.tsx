import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState } from "react";
import "../styles/EditProfile.css";
import { useAuthContext } from "../context/UserContext";
import {
  cameraReverse,
  chevronBack,
  chevronForwardOutline,
} from "ionicons/icons";
import { UseOpenWeather } from "../hooks/UseOpenWeather";
import ModalEditInfoProfile from "../components/ModalEditInfoProfile";
import { EditingObjectType } from "../Interfaces/iUser";

const EditProfile: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const { weather } = UseOpenWeather();
  const [isModalOpenEditProfile, setIsModalOpenEditProfile] = useState(false);
  const [info, setInfo] = useState<EditingObjectType>({
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
    isRequired: true,
  });

  const openModalEditProfile = (editingField: string) => {
    setIsModalOpenEditProfile(true);
    let objectEditing: EditingObjectType = {
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
      isRequired: true,
    };

    switch (editingField) {
      case "name":
        objectEditing = {
          initialBreakpoint: 0.5,
          breakpoints: 0.5,
          title: "Editar Nombre ",
          label: "Nombre",
          label2: "Apellido",
          placeholder: "Ingresa tu nombre",
          placeholder2: "Ingresa tu aplliddo",
          type: "text",
          result1: "",
          result2: "",
          isRequired: true,
        };
        break;
      case "gender":
        objectEditing = {
          initialBreakpoint: 0.3,
          breakpoints: 0.3,
          title: "Editar Género",
          label: "Género",
          placeholder: "Selecciona tu género",
          placeholder2: "",
          type: "select",
          result1: "",
          options: [
            { label: "Masculino", value: "male" },
            { label: "Femenino", value: "female" },
            { label: "No Binario", value: "Not Binario" },
            { label: "LBGTQ+", value: "LBGTQ+" },
            { label: "Prefiero no decirlo", value: "Prefer not to say" },
          ],
          isRequired: true,
        };
        break;
      case "birthdate":
        objectEditing = {
          initialBreakpoint: 0.72,
          breakpoints: 0.72,
          title: "Editar Fecha de Nacimiento",
          label: "",
          placeholder: "",
          placeholder2: "",
          type: "date",
          result1: "",
          isRequired: true,
        };
        break;
      case "location":
        objectEditing = {
          initialBreakpoint: 0.5,
          breakpoints: 0.5,
          title: "Editar Ubicación",
          label: "Ubicación",
          placeholder: "Ingresa tu ubicación",
          placeholder2: "",
          type: "search",
          result1: "",
          isRequired: true,
        };
        break;
      case "description":
        objectEditing = {
          initialBreakpoint: 0.5,
          breakpoints: 0.5,
          title: "Editar Descripción",
          label: "Descripción",
          placeholder: "Ingresa una breve descripción",
          placeholder2: "",
          type: "textarea",
          result1: "",
          isRequired: true,
        };
        break;
      case "password":
        objectEditing = {
          initialBreakpoint: 0.5,
          breakpoints: 0.5,
          title: "Editar Contraseña",
          label: "Nueva Contraseña",
          label2: "Confirmar Contraseña",
          placeholder: "Ingresa tu nueva contraseña",
          placeholder2: "Confirmar Contraseña",
          type: "password",
          result1: "",
          result2: "",
          isRequired: true,
        };
        break;
    }
    setInfo(objectEditing);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="edit-profile-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab/home" icon={chevronBack} />
          </IonButtons>
          <IonTitle className="ion-title">Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-profile-content" fullscreen>
        <div className="edit-profile-info-container">
          <div className="edit-profile-avatar-wrapper">
            <IonAvatar className="edit-profile-avatar">
              <IonImg
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                alt="Avatar"
              />
              <IonIcon
                className="edit-profile-camera-icon"
                icon={cameraReverse}
              />
            </IonAvatar>
          </div>

          <IonItem className="edit-profile-item ">
            <IonLabel className="ion-label" slot="start">
              Nombre
            </IonLabel>
            <span>{currentUserData?.name}</span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("name")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Género
            </IonLabel>
            <span>Ninguno</span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("gender")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Fecha de Nacimiento
            </IonLabel>
            <span>01/01/2000</span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("birthdate")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Ubicación{" "}
            </IonLabel>
            <span>
              {weather?.name}, {weather?.sys.country}
            </span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("location")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Descripción
            </IonLabel>
            <div className="description-value">
              <span className="description-label">
                {currentUserData?.description?.replace(/\*/g, "")}
              </span>
            </div>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("description")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Contraseña
            </IonLabel>
            <span>********</span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("password")}
            >
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </IonItem>
        </div>

        <ModalEditInfoProfile
          isOpen={isModalOpenEditProfile}
          onClose={() => setIsModalOpenEditProfile(false)}
          info={info}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
