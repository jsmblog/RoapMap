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
  IonList,
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
import ModalEditInfoProfile from "../components/ModalEditInfoProfile";
import { EditingObjectType } from "../Interfaces/iUser";
import { useDarkMode } from "../context/DarkModeContext";

const EditProfile: React.FC = () => {
const { currentUserData, locationDetails } = useAuthContext();
const [isModalOpenEditProfile, setIsModalOpenEditProfile] = useState(false);
const { toggleDarkMode } = useDarkMode()
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
  name: "",
});

const fieldConfigMap: Record<string, Partial<EditingObjectType>> = {
  name: {
    initialBreakpoint: 0.5,
    breakpoints: 0.5,
    title: "Editar nombre y apellido",
    label: "Nombre",
    label2: "Apellido",
    placeholder: "Ingresa tu nombre",
    placeholder2: "Ingresa tu aplliddo",
    type: "text",
    name: "n",
  },
  gender: {
    initialBreakpoint: 0.35,
    breakpoints: 0.35,
    title: "Editar género",
    label: "Género",
    placeholder: "Selecciona tu género",
    type: "select",
    options: [
      { label: "Masculino", value: "Masculino" },
      { label: "Femenino", value: "Femenino" },
      { label: "No Binario", value: "No Binario" },
      { label: "LBGTQ+", value: "LBGTQ+" },
      { label: "Prefiero no decirlo", value: "Prefiero no decirlo" },
    ],
    name: "g",
  },
  birthdate: {
    initialBreakpoint: 0.76,
    breakpoints: 0.76,
    title: "Editar fecha de nacimiento",
    type: "date",
    name: "b",
  },
  description: {
    initialBreakpoint: 0.55,
    breakpoints: 0.55,
    title: "Editar descripción",
    label: "Descripción",
    placeholder: "Ingresa una breve descripción",
    type: "textarea",
    name: "d",
  },
  password: {
    initialBreakpoint: 0.5,
    breakpoints: 0.5,
    title: "Editar contraseña",
    label: "Nueva contraseña",
    label2: "Confirmar contraseña",
    placeholder: "Ingresa tu nueva contraseña",
    placeholder2: "Confirma tu nueva contraseña",
    type: "password",
    name: "pass",
  },
};

const openModalEditProfile = (editingField: string) => {
  setIsModalOpenEditProfile(true);
  const baseObject: EditingObjectType = {
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
  };

  const config = fieldConfigMap[editingField] || {};
  const merged = { ...baseObject, ...config };

  setInfo(merged);
};

  return (
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="edit-profile-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab/home" icon={chevronBack} />
          </IonButtons>
          <IonTitle className="ion-title">Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-profile-content" fullscreen>
        <IonList className="edit-profile-info-container">
          <div className="edit-profile-avatar-wrapper">
            <IonAvatar className="edit-profile-avatar">
              <IonImg
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                alt="Avatar"
              />
              <IonIcon
                onClick={toggleDarkMode}
                className="edit-profile-camera-icon"
                icon={cameraReverse}
              />
            </IonAvatar>
          </div>

          <IonItem
            className="edit-profile-item"
            button
            onClick={() => openModalEditProfile("name")}
          >
            <IonLabel className="ion-label" slot="start">
              Nombre
            </IonLabel>
            <span>{currentUserData.name}</span>
            <IonIcon
              className="chevron-icon"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item"
            button
            onClick={() => openModalEditProfile("gender")}
          >
            <IonLabel className="ion-label" slot="start">
              Género
            </IonLabel>
            <span>{currentUserData.gender}</span>
            <IonIcon
              className="chevron-icon"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item"
            button
            onClick={() => openModalEditProfile("birthdate")}
          >
            <IonLabel className="ion-label" slot="start">
              Fecha de Nacimiento
            </IonLabel>
            <span>{currentUserData.birth.split("T")[0]}</span>
            <IonIcon
              className="chevron-icon"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item"
            button
            onClick={() => openModalEditProfile("description")}
          >
            <IonLabel className="ion-label" slot="start">
              Descripción
            </IonLabel>
            <div className="description-value">
              <span className="description-label">
                {currentUserData.description.replace(/\*/g, "")}
              </span>
            </div>
            <IonIcon
              className="chevron-icon"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item"
            button
            onClick={() => openModalEditProfile("password")}
          >
            <IonLabel className="ion-label" slot="start">
              Contraseña
            </IonLabel>
            <span>********</span>
            <IonIcon
              className="chevron-icon"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Ubicación
            </IonLabel>
            <span>
              {locationDetails
                ? `${locationDetails.city}, ${locationDetails.state}, ${locationDetails.country}`
                : "Cargando ubicación"}
            </span>
          </IonItem>
        </IonList>

        <ModalEditInfoProfile
          isOpen={isModalOpenEditProfile}
          onClose={() => setIsModalOpenEditProfile(false)}
          info={info}
          setInfo={setInfo}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
