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
import { TermsObject } from "../other/PolicyAndTermsObject";
import { useTranslation } from "react-i18next";

const Terms: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="terms-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="terms-title texto-quinto">{t("terms.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="terms-content tema-oscuro">
        <div className="terms-wrapper">
          
          {/* Header info */}
          <div className="terms-header">
            <div className="last-update">
              <span className="update-label texto-quinto">{t("terms.lastUpdate")}</span>
              <span className="update-date texto-secundario">{TermsObject.DateUpdated}</span>
            </div>
            <p className="terms-description texto-secundario">{t("terms.description")}</p>
          </div>

          {/* Acceptance */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.acceptance.title")}</h2>
            <p className="section-text texto-secundario">{t("terms.acceptance.description")}</p>
          </section>

          {/* Permitted Use */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.permittedUse.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("terms.permittedUse.subtitle")}</p>
            <ul className="terms-list permitted">
              {TermsObject.PermittedUse.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`terms.permittedUse.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Prohibited Use */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.prohibitedUse.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("terms.prohibitedUse.subtitle")}</p>
            <ul className="terms-list prohibited">
              {TermsObject.ProhibitedUse.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="cross-icon">✕</span>
                  {t(`terms.prohibitedUse.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* User Account */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.userAccount.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("terms.userAccount.subtitle")}</p>
            <ul className="terms-list permitted">
              {TermsObject.UserAccount.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`terms.userAccount.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.intellectualProperty.title")}</h2>
            <p className="section-text texto-secundario">{t("terms.intellectualProperty.description")}</p>
          </section>

          {/* External Integrations */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.externalIntegrations.title")}</h2>
            <p className="section-text texto-secundario">{t("terms.externalIntegrations.description")}</p>
          </section>

          {/* Limitation of Liability */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.limitationOfLiability.title")}</h2>
            <p className="section-subtitle texto-secundario">{t("terms.limitationOfLiability.subtitle")}</p>
            <ul className="terms-list permitted">
              {TermsObject.LimitationOfLiability.list.map((_, index) => (
                <li key={index} className="list-item texto-secundario">
                  <span className="check-icon">✓</span>
                  {t(`terms.limitationOfLiability.list.${index}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* Modifications */}
          <section className="terms-section">
            <h2 className="section-title texto-quinto">{t("terms.modifications.title")}</h2>
            <p className="section-text texto-secundario">{t("terms.modifications.description")}</p>
          </section>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Terms;