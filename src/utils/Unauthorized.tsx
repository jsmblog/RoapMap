import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import '../styles/unauthorized.css';

const Unauthorized: React.FC = () => {
  const router = useIonRouter();

  const handleGoHome = () => {
    router.push('/', 'root');
  };

  return (
    <IonPage className="unauthorized-page">
      <IonContent className="unauthorized-content" fullscreen>
        <IonIcon icon={lockClosedOutline} className="unauthorized-icon" />
        <h1 className="unauthorized-title">Acceso Denegado</h1>
        <p className="unauthorized-text">
          No tienes permisos para ver esta página.
        </p>
        <IonButton className="unauthorized-button" onClick={handleGoHome}>
          Ir al Inicio
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Unauthorized;
