import {
  IonAccordion,
  IonAccordionGroup,
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
} from '@ionic/react';
import {
  book,
  chevronBack,
  chevronForward,
  helpCircleOutline,
  mail,
} from 'ionicons/icons';
import React from 'react';
import '../styles/Suport.css';
import { FAQsObject } from '../other/FAQsObject';
import { useTranslation } from 'react-i18next';

const Soporte: React.FC = () => {
  const { t } = useTranslation();

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
          <IonTitle>{t('supports.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonAccordionGroup expand="inset">
          <IonAccordion value="faq">
            <IonItem slot="header" button>
              <IonIcon
                className="setting-icons iconos-oscuros"
                slot="start"
                icon={helpCircleOutline}
              /> 
              <IonLabel>{t('supports.faqTitle')}</IonLabel>
            </IonItem>
            <IonList className="ion-padding" slot="content">
              <p>{t('supports.faqDescription')}</p>

              {['AccountAndProfile', 'ExplorationAndRecommendations', 'Events', 'PrivacyAndSecurity'].map((sectionKey) => (
                <div key={sectionKey}>
                  <IonListHeader>{t(`support.${sectionKey}.title`)}</IonListHeader>
                  <IonLabel>{t(`supports.${sectionKey}.subtitle`)}</IonLabel>
                  {(FAQsObject as any)[sectionKey].list.map((faq: any, index: number) => (
                    <React.Fragment key={index}>
                      <IonLabel>{t(`supports.${sectionKey}.list.${index}.question`)}</IonLabel>
                      <IonItem>{t(`supports.${sectionKey}.list.${index}.answer`)}</IonItem>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </IonList>
          </IonAccordion>

          <IonAccordion value="contacto">
            <IonItem slot="header" button>
              <IonIcon
                className="setting-icons iconos-oscuros"
                slot="start"
                icon={mail}
              />
              <IonLabel>{t('support.contactTitle')}</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <p>{t('supports.contactText1')}</p>
              <p><strong>soporte-roadmap@gmial.com</strong></p>
              <p>{t('supports.contactText2')}</p>
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        <IonList>
          <IonItem button>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="start"
              icon={book}
            />
            <IonLabel>{t('support.guide')}</IonLabel>
            <IonIcon
              className="setting-icons iconos-oscuros"
              slot="end"
              icon={chevronForward}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Soporte;
