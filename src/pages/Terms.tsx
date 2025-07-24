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
import "../styles/PolicyAndTerms.css";
import { TermsObject } from "../other/PolicyAndTermsObject";

const Terms: React.FC = () => {
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
          <IonTitle>Terminos y Condiciones</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>
            Ultima fecha de actualización: {TermsObject.DateUpdated}{" "}
          </IonListHeader>
          <IonItem>{TermsObject.Description} </IonItem>
          <IonListHeader>{TermsObject.Acceptance.title} </IonListHeader>
          <IonItem>{TermsObject.Acceptance.description} </IonItem>
          
          <IonListHeader>
            {TermsObject.PermittedUse.title}
          </IonListHeader>
            <IonLabel>{TermsObject.PermittedUse.subtitle} </IonLabel>
           {
              TermsObject.PermittedUse.list.map((permition,index)=>(
                <IonItem key={index}>
                 ✔ {permition.description}
                </IonItem>
              ))
            }
          
            <IonListHeader>{TermsObject.ProhibitedUse.title} </IonListHeader>
            <IonLabel>{TermsObject.ProhibitedUse.subtitle} </IonLabel>
            {
              TermsObject.ProhibitedUse.list.map((prohibite, index)=>(
                <IonItem key={index}>
                  ✖ {prohibite.description}
                </IonItem>
              ))  
            }
          
          <IonListHeader>{TermsObject.UserAccount.title} </IonListHeader>
          <IonLabel>{TermsObject.UserAccount.subtitle} </IonLabel>
          {
            TermsObject.UserAccount.list.map((account, index) => (
              <IonItem key={index}>
               ✔ {account.description}
              </IonItem>
            ))
          }
          
          <IonListHeader>{TermsObject.IntellectualProperty.title} </IonListHeader>
          <IonItem>{TermsObject.IntellectualProperty.description} </IonItem>
          
          <IonListHeader>{TermsObject.Externalintegrations.title} </IonListHeader>
          <IonItem>{TermsObject.Externalintegrations.description} </IonItem>
          
          <IonListHeader>{TermsObject.LimitationOfLiability.title} </IonListHeader>
          <IonLabel>{TermsObject.LimitationOfLiability.subtitle} </IonLabel>
          {
            TermsObject.LimitationOfLiability.list.map((liability, index) => (
              <IonItem key={index}>
               ✔ {liability.description}
              </IonItem>
            ))
          }

          <IonListHeader>{TermsObject.Modifications.title} </IonListHeader>  
          <IonItem>{TermsObject.Modifications.description} </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Terms;
