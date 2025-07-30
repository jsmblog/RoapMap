# RoadMap

**RoadMap** es una aplicación híbrida construida con **Ionic React**, **Firebase** y **DeepSeek AI**, diseñada para ofrecer a los usuarios una experiencia completa de exploración, personalización y recomendación inteligente.

---

## 🎯 Visión General

RoadMap permite a los usuarios:

* **Registrarse e iniciar sesión** con correo electrónico y contraseña, o mediante Google.
* **Verificar su cuenta** a través de correo electrónico para activar funcionalidades.
* **Configurar sus preferencias** mediante un asistente interactivo (*wizard*).
* **Explorar un mapa interactivo**, buscar lugares por categorías y trazar rutas.
* **Visualizar el clima** de su ubicación actual y recibir recomendaciones meteorológicas.

---

## 🛠 Tecnologías

| Tecnología               | Descripción                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| Ionic React              | Framework UI para apps móviles y de escritorio basadas en React.      |
| React Hooks              | `useState`, `useEffect`, `useCallback`, `useMemo`, `useContext`.      |
| Firebase Authentication  | Autenticación de usuarios (email/password y Google).                  |
| Cloud Firestore          | Base de datos NoSQL en tiempo real para perfiles y datos de usuarios. |
| Google Maps & Places API | Mapas interactivos, búsqueda y marcadores de puntos de interés.       |
| OpenWeather API          | Obtención de datos meteorológicos mediante hook personalizado.        |
| TypeScript               | Tipado estático para mayor robustez.                                  |
| CSS Modules / `.css`     | Estilos encapsulados por componente.                                  |
| DeepSeek AI              | Recomendaciones inteligentes mediante microservicio personalizado.    |

---

## 🚀 Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/jsmblog/RoapMap.git
   cd RoapMap
   ```
2. **Instalar dependencias**

   ```bash
   npm install
   # o
   yarn install
   ```
3. **Configurar variables de entorno**
   Copiar `.env.example` a `.env` y completar:

   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_CUSTOM_KEY=
   VITE_LINK_FIREBASE_FUNCTIONS=
   VITE_API_KEY_OPEN_WEATHER=
   VITE_API_KEY_GOOGLE=
   ```
4. **Iniciar la aplicación**

   ```bash
   ionic serve
   ```
