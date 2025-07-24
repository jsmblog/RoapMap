import { IonAccordion, IonAccordionGroup, IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { book, chevronBack, chevronForward, helpCircleOutline, mail } from 'ionicons/icons'
import React from 'react'
import '../styles/Suport.css'
import { FAQsObject } from '../other/FAQsObject'
const Soporte: React.FC = () => {
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
                    <IonTitle>Soporte</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonAccordionGroup expand="inset">
                    <IonAccordion value="faq">
                        <IonItem slot="header" button>
                            <IonIcon className="setting-icons iconos-oscuros" slot='start' icon={helpCircleOutline} />
                            <IonLabel>{FAQsObject.title} </IonLabel>
                        </IonItem>
                        <IonList className="ion-padding" slot="content">
                            <p>{FAQsObject.description} </p>
                            <IonListHeader>{FAQsObject.AccountAndProfile.title} </IonListHeader>
                            <IonLabel>{FAQsObject.AccountAndProfile.subtitle} </IonLabel>
                            {
                                FAQsObject.AccountAndProfile.list.map((options, index) => (
                                    <>
                                        <IonLabel>{options.question}</IonLabel>
                                        <IonItem key={index}>
                                            {options.answer}
                                        </IonItem>
                                    </>
                                ))
                            }

                            <IonListHeader>{FAQsObject.ExplorationAndRecommendations.title}</IonListHeader>
                            <IonLabel>{FAQsObject.ExplorationAndRecommendations.subtitle}</IonLabel>
                            {
                                FAQsObject.ExplorationAndRecommendations.list.map((options, index) => (
                                    <>
                                        <IonLabel>{options.question}</IonLabel>
                                        <IonItem key={index}>
                                            {options.answer}
                                        </IonItem>
                                    </>
                                ))
                            }

                            <IonListHeader>{FAQsObject.Events.title}</IonListHeader>
                            <IonLabel>{FAQsObject.Events.subtitle}</IonLabel>
                            {
                                FAQsObject.Events.list.map((options, index) => (
                                    <>
                                        <IonLabel>{options.question}</IonLabel>
                                        <IonItem key={index}>
                                            {options.answer}
                                        </IonItem>
                                    </>
                                ))
                            }

                            <IonListHeader>{FAQsObject.PrivacyAndSecurity.title}</IonListHeader>
                            <IonLabel>{FAQsObject.PrivacyAndSecurity.subtitle}</IonLabel>
                            {
                                FAQsObject.PrivacyAndSecurity.list.map((options, index) => (
                                    <>
                                        <IonLabel>{options.question}</IonLabel>
                                        <IonItem key={index}>
                                            {options.answer}
                                        </IonItem>
                                    </>
                                ))
                            }
                        </IonList>
                    </IonAccordion>

                    <IonAccordion value="contacto">
                        <IonItem slot="header" button>
                            <IonIcon className="setting-icons iconos-oscuros" slot='start' icon={mail} />
                            <IonLabel>Contactar con Soporte</IonLabel>
                        </IonItem>
                        <div className="ion-padding" slot="content">
                            <p>Si necesitas ayuda, escríbenos a:</p>
                            <p><strong>soporte-roadmap@gmial.com</strong></p>
                            <p>Responderemos en menos de 24 horas hábiles.</p>
                        </div>
                    </IonAccordion>
                </IonAccordionGroup>

                <IonList>
                    <IonItem button>
                        <IonIcon className="setting-icons iconos-oscuros" slot='start' icon={book} />
                        <IonLabel>Guía Rápida</IonLabel>
                        <IonIcon className="setting-icons iconos-oscuros" slot='end' icon={chevronForward} />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Soporte
