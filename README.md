# RoadMap

RoadMap es una aplicación híbrida desarrollada con Ionic React y Firebase, que permite a los usuarios:

- **Registrarse e iniciar sesión** con correo electrónico y contraseña (o Google).
- **Verificar su cuenta** por correo electrónico.
- **Configurar sus preferencias** a través de un asistente (wizard) de selección.
- **Explorar un mapa interactivo**, buscar lugares por categorías y trazar rutas.
- **Ver el clima** de su ubicación actual y recibir recomendaciones climáticas.

---

## 📦 Tecnologías

- **Ionic React**: Framework UI para aplicaciones móviles y de escritorio.
- **React Hooks** (`useState`, `useEffect`, `useCallback`, `useMemo`).
- **Firebase Authentication**: Gestión de usuarios (correo/contraseña y Google).
- **Cloud Firestore**: Almacenamiento en tiempo real de datos de usuarios y preferencias.
- **Google Maps & Places**: Mapas, búsqueda de lugares y marcadores.
- **OpenWeather (hook personalizado)**: Obtención de datos meteorológicos.
- **TypeScript**: Tipado estático en componentes y funciones.
- **CSS Modules / `.css`**: Estilos por componente.
- **DeepSeek** IA de DeepSeek para uso inteligente.  


## 🚀 Instalación

1. Clonar el repositorio  
   git clone https://github.com/jsmblog/RoapMap
   cd roapmap
2. Instalar dependencias
npm install
3. Configurar variables de entorno en .env
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_CUSTOM_KEY
VITE_LINK_FIREBASE_FUNCTIONS
VITE_API_KEY_OPEN_WHEATER
VITE_API_KEY_GOOGLE
4. Iniciar la aplicación
ionic serve

# 🔐 Autenticación
- **Auth.tsx**
Gestiona el login y registro de usuarios usando Firebase Auth.
**importaciones**
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { hasNameCompleted } from '../functions/hasNameCompleted';
# Flujo de registro
1. El usuario ingresa nombre, correo y contraseña.

2. Se valida la forma (campos completos, formato de email, longitud de contraseña, nombre completo).

3. Se crea la cuenta en Firebase Auth y se envía correo de verificación.

4. Se guarda el perfil inicial en Firestore (USERS/{uid}) con:

n: nombre completo

ca: fecha de creación

e: email

loc: ubicación GPS

pre: preferencias (array vacío)

v: verificado (false)

otros campos de metadata.

5. Se redirige al usuario a /area/waiting.

# Flujo de login

1. El usuario ingresa correo y contraseña.

2. Se autentica en Firebase Auth.

3. Si tiene sesión activa y correo verificado, se redirige a /tab/home.

# ⏳ Verificación de correo
- **RoomWaiting.tsx**
Componente que muestra un mensaje y un loader mientras el usuario confirma su correo.

**importaciones**
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

- Se comprueba cada 5 segundos si el usuario ha verificado su correo (auth.currentUser.reload()).

- Cuando emailVerified === true, se actualiza el campo v: true en Firestore y se redirige al asistente de preferencias.

# ⚙️ Asistente de preferencias (Wizard)
**Wizard.tsx**
Un flujo de pasos donde el usuario selecciona sus intereses y preferencias.

**importaciones** 
import { wizardSteps } from '../functions/wizardSteps';
import { connection } from '../connection/connection_to_backend';
import { doc, updateDoc } from 'firebase/firestore';

- Cada paso muestra un título, subtítulo y opciones seleccionables (hasta un máximo por paso).

- Al finalizar, se almacena en Firestore el array 'pre' con todas las selecciones.

- Se envía un payload a un microservicio /send/request/ai para generar una recomendación inicial, que se guarda en el campo 'd' del usuario.

- Finalmente, se redirige al Home.

# 🏠 Home
**Home.tsx**
Vista principal que engloba:

- Mapa interactivo con búsqueda y categorías.

- Barra de búsqueda (SearchBar).

- Listado de categorías (ListCategories).

- Tarjeta del clima (WeatherCard).

- Modal de perfil (ModalProfile).

- El componente gestiona:

- Estado de categoría seleccionada y markadores.

- Reload del mapa cuando se limpia la búsqueda.

---

## 🔐 Contexto de Autenticación

### `AuthContext` y `AuthProvider`

Este contexto global gestiona el estado de autenticación y los datos de perfil del usuario:

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { AUTH_USER, db } from "../Firebase/initializeApp";

interface AuthContextType {
  authUser: User | null;          // Objeto de Firebase Auth (o null)
  currentUserData: any;           // Perfil y metadata desde Firestore
  isLoading: boolean;             // Indica si los datos aún cargan
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  `{ authUser, currentUserData, isLoading }`
};
export const useAuthContext = () => useContext(AuthContext);

- **authUser:** objeto de Firebase Auth o null si no hay sesión.

- **currentUserData:** datos detallados del perfil (name, email, preferences, verified, location, etc.).

- **isLoading:** bandera que indica si la carga inicial o las actualizaciones están en curso.

# 🪄 Hooks Personalizados

1. useRequestLocationPermission
Solicita y obtiene la ubicación del usuario, tanto en web como en dispositivos nativos:

export const useRequestLocationPermission = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = async () => {
    // En web: usa `navigator.geolocation`
    // En nativo (Capacitor): verifica permisos y usa `Geolocation.getCurrentPosition()`
  };

  return { location, getLocation };
};

location: { lat, lng } o null.

getLocation(): función que solicita permiso y actualiza location.

2. UseOpenWeather
Consume la API de OpenWeather a partir de la ubicación en el contexto de usuario:

export const UseOpenWeather = () => {
  const { currentUserData } = useAuthContext();
  const location = currentUserData?.location;
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (!location?.lat) return;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${VITE_API_KEY_OPEN_WHEATER}`)
      .then(res => setWeather(res.data))
      .catch(console.error);
  }, [location]);

  return { weather };
};

- Llama a la API sólo cuando location esté disponible.

- Devuelve el objeto completo de weather para mostrar temperatura, condiciones, iconos, etc.

# 🔗 Conexión al Backend
Se crea una instancia de Axios apuntando a tus Cloud Functions de Firebase:

**importaciones**
import axios from 'axios';
import { VITE_LINK_FIREBASE_FUNCTIONS } from '../config/config';

export const connection = axios.create({
  baseURL: VITE_LINK_FIREBASE_FUNCTIONS,
});

Úsala para enviar datos al microservicio AI u otras funciones de negocio:

endpoint -> const { data } = await connection.post('/send/request/ai', payload);

# 🚧 Protección de Rutas
El componente ProtectedRoute asegura que sólo usuarios autenticados (y opcionalmente verificados) puedan acceder a ciertas rutas:

import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/UserContext';

interface ProtectedRouteProps extends RouteProps {
  publicOnly?: boolean; // si es true, bloquea rutas a usuarios logueados
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, publicOnly = false, ...rest }) => {
  const { authUser, currentUserData } = useAuthContext();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (publicOnly) {
          // Sólo accesible si NO hay sesión o no está verificado
          if (authUser && currentUserData?.verified) {
            return <Redirect to="/tab/home" />;
          }
          return children;
        }
        // Rutas protegidas: usuario debe estar autenticado
        if (authUser) return children;
        return <Redirect to={{ pathname: '/', state: { from: location } }} />;
      }}
    />
  );
};

export default ProtectedRoute;

- publicOnly: si true, redirige al home a usuarios ya logueados y verificados.

- Sin publicOnly, protege la ruta para que sólo usuarios autenticados accedan.