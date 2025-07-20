import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { InfoApp, creditos } from "../other/InfoAppObject";
import { chevronBack, documentText } from "ionicons/icons";
import "../styles/InformationApp.css"
const InformationApp: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/home"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle>Informacion de la App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/*informacion de la app */}
        <IonCard>
          <IonImg src={InfoApp.info.logo} />
          <IonHeader>
            <IonCardTitle>{InfoApp.info.name} </IonCardTitle>
          </IonHeader>
          <IonCardContent>
            <IonCardSubtitle>Descripción</IonCardSubtitle>
            <p>{InfoApp.info.AcercaDelProyecto}</p>
            <IonCardSubtitle>Versión</IonCardSubtitle>
            <p>{InfoApp.info.version} </p>
          </IonCardContent>
        </IonCard>
        {/*creditos */}
        <IonCardSubtitle>Desarroladores</IonCardSubtitle>
        <IonGrid>
          <IonRow>
            {creditos.map((devs, index) => (
              <IonCol key={index}>
                <IonCard>
                  <IonImg src={devs.photo} />
                  <IonCardHeader>
                    <IonCardTitle>{devs.name} </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonCardSubtitle>Área </IonCardSubtitle>
                    <p>{devs.desarrollo} </p>
                    <IonCardSubtitle>Portafólio</IonCardSubtitle>
                    <a
                      href={devs.portafolio}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {devs.portafolio}{" "}
                    </a>
                    <IonCardSubtitle>Contacto</IonCardSubtitle>
                    <IonItem lines="none">
                      <a
                        href={devs.contacto.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IonIcon icon={devs.contacto.linkedin.icon} />
                      </a>
                      <a
                        href={devs.contacto.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IonIcon icon={devs.contacto.github.icon} />
                      </a>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        {/*licencia */}
        <IonItem>
          <IonIcon icon={documentText} />
          <IonLabel>{InfoApp.licencia.title} </IonLabel>
          <p>{InfoApp.licencia.description} </p>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default InformationApp;