5. Abrir en el navegador: [http://localhost:8100](http://localhost:8100)

---

## 🔐 Autenticación

### **Auth.tsx**

Gestiona registro y login usando Firebase Authentication.

```tsx
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { hasNameCompleted } from '../functions/hasNameCompleted';
import { AUTH_USER, db } from '../Firebase/initializeApp';
```

#### Flujo de Registro

1. Usuario ingresa nombre, email y contraseña.
2. Validación del formulario (campos, email, contraseña, nombre completo).
3. `createUserWithEmailAndPassword` para crear cuenta en Auth.
4. `sendEmailVerification` envía correo de confirmación.
5. Guardar perfil en Firestore:

   ```ts
   await setDoc(doc(db, 'USERS', uid), {
     n: fullName,
     ca: new Date().toISOString(),
     e: email,
     loc: location,       // Obtenida con useRequestLocationPermission
     pre: [],            // Preferencias iniciales
     v: false            // Verificado
   });
   ```
6. Redirigir a `/area/waiting`.

#### Flujo de Login

1. Usuario ingresa email y contraseña.
2. `signInWithEmailAndPassword` para autenticar.
3. Si `emailVerified`, redirigir a `/tab/home`; si no, mensaje de verificación.

### Verificación de Email

**RoomWaiting.tsx** comprueba cada 5 seg:

```tsx
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const interval = setInterval(async () => {
    await auth.currentUser.reload();
    if (auth.currentUser.emailVerified) {
      await updateDoc(doc(db, 'USERS', auth.currentUser.uid), { v: true });
      router.push('/wizard');
      clearInterval(interval);
    }
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

---

## ⚙️ Asistente de Preferencias (Wizard)

**Wizard.tsx** maneja un flujo de pasos:

```tsx
import { wizardSteps } from '../functions/wizardSteps';
import { connection } from '../config/connection_to_backend';
import { doc, updateDoc } from 'firebase/firestore';
```

* Cada paso muestra título, subtítulo y opciones.
* Al finalizar, guarda array `pre` en Firestore:

  ```ts
  await updateDoc(doc(db, 'USERS', uid), { pre: selections });
  ```
* Enviar `payload` a microservicio IA:

  ```ts
  const { data } = await connection.post('/send/request/ai', { uid, selections });
  await updateDoc(doc(db, 'USERS', uid), { d: data.recommendation });
  ```
* Redirigir al Home.

---

## 🏠 Home & Mapa

**Home.tsx** incluye:

* Mapa interactivo con Google Maps.
* `SearchBar` para búsquedas libres.
* `ListCategories` para filtrar marcadores.
* `WeatherCard` para clima actual.
* `ModalProfile` para editar perfil.

Manejo de estado:

```tsx
const [selectedCategory, setSelectedCategory] = useState<string>(null);
const [markers, setMarkers] = useState<Marker[]>([]);
```

* Recarga marcadores al cambiar categoría o limpiar búsqueda.

---

## 🔗 Arquitectura & Conexión Backend

### AuthContext & AuthProvider

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AUTH_USER, db } from '../Firebase/initializeApp';

interface AuthContextType {
  authUser: User | null;
  currentUserData: any;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado y lógica para authUser y currentUserData
};
export const useAuthContext = () => useContext(AuthContext);
```

### Hooks Personalizados

#### useRequestLocationPermission

```ts
export const useRequestLocationPermission = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const getLocation = async () => {
    // navigator.geolocation o Capacitor Geolocation
  };
  return { location, getLocation };
};
```

#### UseOpenWeather

```ts
import axios from 'axios';
export const useOpenWeather = () => {
  const { currentUserData } = useAuthContext();
  const { lat, lng } = currentUserData.location;
  const [weather, setWeather] = useState<any>(null);
  useEffect(() => {
    if (!lat) return;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_API_KEY_OPEN_WEATHER}`)
      .then(res => setWeather(res.data));
  }, [lat, lng]);
  return { weather };
};
```

### Conexión a Backend

```ts
import axios from 'axios';
import { VITE_LINK_FIREBASE_FUNCTIONS } from '../config/config';
export const connection = axios.create({ baseURL: VITE_LINK_FIREBASE_FUNCTIONS });
```

* Usar `connection.post('/send/request/ai', payload)` para IA.

---

## 🚧 Protección de Rutas

**ProtectedRoute.tsx**:

```tsx
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/UserContext';

interface ProtectedRouteProps extends RouteProps { publicOnly?: boolean; }
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, publicOnly = false, ...rest }) => {
  const { authUser, currentUserData } = useAuthContext();
  return (
    <Route {...rest} render={({ location }) => {
      if (publicOnly && authUser && currentUserData.verified) {
        return <Redirect to="/tab/home" />;
      }
      if (!publicOnly && !authUser) {
        return <Redirect to="/" state={{ from: location }} />;
      }
      return children;
    }} />
  );
};
export default ProtectedRoute;
```

---

## 📁 Estructura de Carpetas

```
src/
├── components/             # Componentes React e Ionic
├── context/                # AuthContext y providers
├── hooks/                  # Hooks personalizados
├── functions/              # Lógica de negocio (wizardSteps, hasNameCompleted)
├── Firebase/               # Inicialización de Firebase (initializeApp.ts)
├── config/                 # Configuraciones y endpoints
├── pages/                  # Páginas (Home, Wizard, RoomWaiting, etc.)
├── styles/                 # CSS Modules y archivos .css
└── assets/                 # Imágenes y GIFs para demos
```

---

## 🤝 Contribuciones

¡Contribuye con mejoras, reporta issues o envía PRs! 🙌

---

## 📄 Licencia

[MIT](LICENSE) © Joel Mera
