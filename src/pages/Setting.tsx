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
  megaphone,
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
      router.push("/");
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
    isLanguage: false,
  });
  const openModalSetting = (settingOption: string) => {
    setIsOpenModalOptionSetting(true);
    let objectSetting: SettingObjectType = {
      initialBreakpoint: 0,
      breakpoints: 0,
      title: "",
      subtitle: "",
      options: [],
      isLanguage: false,
    };

    switch (settingOption) {
      case "tema":
        objectSetting = {
          initialBreakpoint: 0.39,
          breakpoints: 0.39,
          title: t("changeAppTheme"),
          subtitle: t("chooseOption"),
          options: [
            {
              icon: sunny,
              label: t("lightTheme"),
              value: "",
              action: disableDarkMode,
            },
            {
              icon: moon,
              label: t("darkTheme"),
              value: "",
              action: enableDarkMode,
            },
          ],
          isLanguage: false,
        };
        break;
      case "idioma":
        objectSetting = {
          initialBreakpoint: 0.38,
          breakpoints: 0.38,
          title: t("changeLanguage"),
          subtitle: t("chooseOption"),
          options: [
            { icon: "none", label: "Español", value: "es" },
            { icon: "none", label: "English", value: "en" },
          ],
          isLanguage: true,
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
            {t("settings")}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="setting-content" fullscreen>
        <IonList className="setting-options tema-oscuro2">
          {/* ---- Preferencias ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("preferences")}
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
            <IonLabel>{t("systemTheme")}</IonLabel>
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
            <IonLabel>{t("language")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Notificaciones ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("notifications")}
          </IonListHeader>
          <IonItem className="options" button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={notifications}
            />
            <IonLabel>{t("notifications")}</IonLabel>
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
              icon={megaphone}
            />
            <IonLabel>{t("notificationsPush")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Tu Actividad ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("yourActivity")}
          </IonListHeader>
          <IonItem className="options" button routerLink="/tab/history">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={time}
            />
            <IonLabel>{t("history")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button routerLink="/tab/favorite">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={heart}
            />
            <IonLabel>{t("favorites")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button routerLink="/tab/saved">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={bookmark}
            />
            <IonLabel>{t("saved")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Soporte ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("support")}
          </IonListHeader>
          <IonItem className="options" button routerLink="/soporte">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={helpCircleOutline}
            />
            <IonLabel>{t("helpSupport")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Legal ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("legal")}
          </IonListHeader>
          <IonItem className="options" button routerLink="/privacy-policy">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={server}
            />
            <IonLabel>{t("privacyPolicy")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
          <IonItem className="options" button routerLink="/terms">
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={documentText}
            />
            <IonLabel>{t("termsConditions")}</IonLabel>
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
            <IonLabel>{t("appInfo")}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>

          {/* ---- Tu cuenta ---- */}
          <IonListHeader className="ion-list-header texto-quinto">
            {t("account")}
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
            <IonLabel>{t("profileInfo")}</IonLabel>
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
        />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
