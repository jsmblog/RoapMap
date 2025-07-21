import {
  IonAvatar,
  IonBackButton,
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
  IonAlert,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import "../styles/EditProfile.css";
import { useAuthContext } from "../context/UserContext";
import {
  cameraReverse,
  chevronBack,
  chevronForwardOutline,
} from "ionicons/icons";
import ModalEditInfoProfile from "../components/ModalEditInfoProfile";
import { EditingObjectType } from "../Interfaces/iUser";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import convertToWebP from "../functions/convertToWebP";
import { generateUUID } from "../functions/uuid";
import { db, STORAGE } from "../Firebase/initializeApp";
import { useToast } from "../hooks/UseToast";

const EditProfile: React.FC = () => {
  const { currentUserData, locationDetails } = useAuthContext();
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
    name: "",
  });
  const [profileURL, setProfileURL] = useState<string>(
    currentUserData.photo
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewURL, setPreviewURL] = useState<string>("");
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const {showToast,ToastComponent} = useToast();
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    let blob: Blob = file;
    if (file.type.startsWith("image/")) {
      const webp = await convertToWebP(file);
      if (!webp) {
        alert("Error al procesar la imagen");
        return;
      }
      blob = webp;
    }

    const url = URL.createObjectURL(blob);
    setPreviewURL(url);
    setPreviewBlob(blob);
    setShowConfirmAlert(true);
  };

  const handleConfirmUpload = async () => {
    if (!previewBlob) return;

    try {
      const ext = "webp";
    const path =  `posts/${currentUserData.uid}/profile_pictures/${generateUUID()}.${ext}`;
    const storageRef = ref(STORAGE, path);

    await uploadBytes(storageRef, previewBlob);
    const fileURL = await getDownloadURL(storageRef);

    const userDoc = doc(db, "USERS", currentUserData.uid);
    await setDoc(userDoc, { pt: fileURL }, { merge: true });
    showToast("Foto de perfil actualizada correctamente", 3000,"success");
  } catch (error) {
    console.log(error);
    showToast("Error al actualizar la foto de perfil", 3000,"danger");
  }finally {
    setProfileURL('');
    setPreviewURL("");
    setPreviewBlob(null);
    setShowConfirmAlert(false);
  }
  };

  const handleCancelUpload = () => {
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL("");
    setPreviewBlob(null);
    setShowConfirmAlert(false);
  };

  const fieldConfigMap: Record<string, Partial<EditingObjectType>> = {
    name: {
      initialBreakpoint: 0.5,
      breakpoints: 0.5,
      title: "Editar nombre y apellido",
      label: "Nombre",
      label2: "Apellido",
      placeholder: "Ingresa tu nombre",
      placeholder2: "Ingresa tu apellido",
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
    const base: EditingObjectType = {
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
    setInfo({ ...base, ...config });
  };

  return ( 
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="edit-profile-toolbar tema-oscuro ">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab/home" className="iconos-oscuros" icon={chevronBack} text='' />

          </IonButtons>
          <IonTitle className="ion-title texto-quinto">Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-profile-content tema-oscuro" fullscreen>
        <IonList>
        <div className="edit-profile-info-container tema-oscuro">
          <div className="edit-profile-avatar-wrapper tema-oscuro">
            <IonAvatar className="edit-profile-avatar">
              <IonImg src={previewURL ? previewURL : currentUserData.photo ? currentUserData.photo : "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="Avatar" />
              <IonIcon
                className="edit-profile-camera-icon"
                icon={cameraReverse}
                onClick={handleCameraClick}
              />
            </IonAvatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <IonAlert
            isOpen={showConfirmAlert}
            header="Confirmación"
            message="¿Deseas modificar tu perfil con esta imagen?"
            buttons={[
              {
                text: "No",
                role: "cancel",
                handler: handleCancelUpload,
              },
              {
                text: "Sí",
                handler: handleConfirmUpload,
              },
            ]}
          />

          <IonItem
            className="edit-profile-item tema-oscuro"
            button
            onClick={() => openModalEditProfile("name")}
          >
            <IonLabel className="ion-label" slot="start">
              Nombre
            </IonLabel>
            <span className="texto-secundario">{currentUserData.name}</span>
            <IonIcon
              className="chevron-icon iconos-oscuros"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item tema-oscuro" 
            button
            onClick={() => openModalEditProfile("gender")}
          >
            <IonLabel className="ion-label" slot="start">
              Género
            </IonLabel>
            <span className="texto-secundario">{currentUserData.gender}</span>
            <IonIcon
              className="chevron-icon iconos-oscuros"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item tema-oscuro"
            button
            onClick={() => openModalEditProfile("birthdate")}
          >
            <IonLabel className="ion-label" slot="start">
              Fecha de Nacimiento
            </IonLabel>
            <span className="texto-secundario">{currentUserData.birth.split("T")[0]}</span>
            <IonIcon
              className="chevron-icon iconos-oscuros"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item tema-oscuro"
            button
            onClick={() => openModalEditProfile("description")}
          >
            <IonLabel className="ion-label" slot="start">
              Descripción
            </IonLabel>
            <div className="description-value texto-secundario">
              <span className="description-label">
                {currentUserData.description.replace(/\*/g, "")}
              </span>
            </div>
            <IonIcon
              className="chevron-icon iconos-oscuros"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem
            className="edit-profile-item tema-oscuro"
            button
            onClick={() => openModalEditProfile("password")}
          >
            <IonLabel className="ion-label" slot="start">
              Contraseña
            </IonLabel>
            <span className="texto-secundario">********</span>
            <IonIcon
              className="chevron-icon iconos-oscuros"
              slot="end"
              icon={chevronForwardOutline}
            />
          </IonItem>

          <IonItem className="edit-profile-item tema-oscuro">
            <IonLabel className="ion-label" slot="start">
              Ubicación
            </IonLabel>
            <span className="texto-secundario">
              {locationDetails
                ? `${locationDetails.city}, ${locationDetails.state}, ${locationDetails.country}`
                : "Cargando ubicación"}
            </span>
          </IonItem>
        </div>

          <ModalEditInfoProfile
            isOpen={isModalOpenEditProfile}
            onClose={() => setIsModalOpenEditProfile(false)}
            info={info}
            setInfo={setInfo}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
