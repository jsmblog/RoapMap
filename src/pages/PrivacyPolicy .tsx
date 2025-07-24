import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import '../styles/PolicyAndTerms.css'
import {Policy} from '../other/PolicyAndTermsObject'

const PrivacyPolicy: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle>Politicas de Privacidad</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
      <IonListHeader>
       Ultima fecha de actualización: {Policy.DateUpdated} 
       </IonListHeader>
      <IonItem>{Policy.Description} </IonItem>

       <IonListHeader>{Policy.InformationCollection.title} </IonListHeader>
       <IonLabel> {Policy.InformationCollection.subtitle} </IonLabel>
       {
          Policy.InformationCollection.list.map((item, index) => (
            <> 
            <IonLabel>{item.title}</IonLabel>
            <IonItem key={index}>
             ✔ {item.description}
            </IonItem>
          </>
          ))
       }

        <IonListHeader>{Policy.InformationUse.title} </IonListHeader>
        <IonLabel> {Policy.InformationUse.subtitle} </IonLabel>
        {
          Policy.InformationUse.list.map((item, index) => (
            <IonItem key={index}>
              ✔ {item.description}
            </IonItem>
          ))
        }

        <IonListHeader>{Policy.DataSharing.title} </IonListHeader>
        <IonLabel> {Policy.DataSharing.subtitle} </IonLabel>
        {
          Policy.DataSharing.list.map((item, index) => (
            <IonItem key={index}>
              ✔ {item.description}
            </IonItem>
          ))
        }

        <IonListHeader>{Policy.DataSecurity.title} </IonListHeader>
        <IonLabel> {Policy.DataSecurity.subtitle} </IonLabel>
        {
          Policy.DataSecurity.list.map((item, index) => (
            <IonItem key={index}>
              ✔ {item.description}
            </IonItem>
          ))
        }

        <IonListHeader>{Policy.DataRetention.title} </IonListHeader>
        <IonLabel> {Policy.DataRetention.description} </IonLabel>

        <IonListHeader>{Policy.UserRights.title} </IonListHeader>
        <IonLabel> {Policy.UserRights.subtitle} </IonLabel>
        {
          Policy.UserRights.list.map((item, index) => (
            <IonItem key={index}>
              ✔ {item.description}
            </IonItem>
          ))
        }
        <IonLabel>{Policy.UserRights.infocantac}</IonLabel>

        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;
