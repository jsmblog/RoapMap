import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React from "react";
import "../styles/PolicyAndTerms.css";
import { Policy } from "../other/PolicyAndTermsObject";
import { useTranslation } from "react-i18next";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="privacy-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="privacy-title texto-quinto ">{t("privacy.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="privacy-content tema-oscuro">
        <div className="privacy-wrapper">

          {/* Header info */}
          <div className="privacy-header">
            <div className="last-update">
              <span className="update-label texto-quinto">{t("privacy.lastUpdate")}</span>
              <span className="update-date texto-secundario">{Policy.DateUpdated}</span>
            </div>
            <p className="privacy-description texto-secundario">{t("privacy.description")}</p>
          </div>

          {/* Information Collection */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.informationCollection.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("privacy.informationCollection.subtitle")}</p>
            <div className="subsection-list">
              {Policy.InformationCollection.list.map((_, index) => (
                <div key={index} className="subsection-item">
                  <h3 className="subsection-title texto-quinto">
                    {t(`privacy.informationCollection.list.${index}.title`)}
                  </h3>
                  <div className="list-item texto-secundario">
                    <span className="check-icon">✓</span>
                    {t(`privacy.informationCollection.list.${index}.description`)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Information Use */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.informationUse.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("privacy.informationUse.subtitle")}</p>
            <ul className="privacy-list">
              {Policy.InformationUse.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`privacy.informationUse.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.dataSharing.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("privacy.dataSharing.subtitle")}</p>
            <ul className="privacy-list">
              {Policy.DataSharing.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`privacy.dataSharing.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Data Security */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.dataSecurity.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("privacy.dataSecurity.subtitle")}</p>
            <ul className="privacy-list">
              {Policy.DataSecurity.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`privacy.dataSecurity.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Data Retention */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.dataRetention.title")}</h2>
            <p className="section-text texto-secundario">{t("privacy.dataRetention.description")}</p>
          </section>

          {/* User Rights */}
          <section className="privacy-section">
            <h2 className="section-title texto-quinto">{t("privacy.userRights.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("privacy.userRights.subtitle")}</p>
            <ul className="privacy-list">
              {Policy.UserRights.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`privacy.userRights.list.${index}`)}
                </li>
              ))}
            </ul>
            <div className="contact-info ">
              <p className="contact-text">{t("privacy.userRights.infocantac")}</p>
            </div>
          </section>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default PrivacyPolicy;