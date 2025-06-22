import { IonButton, IonContent, IonModal, IonNote, IonTitle } from "@ionic/react";
import React from "react";
import { ModalProfileProps } from "../Interfaces/iProps";
import img_privacy from "/img-privacy.webp";

const ModalPrivacy: React.FC<ModalProfileProps> = ({isOpen,onClose}) => {
  return (
    <IonModal
      className="modal-privacy"
      initialBreakpoint={0.58} // Ocupa 85% de la pantalla
      breakpoints={[0, 0.3, 0.5, 0.75]}
      handleBehavior="cycle"
      isOpen={isOpen}     
      onDidDismiss={onClose}
      trigger="open-modal-privacy"
    >
      <IonContent fullscreen>
       <div className="modal-privacy-content">
         <IonTitle className="modal-title">Nota de Privacidad</IonTitle>
          <img className="imgPrivacy" src={img_privacy} alt="Imagen de privacidad" />
        <IonNote className="modal-note">
          Tu perfil es visible para otros usuarios, tanto en chats, comentarios
          y en el contenido que compartas con la comunidad, pero no se compartirá
          tu correo electrónico ni tu número de teléfono. Puedes editar tu
          perfil en cualquier momento.
        </IonNote>
        <IonButton onClick={onClose} className="btn-edit-profile">Aceptar</IonButton>
       </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalPrivacy;
