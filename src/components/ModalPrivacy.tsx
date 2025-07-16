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

const ModalPrivacy: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
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
            <IonCardTitle className="modal-title tile-privacity">Nota de Privacidad</IonCardTitle>
            <IonImg
              className="imgPrivacy"
              src={img_privacy}
              alt="Imagen de privacidad"
            />
          </IonCardHeader>
          <IonCardContent className="modal-privacy-content">
            <IonNote className="modal-note">
            Tu perfil es visible para otros usuarios, tanto en chats,
            comentarios y en el contenido que compartas con la comunidad, pero
            no se compartirá tu correo electrónico ni tu número de teléfono.
            Puedes editar tu perfil en cualquier momento.
          </IonNote>
          <IonButton onClick={onClose} className="btn-edit-profile">
            Aceptar
          </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};

export default ModalPrivacy;
