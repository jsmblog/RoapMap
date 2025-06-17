import { 
  IonPage, 
  IonContent, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonIcon,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonButtons
} from '@ionic/react';
import { eyeOutline, eyeOffOutline, chevronBackOutline, logoGoogle, mail, lockClosed } from 'ionicons/icons';
import React, { useState } from 'react';
import '../styles/login.css';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="transparent">
          <IonButtons slot="start">
            <IonBackButton 
              icon={chevronBackOutline}
              defaultHref="/"
              color="dark"
              text=""
            />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="login-content">
        <div className="illustration-container">
          <img src="/Forest.gif" alt="Forest illustration" className="forest-image" />
        </div>

        <div className="form-container">
          <div className="welcome-text">
            <h1>Bienvenido de Nuevo</h1>
            <p>Para disfrutar de una mejor experiencia</p>
          </div>

          <div className="input-container">
            <IonItem className="email-input" lines="none">
              <IonIcon icon={mail} size='small' className="input-icon" />
              <IonInput
                placeholder="Correo Electrónico"
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>

            <IonItem className="password-input" lines="none">
                <IonIcon size='small' icon={lockClosed} className="input-icon" />
              <IonInput
                placeholder="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              />
              <IonIcon
                slot="end"
                icon={showPassword ? eyeOffOutline : eyeOutline}
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              />
            </IonItem>
          </div>

          <div className="forgot-password">
            <span>¿Olvidaste tu contraseña?</span>
          </div>

          <IonButton 
            expand="block" 
            className="continue-button"
            onClick={() => console.log('Login attempt')}
          >
            Continuar
          </IonButton>

          <IonButton 
            expand="block" 
            fill="outline" 
            className="google-button"
            onClick={() => console.log('Google login')}
          >
            <IonIcon slot="start" icon={logoGoogle} />
            Continuar con Google
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;