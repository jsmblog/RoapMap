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
  options,
} from "ionicons/icons";
import { UseOpenWeather } from "../hooks/UseOpenWeather";
import ModalEditInfoProfile from "../components/ModalEditInfoProfile";
import { EditingObjectType } from "../Interfaces/iUser";

const EditProfile: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const { weather } = UseOpenWeather();
  const [isModalOpenEditProfile, setIsModalOpenEditProfile] = useState(false);
 const [info,setInfo] = useState<EditingObjectType>({
    title: "",
    label: "",
    placeholder: "",
    type: "",
    result1: "",
    result2: "",
    options: [],
    isRequired: true,
    icon: "",
  });

  const openModalEditProfile = (editingField: string) => {
    setIsModalOpenEditProfile(true);
    let objectEditing: EditingObjectType = {
      title: "",
      label:"",
      placeholder: "",
      type: "",
      result1: "",
      result2: "",
      options: [],
      isRequired: true,
      icon:"",
    };

    switch(editingField) {
      case "name":
        objectEditing = {
          title: "Editar Nombre",
          label: "Nombre",
          placeholder: "Ingresa tu nombre",
          type: "text",
          isRequired: true,
          icon: options,
        };
        break;
        case "gender":
          objectEditing = {
            title: "Editar Género",
            label: "Género",
            placeholder: "Selecciona tu género",
            type: "select",
            options: [
              { label: "Masculino", value: "male" },
              { label: "Femenino", value: "female" },
              { label: "No Binario", value: "Not Binario" },
              { label: "LBGTQ+", value: "LBGTQ+" },
              { label: "Prefiero no decirlo", value: "Prefer not to say" },
            ],
            isRequired: true,
            icon: options,
          };
          break;
        case "birthdate":
          objectEditing = {
            title: "Editar Fecha de Nacimiento",
            label: "Fecha de Nacimiento",
            placeholder: "Ingresa tu fecha de nacimiento",
            type: "date",
            isRequired: true,
            icon: options,
          };
          break;
        case "location":
          objectEditing = {
            title: "Editar Ubicación",
            label: "Ubicación",
            placeholder: "Ingresa tu ubicación",
            type: "text",
            isRequired: true,
            icon: options,
          };
          break;
        case "description":
          objectEditing = {
            title: "Editar Descripción",
            label: "Descripción",
            placeholder: "Ingresa una breve descripción",
            type: "textarea",
            isRequired: true,
            icon: options,
          };
          break;
        case "password":
          objectEditing = {
            title: "Editar Contraseña",
            label: "Contraseña",
            placeholder: "Ingresa tu nueva contraseña",
            type: "password",
            result1: "Nueva Contraseña",
            result2: "Confirmar Contraseña",
            isRequired: true,
            icon: options,
          };
          break;
      }
      setInfo(objectEditing);
    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="edit-profile-header">
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

          <IonItem className="edit-profile-item">
            <IonLabel className="ion-label" slot="start">
              Nombre
            </IonLabel>
            <span>{currentUserData?.name}</span>
            <IonButton
              className="chevron-icon"
              slot="end"
              expand="block"
              fill="clear"
              onClick={() => openModalEditProfile("name")}>
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
