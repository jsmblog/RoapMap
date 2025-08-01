import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonContent, IonItem, IonIcon, IonInput, IonButton, useIonRouter
} from '@ionic/react';
import {
  eyeOutline, eyeOffOutline, chevronBackOutline,
  logoGoogle, mail, lockClosed, person
} from 'ionicons/icons';
import { useParams } from 'react-router';
import { useToast } from '../hooks/UseToast';
import {
  createUserWithEmailAndPassword, sendEmailVerification,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { AUTH_USER, db } from '../Firebase/initializeApp';
import { formatDateTime } from '../functions/formatDate';
import { collection, doc, setDoc } from 'firebase/firestore';
import '../styles/auth.css';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { hasNameCompleted } from '../functions/hasNameCompleted';

type AuthParams = { mode: 'login' | 'signup' };
const Auth: React.FC = () => {
  const { mode } = useParams<AuthParams>();
  const isLogin = mode === 'login';
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const {location,getLocation} = useRequestLocationPermission();
  const router = useIonRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const onChange = useCallback((e: CustomEvent) => {
    const target = e.target as HTMLIonInputElement;
    setForm(f => ({ ...f, [target.name]: target.value as string }));
  }, []);

  const clearForm = useCallback(() => {
    setForm({ name: '', email: '', password: '' });
    setShowPassword(false);
  }, []);

  const validate = useCallback(() => {
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      showToast('Por favor, complete todos los campos.', 3000 , 'danger');
      return false;
    }
    if (!hasNameCompleted(form.name) && !isLogin) {
      showToast('Añada al menos un nombre y un apellido.', 3000, 'warning');
      setForm(f => ({ ...f, name: '' }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast('Correo electrónico inválido.', 3000, 'warning');
      setForm(f => ({ ...f, email: '' }));
      return false;
    }
    if (!isLogin && form.password.length < 8) {
      showToast('La contraseña debe tener al menos 8 caracteres.', 3000,'warning');
      return false;
    }
    return true;
  }, [form, isLogin, showToast]);

  const handleAuth = useCallback(async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(AUTH_USER, form.email, form.password);
        router.push('/tab/home', 'root');
      } else {
        const cred = await createUserWithEmailAndPassword(AUTH_USER, form.email, form.password);
        await sendEmailVerification(cred.user);
        const createdAt = formatDateTime(new Date());
        const userDoc = {
          n: form.name,
          ca: createdAt,
          e: form.email,
          d:'',
          uid: cred.user.uid,
          pre: [],
          v: false,
          loc: location,
          fav:[]
          // p: { ip: false, d: '', t: 'free' },
        };
        await setDoc(doc(collection(db, 'USERS'), cred.user.uid), userDoc, { merge: true });
        showToast('Registro exitoso. Verifica tu correo.', 3000, 'success');
        router.push('/area/waiting', 'root');
      }
    } catch (err) {
      console.error(err);
      showToast(isLogin
        ? 'Error al iniciar sesión, credenciales incorrectas.'
        : 'Error al registrarse. Inténtalo de nuevo.', 3000, 'danger');
    } finally {
      clearForm();
      setLoading(false);
    }
  }, [form, isLogin,location, router, showToast, validate, clearForm]);

  const title    = isLogin ? 'Bienvenido de Nuevo'     : 'Bienvenido';
  const subtitle = isLogin
    ? 'Para disfrutar de una mejor experiencia'
    : 'Regístrese ahora y comience a navegar';
  const action   = isLogin ? 'Continuar'                : 'Registrarse';

  const fields = useMemo(() => [
    !isLogin && {
      name: 'name',
      icon: person,
      type: 'text',
      placeholder: 'Ejm: Juan Pérez',
      label: 'Nombre',
      value: form.name,
    },
    {
      name: 'email',
      icon: mail,
      type: 'email',
      placeholder: 'Correo Electrónico',
      label: 'Email',
      value: form.email,
    },
    {
      name: 'password',
      icon: lockClosed,
      type: showPassword ? 'text' : 'password',
      placeholder: 'Contraseña',
      label: 'Contraseña',
      value: form.password,
      toggle: true,
    },
  ].filter(Boolean), [form, isLogin, showPassword]);

   useEffect(() => {
    if(!isLogin) getLocation();
  }, []);

  return (
    <IonPage> 
      {ToastComponent}
      <IonHeader className="ion-no-border">
        <IonToolbar className='toolbar-auth' color="transparent">
          <IonButtons slot="start">
            <IonBackButton className='back-button-auth' icon={chevronBackOutline} defaultHref="/" color="dark" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="login-content">
        <div className="illustration-container">
          <img src="/Forest.gif" alt="Forest" className="forest-image" draggable={false} />
        </div>
        <form className="form-container">
          <div className="welcome-text">
            <h1 className="secular-one">{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="input-container">
            {fields.map((f: any) => (
              <IonItem key={f.name} lines="none" className={`${f.name}-input`}>
                <IonIcon icon={f.icon} size="small" className="input-icon" />
                <IonInput
                  name={f.name}
                  type={f.type}
                  label={f.label}
                  labelPlacement="floating"
                  placeholder={f.placeholder}
                  value={f.value}
                  onIonInput={onChange}
                  required
                  fill="outline"
                />
                {f.toggle && (
                  <IonIcon
                    slot="end"
                    icon={showPassword ? eyeOffOutline : eyeOutline}
                    onClick={() => setShowPassword(s => !s)}
                    className="password-toggle"
                  />
                )}
              </IonItem>
            ))}
          </div>
          {isLogin && (
            <div className="forgot-password">
              <span>¿Olvidaste tu contraseña?</span>
            </div>
          )}
          <IonButton expand="block" 
          disabled={loading} 
          className="continue-button" onClick={handleAuth}>
            {loading ? "Entrando..." : action}
          </IonButton>
          {/* {isLogin && ( */}
            <>
              <div className="auth-divider"><span>O</span></div>
              <IonButton expand="block" fill="outline" className="google-button"
                onClick={() => console.log('Google login')}>
                <IonIcon className='icon-google' slot="start" icon={logoGoogle} />
                <span>Continuar con Google</span>
              </IonButton>
            </>
          {/* )} */}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
