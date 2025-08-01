import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { InfoApp, creditos } from "../other/InfoAppObject";
import { chevronBack, documentText } from "ionicons/icons";
import "../styles/InformationApp.css";
import { useTranslation } from "react-i18next";

const InformationApp: React.FC = () => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="minimal-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/home"
              className="minimal-back"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="minimal-title texto-quinto">{t("infoApp.title")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="minimal-content tema-oscuro">
        <div className="content-wrapper">
          
          {/* App Info */}
          <div className="app-section">
            <div className="app-logo-wrapper">
              <IonImg src={InfoApp.info.logo} className="minimal-logo" />
            </div>
            <h1 className="app-name texto-quinto">{InfoApp.info.name}</h1>
            
            <div className="info-block">
              <span className="info-label texto-primario">{t("infoApp.descriptionTitle")}</span>
              <p className="info-text texto-secundario">{t("infoApp.projectDescription")}</p>
            </div>
            
            <div className="info-block">
              <span className="info-label texto-primario">{t("infoApp.versionTitle")}</span>
              <p className="info-text texto-quinto">{InfoApp.info.version}</p>
            </div>
          </div>

          {/* Developers */}
          <div className="section">
            <h2 className="section-title texto-quinto">{t("infoApp.developersTitle")}</h2>
            <div className="developers-grid">
              {creditos.map((dev, index) => (
                <div key={index} className="dev-card">
                  <div className="dev-photo-wrapper">
                    <IonImg src={dev.photo} className="dev-photo" />
                  </div>
                  <h3 className="dev-name">{dev.name}</h3>
                  <p className="dev-role">{t(`infoApp.roles.${dev.roleKey}`)}</p>
                  
                  <div className="dev-links">
                    <a 
                      href={dev.portafolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="portfolio-link"
                    >
                      Portfolio
                    </a>
                    <div className="social-icons">
                      <a
                        href={dev.contacto.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                      >
                        <IonIcon className="info-app-icon" icon={dev.contacto.linkedin.icon} />
                      </a>
                      <a
                        href={dev.contacto.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                      >
                        <IonIcon icon={dev.contacto.github.icon} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* License */}
          <div className="section">
            <div className="license-block">
              <IonIcon icon={documentText} className="license-icon" />
              <div className="license-content">
                <span className="license-title">{t("infoApp.licenseTitle")}</span>
                <p className="license-text">{t("infoApp.licenseDescription")}</p>
              </div>
            </div>
          </div>
          
        </div>
      </IonContent>
    </IonPage>
  );
};

export default InformationApp;