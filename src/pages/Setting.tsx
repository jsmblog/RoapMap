import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  bookmark,
  chevronBack,
  chevronForward,
  colorPalette,
  documentText,
  happyOutline,
  heart,
  helpCircleOutline,
  language,
  logOutOutline,
  notifications,
  personCircleOutline,
  server,
  time,
  sunny,
  moon,
  informationCircleOutline,
} from "ionicons/icons";
import React, { useState } from "react";
import "../styles/Setting.css";
import ModalOptionSetting from "../components/ModalOptionSetting";
import { SettingObjectType } from "../Interfaces/iProps";
import ModalProfile from "../components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import { useDarkMode } from "../context/DarkModeContext";


const Setting: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const router = useIonRouter();

  const { enableDarkMode, disableDarkMode } = useDarkMode();

  const handleLogout = async () => {
    showLoading("Cerrando sesión...");
    try {
      await signOut(AUTH_USER);
      await hideLoading();
      router.push("/", "root");
    } catch {
      await hideLoading();
    }
  };
  const [isOpneModalProfile, setIsOpenModalProfile] = useState(false);
  const [isOpenModalOptionSetting, setIsOpenModalOptionSetting] =
    useState(false);
  const [info, setInfo] = useState<SettingObjectType>({
    initialBreakpoint: 0,
    breakpoints: 0,
    title: "",
    subtitle: "",
    options: [],
    result1: "",
    funct: ""
  });
  const openModalSetting = (settingOption: string) => {
    setIsOpenModalOptionSetting(true);
    let objectSetting: SettingObjectType = {
      initialBreakpoint: 0,
      breakpoints: 0,
      title: "",
      subtitle: "",
      options: [],
      result1: "",
      funct: ""
    };

    switch (settingOption) {
      case "tema":
        objectSetting = {
          initialBreakpoint: 0.39,
          breakpoints: 0.39,
          title: "Cambiar tema de la app",
          subtitle: "Escoge una opcion",
          options: [
            { icon: sunny, label: "Tema Claro", value: "" , action: disableDarkMode},
            { icon: moon, label: "Tema Oscuro", value: "" , action: enableDarkMode },
          ],
          result1: "",
          funct:""
        };
        break;
      case "idioma":
        objectSetting = {
          initialBreakpoint: 0.46,
          breakpoints: 0.46,
          title: "Cambiar idioma de la app",
          subtitle: "Escoge una opcion",
          options: [
            { icon: "none", label: "Español", value: "Español" },
            { icon: "none", label: "Ingles", value: "Ingles" },
            {
              icon: "none",
              label: "Idioma del  dispositivo",
              value: "Idioma del  dispositivo",
            },
          ],
          result1: "",
          funct:""
        };
        break;
      case "calificacnos":
        objectSetting = {
          initialBreakpoint: 0.64,
          breakpoints: 0.64,
          title: "Enviar mi opinión",
          subtitle:
            "Escoge la carita que te haga sentir sastifescho con nuestra app",
          options: [
            { icon: "none", label: "😄 Excelente", value: "Excelente" },
            { icon: "none", label: "😊 Buena", value: "Buena" },
            { icon: "none", label: "😐 Nuetro", value: "Nuetro" },
            { icon: "none", label: "☹️ Mala", value: "Mala" },
            { icon: "none", label: "😠 Muy mala", value: "Muy mala" },
          ],
          result1: "",
          funct:""
        };
        break;
      case "info":
        objectSetting = {
          initialBreakpoint: 0.80,
          breakpoints: 0.80,
          title: "Información de la app",
          subtitle: "",
          options: [],
          result1:"",
          funct:""
        }
    }
    setInfo(objectSetting);
  };

  return (
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab/home" className="iconos-oscuros" icon={chevronBack} />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">Ajustes </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="setting-content" fullscreen>
        <IonList className="setting-options tema-oscuro2">
          {/* ---- Preferencias ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            Preferencias
          </IonListHeader>
          <IonItem
            className="options "
            button
            onClick={() => openModalSetting("tema")}
          >
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={colorPalette}
            />
            <IonLabel>Tema del sistema</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem
            className="options"
            button
            onClick={() => openModalSetting("idioma")}
          >
            <IonIcon className="setting-icons iconos-oscuros" slot="start" icon={language} />
            <IonLabel>Idioma</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Notificaciones ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            Notificaciones
          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={notifications}
            />
            <IonLabel>Notificaciones</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Tu Actividad ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            Tu Actividad
          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons iconos-oscuros" slot="start" icon={time} />
            <IonLabel>Historial</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons iconos-oscuros" slot="start" icon={heart} />
            <IonLabel>Favoritos</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons iconos-oscuros" slot="start" icon={bookmark} />
            <IonLabel>Guardados</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Soporte ---- */}
          <IonListHeader className="ion-list-header texto-quinto">Soporte</IonListHeader>
          <IonItem
            className="options"
            button
            onClick={() => openModalSetting("calificacnos")}
          >
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={happyOutline}
            />
            <IonLabel>Envianos tu opinión</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={helpCircleOutline}
            />
            <IonLabel>Ayuda y soporte</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Legal ---- */}
          <IonListHeader className="ion-list-header texto-quinto">Legal</IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons iconos-oscuros" slot="start" icon={server} />
            <IonLabel>Política de Privacidad</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={documentText}
            />
            <IonLabel>Términos y Condiciones</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem 
          className="options" 
          button
          onClick={() => openModalSetting("info")}
          >
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={informationCircleOutline}
            />
            <IonLabel>Informacion de la app</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          {/* ---- Cuenta ---- */}
          <IonListHeader className="ion-list-header texto-quinto">Cuenta</IonListHeader>
          <IonItem
            className="options"
            button
            onClick={() => setIsOpenModalProfile(true)}
          >
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={personCircleOutline}
            />
            <IonLabel>Infomacion del pefil</IonLabel>
            <IonIcon className="setting-icons iconos-oscuros" slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem 
          className="options" 
          button
          onClick={handleLogout}>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={logOutOutline}
            />
            <IonLabel>Cerrar sesión</IonLabel>
          </IonItem>
        </IonList>

        <ModalProfile
          isOpen={isOpneModalProfile}
          onClose={() => setIsOpenModalProfile(false)}
        />
        <ModalOptionSetting
          isOpen={isOpenModalOptionSetting}
          onClose={() => setIsOpenModalOptionSetting(false)}
          info={info}
          setInfo={setInfo}
        />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
