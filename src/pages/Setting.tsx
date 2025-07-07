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
} from "@ionic/react";
import {
  bookmark,
  chevronBack,
  chevronForward,
  colorPalette,
  documentText,
  heart,
  helpCircle,
  language,
  logOutOutline,
  notifications,
  star,
  time,
} from "ionicons/icons";
import React from "react";
import "../styles/Setting.css";

const Setting: React.FC = () => {
  

  return (
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab/home" icon={chevronBack} />
          </IonButtons>
          <IonTitle className="settings-ion-title">Ajustes </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="setting-content" fullscreen >
        <IonList className="setting-options " >
          {/* ---- Preferencias ---- */}
          <IonListHeader className="ion-list-header">Preferencias</IonListHeader>
          <IonItem className="options " button>
            <IonIcon className="setting-icons" slot="start" icon={colorPalette} />
            <IonLabel>Tema del sistema</IonLabel>
            <IonIcon  slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={language} />
            <IonLabel>Idioma</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Notificaciones ---- */}
          <IonListHeader className="ion-list-header">Notificaciones</IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={notifications} />
            <IonLabel>Notificaciones</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Tu Actividad ---- */}
          <IonListHeader className="ion-list-header">Tu Actividad</IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons"  slot="start" icon={time} />
            <IonLabel>Historial</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={heart} />
            <IonLabel>Favoritos</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={bookmark} />
            <IonLabel>Guardados</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Soporte ---- */}
          <IonListHeader className="ion-list-header">Soporte</IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={star} />
            <IonLabel>Califícanos</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={helpCircle} />
            <IonLabel>Ayuda y soporte</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Legal ---- */}
          <IonListHeader className="ion-list-header">Legal</IonListHeader>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={documentText} />
            <IonLabel>Política de Privacidad</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>
          <IonItem className="options" button>
            <IonIcon className="setting-icons" slot="start" icon={documentText} />
            <IonLabel>Términos y Condiciones</IonLabel>
            <IonIcon slot="end" icon={chevronForward} />
          </IonItem>

          {/* ---- Cuenta ---- */}
          <IonListHeader className="ion-list-header">Cuenta</IonListHeader>
            <IonItem className="options" button>
              <IonIcon className="setting-icons" slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Setting;
