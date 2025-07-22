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
import { useTranslation } from "react-i18next";


const Setting: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();
  const router = useIonRouter();
  const { t } = useTranslation();
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
    isLanguage:false,
  });
  const openModalSetting = (settingOption: string) => {
    setIsOpenModalOptionSetting(true);
    let objectSetting: SettingObjectType = {
      initialBreakpoint: 0,
      breakpoints: 0,
      title: "",
      subtitle: "",
      options: [],
      isLanguage:false,
    };

    switch (settingOption) {
      case "tema":
        objectSetting = {
          initialBreakpoint: 0.39,
          breakpoints: 0.39,
          title: "Cambiar tema de la app",
          subtitle: "Escoge una opcion",
          options: [
            {
              icon: sunny,
              label: "Tema Claro",
              value: "",
              action: disableDarkMode,
            },
            {
              icon: moon,
              label: "Tema Oscuro",
              value: "",
              action: enableDarkMode,
            },
          ],
          isLanguage:false,
        };
        break;
      case "idioma":
        objectSetting = {
          initialBreakpoint: 0.38,
          breakpoints: 0.38,

          title: "Cambiar idioma de la app",
          subtitle: "Escoge una opcion",
          options: [
            { icon: "none", label: "Español", value: "es" },
            { icon: "none", label: "Inglés", value: "en" },
          ],
          isLanguage:true,
        };
        break;
    }
    setInfo(objectSetting);
  };

  return (
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/home"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">
            Ajustes{" "}
          </IonTitle>
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
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem
            className="options"
            button
            onClick={() => openModalSetting("idioma")}
          >
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={language}
            />
            <IonLabel>Idioma</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
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
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Tu Actividad ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            Tu Actividad
          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={time}
            />
            <IonLabel>Historial</IonLabel>

            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={heart}
            />
            <IonLabel>Favoritos</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={bookmark}
            />
            <IonLabel>Guardados</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonListHeader className="ion-list-header texto-quinto">
            Soporte
          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={helpCircleOutline}
            />
            <IonLabel>Ayuda y soporte</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonListHeader className="ion-list-header texto-quinto">
            Legal

          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={server}
            />
            <IonLabel>Política de Privacidad</IonLabel>

            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={documentText}
            />
            <IonLabel>Términos y Condiciones</IonLabel>

            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button routerLink="/info-app">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={informationCircleOutline}
            />
            <IonLabel>Informacion de la app</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonListHeader className="ion-list-header texto-quinto">
            Cuenta
          </IonListHeader>
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
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button onClick={handleLogout}>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={logOutOutline}
            />
            <IonLabel>{t("logout")}</IonLabel>
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
