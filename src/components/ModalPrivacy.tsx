import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonImg,
  IonModal,
  IonNote,
} from "@ionic/react";
import React from "react";
import { ModalProfileProps } from "../Interfaces/iProps";
import img_privacy from "/img-privacy.webp";
import { useTranslation } from "react-i18next";

const ModalPrivacy: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <IonModal
      className="modal-privacy"
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      initialBreakpoint={0.58} // Altura fija: 58% del alto de pantalla
      breakpoints={[0, 0.58]} // 👈 Solo permite bajar (cerrar), no subir
      handleBehavior="none" // 👈 Evita ciclo de breakpoints
    >
      <IonContent>
        <IonCard className="card-privacy">
          <IonCardHeader>
            <IonCardTitle className="modal-title tile-privacity texto-primario">
              {t("privacyNote")}
            </IonCardTitle>
            <IonImg
              className="imgPrivacy"
              src={img_privacy}
              alt={t("privacyImageAlt")}
            />
          </IonCardHeader>
          <IonCardContent className="modal-privacy-content">
            <IonNote className="modal-note">
              {t("privacyDescription")}
            </IonNote>
            <IonButton onClick={onClose} className="btn-edit-profile">
              {t("accept")}
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default ModalPrivacy;
