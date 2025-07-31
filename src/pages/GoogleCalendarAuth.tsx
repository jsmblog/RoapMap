import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonText,
  IonSpinner,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/react';
import {
  logoGoogle,
  calendarOutline,
  checkmarkCircleOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  arrowBackOutline,
  playOutline,
} from 'ionicons/icons';
import '../styles/GoogleCalendarAuth.css';
import { useToast } from '../hooks/UseToast';

interface GoogleCalendarAuthProps {
  onClose?: () => void;
  onAuthSuccess?: (authData: any) => void;
}

const GoogleCalendarAuth: React.FC<GoogleCalendarAuthProps> = ({ 
  onClose, 
  onAuthSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'intro' | 'permissions' | 'loading' | 'success'>('intro');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleGoogleAuth = async () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      showToast('Por favor acepta los términos y condiciones', 4000, 'warning');
      return;
    }

    setIsLoading(true);
    setCurrentStep('loading');

    try {
      // Aquí irá la lógica real de autenticación con Google
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular respuesta exitosa
      const mockAuthData = {
        accessToken: 'mock_access_token',
        email: 'usuario@gmail.com',
        name: 'Usuario',
        calendarAccess: true
      };

      setCurrentStep('success');
      setTimeout(() => {
        onAuthSuccess?.(mockAuthData);
        showToast('¡Autenticación exitosa! Ahora puedes crear eventos.', 5000, 'success');
      }, 2000);

    } catch (error) {
      console.error('Error en autenticación:', error);
      showToast('Error al conectar con Google. Inténtalo de nuevo.', 5000, 'danger');
      setCurrentStep('intro');
    } finally {
      setIsLoading(false);
    }
  };

  const renderIntroStep = () => (
    <div className="auth-content">
      <div className="auth-hero">
        <div className="hero-icon">
          <IonIcon icon={calendarOutline} />
        </div>
        <h1 className="hero-title">Conecta tu Calendario</h1>
        <p className="hero-subtitle">
          Para crear eventos automáticamente, necesitamos acceso a tu Google Calendar
        </p>
      </div>

      <div className="features-list">
        <div className="feature-item">
          <IonIcon icon={checkmarkCircleOutline} />
          <div className="feature-text">
            <h3>Eventos Automáticos</h3>
            <p>Crea eventos directamente desde las recomendaciones</p>
          </div>
        </div>
        
        <div className="feature-item">
          <IonIcon icon={lockClosedOutline} />
          <div className="feature-text">
            <h3>Datos Seguros</h3>
            <p>Tus datos están protegidos y encriptados</p>
          </div>
        </div>
        
        <div className="feature-item">
          <IonIcon icon={shieldCheckmarkOutline} />
          <div className="feature-text">
            <h3>Control Total</h3>
            <p>Puedes revocar el acceso en cualquier momento</p>
          </div>
        </div>
      </div>

      <IonButton
        expand="block"
        className="continue-btn"
        onClick={() => setCurrentStep('permissions')}
      >
        <IonIcon icon={playOutline} slot="start" />
        Continuar
      </IonButton>
    </div>
  );

  const renderPermissionsStep = () => (
    <div className="auth-content">
      <div className="permissions-header">
        <div className="google-logo">
          <IonIcon icon={logoGoogle} />
        </div>
        <h2>Permisos Necesarios</h2>
        <p>Tu aplicación necesitará los siguientes permisos:</p>
      </div>

      <IonList className="permissions-list">
        <IonItem className="permission-item">
          <IonIcon icon={calendarOutline} slot="start" color="primary" />
          <IonLabel>
            <h3>Acceso al Calendario</h3>
            <p>Para crear y gestionar eventos</p>
          </IonLabel>
        </IonItem>
        
        <IonItem className="permission-item">
          <IonIcon icon={shieldCheckmarkOutline} slot="start" color="success" />
          <IonLabel>
            <h3>Información Básica</h3>
            <p>Nombre y email para personalización</p>
          </IonLabel>
        </IonItem>
      </IonList>

      <div className="terms-section">
        <IonItem className="terms-item">
          <IonCheckbox
            checked={acceptedTerms}
            onIonChange={(e) => setAcceptedTerms(e.detail.checked)}
            slot="start"
          />
          <IonLabel>
            <p>Acepto los <span className="link">términos y condiciones</span></p>
          </IonLabel>
        </IonItem>
        
        <IonItem className="terms-item">
          <IonCheckbox
            checked={acceptedPrivacy}
            onIonChange={(e) => setAcceptedPrivacy(e.detail.checked)}
            slot="start"
          />
          <IonLabel>
            <p>Acepto la <span className="link">política de privacidad</span></p>
          </IonLabel>
        </IonItem>
      </div>

      <div className="auth-actions">
        <IonButton
          fill="clear"
          className="back-btn"
          onClick={() => setCurrentStep('intro')}
        >
          <IonIcon icon={arrowBackOutline} slot="start" />
          Atrás
        </IonButton>
        
        <IonButton
          className="google-auth-btn"
          onClick={handleGoogleAuth}
          disabled={!acceptedTerms || !acceptedPrivacy}
        >
          <IonIcon icon={logoGoogle} slot="start" />
          Conectar con Google
        </IonButton>
      </div>
    </div>
  );

  const renderLoadingStep = () => (
    <div className="auth-content loading-content">
      <div className="loading-animation">
        <IonSpinner name="crescent" className="main-spinner" />
        <div className="loading-icons">
          <IonIcon icon={logoGoogle} className="google-icon" />
          <div className="connecting-line"></div>
          <IonIcon icon={calendarOutline} className="calendar-icon" />
        </div>
      </div>
      
      <h2>Conectando...</h2>
      <p>Estamos estableciendo la conexión con Google Calendar</p>
      
      <div className="loading-steps">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-text">Autenticando</span>
        </div>
        <div className="step active">
          <span className="step-number">2</span>
          <span className="step-text">Obteniendo permisos</span>
        </div>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-text">Finalizando</span>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="auth-content success-content">
      <div className="success-animation">
        <IonIcon icon={checkmarkCircleOutline} className="success-icon" />
      </div>
      
      <h2>¡Conexión Exitosa!</h2>
      <p>Tu Google Calendar está conectado correctamente</p>
      
      <div className="success-features">
        <div className="success-item">
          <IonIcon icon={calendarOutline} />
          <span>Crear eventos automáticamente</span>
        </div>
        <div className="success-item">
          <IonIcon icon={checkmarkCircleOutline} />
          <span>Sincronización en tiempo real</span>
        </div>
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent className="auth-page-content">
        {ToastComponent}
        <div className="auth-container">
          <IonCard className="auth-card">
            <IonCardContent>
              {currentStep === 'intro' && renderIntroStep()}
              {currentStep === 'permissions' && renderPermissionsStep()}
              {currentStep === 'loading' && renderLoadingStep()}
              {currentStep === 'success' && renderSuccessStep()}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GoogleCalendarAuth;