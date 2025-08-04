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
---
## 📁 Estructura de Carpetas

```src/
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

# 📘Traducción con Ionic + React

## 🎯 Objetivo

Permitir al usuario cambiar el idioma de toda la app entre **español** e **inglés**, de forma **dinámica, persistente y sin recargar** la aplicación.

---

## 🧰 Tecnologías y Librerías

| Herramienta                        | Propósito                           |
| ---------------------------------- | ----------------------------------- |
| `i18next`                          | Motor de traducciones               |
| `react-i18next`                    | Integración de i18next con React    |
| `i18next-browser-languagedetector` | Detecta el idioma del navegador     |
| `@capacitor/preferences`           | Guarda el idioma elegido localmente |

---

## 🔧 Instalación

Ejecuta en la raíz del proyecto:
- Puede ser en la cmd o en la consola de vscode

```bash
npm install i18next react-i18next i18next-browser-languagedetector @capacitor/preferences
```

---

## 📁 Actualiza tu Estructura Estructura de Carpetas y Agrega lo siguiente:

```
src/
├── context/
│   └── LanguageContext.tsx
├── locales/
│   ├── en/
│   │   └── translation.json
│   └── es/
│       └── translation.json
├── config/
|    └── i18n.ts
```

---

## 🗂️ Paso 1: Agregra Archivos de Traducción
- Aqui podras agregar todas las clave valor para la traducción de toda tu app

### `src/locales/en/translation.json`

```json
{
  "settings": "Settings",
  "language": "Language",
  "theme": "Theme",
  "logout": "Log out",
  "notifications": "Notifications",
  "activity": "Your Activity",
  "favorites": "Favorites",
  "saved": "Saved",
  "history": "History",
  "help": "Help & Support",
  "legal": "Legal",
  "privacy": "Privacy Policy",
  "terms": "Terms and Conditions",
  "profile_info": "Profile Information",
  "app_info": "About the App"
}
```

### `src/locales/es/translation.json`

```json
{
  "settings": "Ajustes",
  "language": "Idioma",
  "theme": "Tema",
  "logout": "Cerrar sesión",
  "notifications": "Notificaciones",
  "activity": "Tu Actividad",
  "favorites": "Favoritos",
  "saved": "Guardados",
  "history": "Historial",
  "help": "Ayuda y Soporte",
  "legal": "Legal",
  "privacy": "Política de Privacidad",
  "terms": "Términos y Condiciones",
  "profile_info": "Información del perfil",
  "app_info": "Información de la app"
}
```

---

## ⚙️ Paso 2: Configuración de `i18n.ts`

```ts
// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationES from './locales/es/translation.json';
import translationEN from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: translationES },
      en: { translation: translationEN },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

## 🌍 Paso 3: Crear el Contexto de Idioma

```tsx
// src/context/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import i18n from "../i18n";

type LanguageContextType = {
  currentLang: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("es");

  useEffect(() => {
    const loadLang = async () => {
      const stored = await Preferences.get({ key: "app_language" });
      const lang = stored.value || "es";
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    };
    loadLang();
  }, []);

  useEffect(() => {
    i18n.changeLanguage(currentLang);
  }, [currentLang]);

  const changeLanguage = async (lang: string) => {
    await Preferences.set({ key: "app_language", value: lang });
    setCurrentLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return context;
};
```
---
- Si deseas que detecte automaticamente el idioma al momento que el usuario acceda por primera vez a la app solo agrega este useEffect

```
useEffect(() => {
    const loadLang = async () => {
      const stored = await Preferences.get({ key: "app_language" });

      // Detectar idioma del navegador si no hay uno guardado
      const browserLang = navigator.language.startsWith("es") ? "es" : "en";
      
      const lang = stored.value || browserLang;
      
      if (!stored.value) {
        console.log(`[Idioma detectado automáticamente]: ${browserLang}`);
      }
      
      setCurrentLang(lang);
      i18n.changeLanguage(lang);
    };
    
    loadLang();
  }, []);
```
---

## 🧩 Paso 4: Envolver tu App

```tsx
// main.tsx o App.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n';
import { LanguageProvider } from './context/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
```

---

## 🌐 Paso 5: Usar traducciones en tus componentes
- Este paso siempre lo repetiras en cada uno de tus componentes

```tsx
import { useTranslation } from "react-i18next";

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <IonTitle>{t("settings")}</IonTitle>
      <IonLabel>{t("language")}</IonLabel>
      <IonLabel>{t("logout")}</IonLabel>
    </>
  );
};
```

---

## 🎛️ Paso 6: Implementar el selector de idioma (ej. modal o IonSelect)

```tsx
import { useLanguage } from "../context/LanguageContext";

const { changeLanguage, currentLang } = useLanguage();

<IonSelect
  value={currentLang}
  interface="popover"
  onIonChange={(e) => changeLanguage(e.detail.value)}
>
  <IonSelectOption value="es">Español</IonSelectOption>
  <IonSelectOption value="en">English</IonSelectOption>
</IonSelect>
```

---

## ✅ Resultado Esperado

| Funcionalidad                        | Estado |
| ------------------------------------ | ------ |
| Traducción dinámica                  | ✅      |
| Persistencia del idioma al reiniciar | ✅      |
| Cambios reflejados en toda la app    | ✅      |
| Sin recarga de página                | ✅      |

---

## 📌 Buenas prácticas

* Usa claves significativas (`"settings"`, `"logout"`, etc.).
* No pongas textos en duro (`"Cerrar sesión"`), siempre usa `t("logout")`.
* Si usas modales, asegúrate que los textos también se traduzcan dinámicamente.

---

## 🏘 Community Component

*Archivo:* src/pages/Community.tsx

### Descripción

El componente Community muestra un feed vertical de publicaciones (posts) de la colección Firestore posts, permitiendo:

* Navegar por publicaciones con un slider vertical (Swiper).
* Reproducir y pausar videos al deslizar y hacer clic.
* Silenciar o habilitar audio de videos.
* Ver información del autor y contenido (texto, hashtags, música).
* Dar "like", comentar y compartir publicaciones.
* Abrir un modal para crear nueva publicación.

### Funcionalidades Principales

| Función / Hook        | Uso                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------- |
| useState            | Gestiona estados: posts, isLoading, mutedMap, pausedMap, overlayMap, etc. |
| useEffect           | Suscripción en tiempo real a Firestore (onSnapshot), carga inicial de posts.    |
| useRef              | Referencias a elementos <video> para controlar reproducción y audio.              |
| Swiper              | Renderiza el feed vertical; control de cambio de slide con onSlideChange.         |
| IonIcon, IonBadge | Íconos y badges para acciones (like, comment, share) y contadores.                  |
| useToast            | Mostrar notificaciones contextualizadas.                                            |

### Estructura de Estado

```ts
interface CommunityState {
  posts: PostData[];               // Lista de publicaciones ordenadas por timestamp
  isLoading: boolean;              // Indicador de carga
  mutedMap: Record<string, boolean>;   // Mapa de silenciado por postId
  pausedMap: Record<string, boolean>;  // Mapa de pausa por postId
  overlayMap: Record<string, { icon: any; visible: boolean }>; // Overlay de play/pause
  activeIndex: number;             // Índice de la slide activa
}
```

---

## ➕ CreatePostModal Component

*Archivo:* src/components/CreatePostModal.tsx

### Descripción

Modal para crear nuevas publicaciones, soporta:

* Texto con límite de caracteres y contador.
* Adjuntar imagen o video (drag-and-drop o selector de archivos).
* Conversión de imágenes a WebP.
* Subida a Firebase Storage y obtención de URL.
* Extracción de hashtags y contenido textual.
* Envío de documento a Firestore en la colección POSTS/{uid}/posts.

### Props

```ts
interface CreatePostModalProps {
  isOpen: boolean;         // Control de visibilidad del modal
  onClose: () => void;     // Callback al cerrar el modal
}
```

### Hooks y Flujo

1. *Previsualización de archivo*: useEffect genera URL con URL.createObjectURL.
2. *Validaciones*:

   * Tamaño máximo: 5MB.
   * Tipo de archivo: image/* o video/*.
   * Conteo máximo de caracteres: 600.
3. *Conversión a WebP* (si es imagen) mediante convertToWebP.
4. *Subida*: uploadBytes y getDownloadURL de Firebase Storage.
5. *Storage de publicación*:

```ts
   await setDoc(doc(postsRef, postId), {
     post: postData,
     c: serverTimestamp(),
     id: postId,
     uid: currentUserData.uid,
   })
```
6. *Notificaciones*: showToast para estados de éxito y error.

---

## 💬 ModalComments Component

*Archivo:* src/components/ModalComments.tsx

### Descripción

Modal para visualizar y añadir comentarios a una publicación:

* Lista de comentarios existentes con avatar, usuario y timestamp.
* Campo de texto para escribir nuevo comentario (hasta 500 caracteres).
* Envío de comentario a Firestore con updateDoc y arrayUnion.

### Props

```ts
interface ModalCommentsProps {
  post: PostData;        // Datos de la publicación (incluye `post.comments`)
  isOpen: boolean;       // Control de visibilidad del modal
  onClose: () => void;   // Callback al cerrar el modal
}
```

### Flujo

1. Cargar lista de comentarios de post.post.comments (prop).
2. Renderizar cada comentario en un IonCard:

   * Avatar (c.p), nombre (c.n), texto (c.txt) y tiempo (getTimeAgo).
3. Al enviar:

   * Validar texto no vacío.
   * Construir objeto comment con id, p, n, txt, c.
   * updateDoc(docRef, { 'post.comments': arrayUnion(comment) }).
   * Mostrar toast y limpiar campo de texto.

---

Con esto se documenta la lógica y estructura de los componentes Community, CreatePostModal y ModalComments en la aplicación RoadMap.

---
## 📅 GoogleCalendarAuth Component

*Archivo:* src/components/GoogleCalendarAuth.tsx

### Descripción

GoogleCalendarAuth gestiona el flujo de OAuth para vincular Google Calendar:

1. *Intro*: Presenta beneficios y pasos del enlace.
2. *Permisos*: Lista y acepta términos y políticas.
3. *Loading*: Indica el progreso de autenticación.
4. *Success/Error*: Muestra estado final y notifica resultados.

### Props

```ts
interface GoogleCalendarAuthProps {
  onClose?: () => void;       // Callback al cerrar el modal o componente
  onAuthSuccess?: () => void; // Callback tras éxito de autenticación
}
```

### Estado Interno

```ts
interface AuthState {
  currentStep: 'intro' | 'permissions' | 'loading' | 'success';
  isLoading: boolean;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}
```

### Hooks y Lógica

* useQuery(): Extrae parámetros success o error de la URL.
* useEffect en montaje: Detecta si la redirección devuelve ?success=true o ?error=..., actualiza currentStep y dispara showToast y onAuthSuccess.
* handleGoogleAuth(): Valida checkboxes y currentUserData.uid, cambia a paso loading y redirige a la URL de función en Firebase Functions:

```ts
  window.location.href = `${VITE_LINK_FIREBASE_FUNCTIONS}/start-oauth?userId=${encodeURIComponent(uid)}`;

```

* Renderizado de cada paso con funciones renderIntroStep, renderPermissionsStep, renderLoadingStep, renderSuccessStep.
* Componentes Ionic: IonPage, IonContent, IonCard, IonButton, IonCheckbox, IonSpinner, etc.

---

## 🗓 Event Component

*Archivo:* src/pages/Event.tsx

### Descripción

Componente Event permite al usuario ver, editar y eliminar sus eventos sincronizados con Google Calendar:

* Lista eventos desde currentUserData.events.
* Edita campos: título, descripción, fecha, hora y duración.
* Borra eventos llamando a un endpoint de Functions y actualizando Firestore.

### Estructura de Estado

```ts
interface EditData {
  date: string;
  time: string;
  duration: string;
  description: string;
  summary: string;
}
```

- Interfaz

```
interface EventState {
  events: Event[];
  editingId: string | null;
  editData: EditData;
}
```

### Flujo de Datos

1. *Carga Inicial*: useEffect asigna currentUserData.events a events.
2. *Eliminar Evento*:

   * handleDelete(eventId): Hace POST a /deleteCalendarEvent, luego updateDoc con arrayRemove en Firestore.
3. *Editar Evento*:

   * startEditing(event): Activa el modo edición y precarga editData.
   * Formulario con IonInput, IonTextarea, IonDatetimeButton/IonDatetime, IonSelect.
   * handleUpdate(eventId): PUT a /updateCalendarEvent con nuevos datos y muestra toast.
   * cancelEditing(): Sale del modo edición.
4. *Renderizado*: Muestra tarjeta normal o formulario de edición según editingId.

---

## 🌐 Discover Component

*Archivo:* src/pages/Discover.tsx

### Descripción

Discover organiza y muestra lugares cercanos guardados, genera recomendaciones inteligente y permite programar eventos:

* *Categorización*: Agrupa places por tipo (restaurant, park, etc.) usando organizeByCategories.
* *Distancia*: Calcula distancia al usuario via geolib.
* *Recomendaciones*: Filtra, ordena y muestra lugares destacados; abre modal con recomendaciones.
* *Programar Eventos*: Interactúa con Google Calendar (requiere token), permite detalles y guarda evento en Firestore y Functions.

### Tipos Clave

```ts
type SavedPlace = { geometry: { location: { lat: number; lng: number } }; name: string; place_id: string; types: string[]; rating?: number; vicinity: string; distance?: number; photoUrl?: string; user_ratings_total?: number; };
type PlaceCategory = { title: string; places: SavedPlace[]; icon: string; };
```

### Estado y Refs

```ts
interface DiscoverState {
  places: SavedPlace[];
  categories: PlaceCategory[];
  userLocation: { lat: number; lng: number } | null;
  recommendationAi: SavedPlace[] | null;
  selectedPlace: SavedPlace | null;
  showModal: boolean;
  showEventModal: boolean;
  generating: boolean;
}
const carouselRefs = useRef<Record<string, HTMLDivElement>>({});
```

### Hooks y Flujos

1. *Inicialización* (useEffect):

   * Preferences.get('saved_nearby_places') para cargar lugares.
   * navigator.geolocation para obtener posición y calcular distancias.
2. *Organización por Categorías* (organizeByCategories): mapea tipos a nombres e íconos, conserva lugares únicos.
3. *Desplazamiento del Carrusel* (scrollCarousel).
4. *Generar Recomendaciones* (handleCreateRecommendation): filtra por rating y categoría, guarda en recommendationAi y abre modal.
5. *Programación de Eventos* (openEventModal, saveEvent): valida token de Google, llama a /manage-calendar, guarda en USERS/{uid}.ev.
   
---

Esta ampliación cubre los componentes de autenticación de calendario, gestión y edición de eventos, descubrimiento interactivo de lugares y demás funcionalidades sociales.

---
## 🤝 Friends Component

*Archivo:* src/pages/Friends.tsx

### Descripción

Friends muestra la lista de seguidores (followers) del usuario actual, permitiendo:

* Ver avatar y nombre de cada amigo.
* Navegar al perfil de un amigo.
* Dejar de seguir (unfollow) y actualizar lista.
* Acceder al chat para enviar mensajes.

### Hooks y Estado

```ts
const friends: Friend[] = Array.isArray(currentUserData?.followers)
  ? currentUserData.followers
  : [];
```

* useAuthContext() para obtener currentUserData.followers.
* useIonRouter() para navegación (router.push).
* useToast() para mostrar notificaciones.

### Funciones Principales

* handleProfileClick(uid): Redirige a /profile/{uid}.
* handleUnFollowing(friendUid, name): Llama a removeFriend y muestra toast.
* NavigateToChats(): Navega al componente de chats.

### Renderizado

* Si friends.length > 0, mapea y renderiza tarjetas con:

  * Avatar (friend.pt o avatar por defecto).
  * Nombre (friend.n).
  * Botón de "Dejar de seguir".
  * Botones para "Mensaje" y "Ver perfil".
* Si no hay amigos, muestra estado vacío con ícono y mensaje.

---

## 💬 Chats Component

*Archivo:* src/pages/Chats.tsx

### Descripción

Chats gestiona grupos de chat y mensajes en tiempo real:

* Carga, crea y une grupos.
* Muestra lista de seguidores para iniciar chats.
* Suscribe a Firestore para recibir actualizaciones de grupos y mensajes.
* Permite envío de mensajes en grupos seleccionados.

### Estado y Hooks

```ts
const [groups, setGroups] = useState<Group[]>([]);
const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [followers] = useState<Follower[]>(currentUserData?.followers || []);
```

* useEffect 1: Suscripción onSnapshot a colección CHATS para cargar grupos.
* useEffect 2: Al cambiar selectedGroup, suscribe a CHATS/{id}/MESSAGES, ordenados por timestamp.
* useToast() para notificaciones.
* generateUUID() para códigos de grupo.

### Funciones

* createGroup(): Crea un nuevo documento en CHATS con name, admin, code, members.
* joinByCode(): Busca grupo por code, agrega solicitud en campo requests.
* Navegación entre tutoriales: abrir modal showGroupModal con tipos create o join.

### Renderizado

* Cabecera con icono de chats y botón de opciones.
* Popup de opciones para crear o unirse a grupo.
* Modal para creación/unión de grupos.
* Componente Chat para mostrar selectedGroup y messages.
* Secciones:

  * Amigos (followers) con slider horizontal.
  * Mis Grupos (user groups) con tarjetas. Muestra estado de carga y estado vacío.

---

## ❤ Favorite Component
- Estas mis funcionalidad tienen  los comopoentes History(Histrorial del Usuario) y Saved (Guardadios por parte dek Usuario).

*Archivo:* src/pages/Favorite.tsx

### Descripción

Favorite permite listar y eliminar lugares favoritos del usuario:

* Mostrar lista de favoritos con ubicación y descripción.
* Activar modo de selección para eliminar múltiples favoritos.
* Confirmar o cancelar eliminación.

### Estado y Hooks

```ts
const [isDeleteAll, setIsDeleteAll] = useState<string[]>([]);
const [OnConfirm, setOnConfirm] = useState(false);
const [onCancel, setOnCancel] = useState(false);
const [btnAction, setBtnAction] = useState(true);
```

* useAlert() para cuadros de diálogo de confirmación.
* useTranslation() para textos internacionales.

### Funciones

* handleRemoveFavorite(): Entra en modo selección y preselecciona todos los IDs.
* handleSelectFavorite(id, checked): Añade o quita IDs del array isDeleteAll.
* ConfirmDeletFavorites(): Filtra y actualiza Firestore con updateDoc(ref, { fav: filteredFavorites }) y muestra alerta.
* CalcelDeletFavorites(): Sale de modo selección sin cambios.

### Renderizado

* Cabecera con contador y botón "Eliminar todo".
* Si no hay favoritos, muestra estado vacío.
* Lista de IonItem con nombre, ubicación y IonCheckbox en modo selección.
* Botones de confirmar y cancelar aparecen dinámicamente.

---

## 🧩 ModalProfile

### 📄 Descripción

`ModalProfile` es un componente modal que muestra la información principal del perfil de usuario, incluyendo avatar, nombre, correo electrónico y botones para editar perfil y ver privacidad.

### ⚙️ Props (`ModalProfileProps`)

```ts
export interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### 🧠 Lógica

* Se renderiza como `IonModal` cuando `isOpen` es `true`.
* Muestra datos de `currentUserData` (extraídos del contexto de autenticación).
* Ofrece navegación a edición de perfil (`EditProfile`) y a configuración de privacidad (`ModalPrivacy`).

### 🌐 Traducción

Usa `i18next` con `t()` para todos los textos como:

* `t('profile.title')`, `t('profile.edit')`, `t('profile.logout')`.

---

## 🔐 ModalPrivacy

### 📄 Descripción

`ModalPrivacy` es un modal donde el usuario puede ajustar su configuración de privacidad, como ubicación, actividad o visibilidad del perfil.

### ⚙️ Props (`ModalProfileProps`)

```ts
export interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
```

### 🧠 Lógica

* Utiliza `IonModal` y escucha cambios en `isOpen`.
* Ofrece switches (`IonToggle`) para ajustar configuraciones booleanas.
* Guarda preferencias directamente en Firebase o localStorage (según implementación).

### 🌐 Traducción

Todas las etiquetas y opciones están internacionalizadas:

* Ej: `t('privacy.shareLocation')`, `t('privacy.hideProfile')`.

---

## ✏️ EditProfile

### 📄 Descripción

`EditProfile` permite al usuario editar varios campos del perfil como nombre, biografía, género, fecha de nacimiento, etc.

### ⚙️ Props (`ModalEditInfoProfileProps`)

```ts
export interface ModalEditInfoProfileProps {
  isOpen: boolean;
  onClose: () => void;
  info: EditingObjectType;
  setInfo: React.Dispatch<React.SetStateAction<EditingObjectType>>;
}
```

### 🧠 Lógica

* Se abre desde `ModalProfile`.
* Cada sección editable se muestra como botón que abre un `ModalEditInfoProfile` dinámico.
* Usa el objeto `info` para indicar qué campo se va a editar.

### 🧩 Dependencias

* `ModalEditInfoProfile`
* `LocationSelector` (para campos tipo ubicación)

### 🌐 Traducción

Utiliza `t()` para los textos de etiquetas y botones como:

* `t('editProfile.title')`, `t('editProfile.gender')`, etc.

---

## 🛠 ModalEditInfoProfile

### 📄 Descripción

`ModalEditInfoProfile` es un modal reutilizable para editar un campo específico del perfil. Puede mostrar inputs, selects, textarea o componentes personalizados como `LocationSelector`.

### ⚙️ Props (`ModalEditInfoProfileProps`)

```ts
export interface ModalEditInfoProfileProps {
  isOpen: boolean;
  onClose: () => void;
  info: EditingObjectType;
  setInfo: React.Dispatch<React.SetStateAction<EditingObjectType>>;
}
```

### 🧠 Lógica

* Se construye de forma dinámica a partir del objeto `info`.
* Guarda cambios en Firestore directamente al hacer clic en "Guardar".
* Si el campo es de tipo `"location-text"` renderiza el componente `LocationSelector`.

### 🧩 Dependencias

* `LocationSelector`
* `i18next` para traducción
* Firebase (`updateDoc`, `getDoc`, `doc`)

### 📋 Tipo de campo (`EditingObjectType`)

```ts
export type SafeFieldType = TextFieldTypes | "select" | "textarea" | "location-text";

export type OptionType = {
  label: string;
  value: string;
};

export interface EditingObjectType {
  initialBreakpoint: number;
  breakpoints: number;
  title: string;
  label?: string;
  label2?: string;
  placeholder: string;
  placeholder2: string;
  type: SafeFieldType;
  result1?: string;
  result2?: string;
  options?: OptionType[];
  name: string;
}
```
---
### 🌐 Traducción

Ejemplo de uso en los títulos, etiquetas y botones:

* `t(info.title)`, `t(info.label)`, `t('buttons.save')`, etc.

---
## 🛠️ `Setting.tsx` - Pantalla de Configuración

Esta pantalla centraliza las opciones de usuario como tema, idioma, historial, soporte y cuenta.

### Componente principal

```tsx
const Setting: React.FC = () => { ... }
```

### Props:

No recibe props externas.

### Funcionalidades:

* Navegación usando `useIonRouter`.
* Cambio de idioma mediante `useTranslation`.
* Alternancia de tema claro/oscuro con `useDarkMode`.
* Cierre de sesión usando `signOut` (Firebase).
* Apertura de dos modales:

  * `ModalProfile` para editar el perfil.
  * `ModalOptionSetting` para cambiar idioma o tema.

---

### 🧩 Interfaces relacionadas

```ts
export interface SettingObjectType {
  initialBreakpoint: number;
  breakpoints: number;
  title: string;
  subtitle: string;
  options: {
    icon: string;
    label: string;
    value: string;
    action?: () => void;
  }[];
  isLanguage: boolean;
}
```

---

## ⚙️ `ModalOptionSetting.tsx` - Modal de Preferencias

Este modal se reutiliza para cambiar tema o idioma. Está controlado por el estado `SettingObjectType`.

### Componente principal

```tsx
const ModalOptionSetting: React.FC<ModalOptionSettingProps> = ({ isOpen, onClose, info }) => { ... }
```

### Props (`ModalOptionSettingProps`):

```ts
export interface ModalOptionSettingProps {
  isOpen: boolean;
  onClose: () => void;
  info: SettingObjectType;
}
```

### Funcionalidades:

* Muestra opciones dinámicas con acción opcional.
* Cambia el idioma si `info.isLanguage === true`.
* Marca la opción seleccionada.

---

## 👤 `ModalProfile.tsx` (mencionado)

Se abre desde la sección “Tu cuenta” del componente `Setting`.

### Props esperadas (según uso):

```ts
export interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 📞 `Soporte.tsx` - Pantalla de Ayuda y Preguntas Frecuentes

Muestra:

* Preguntas frecuentes agrupadas por sección.
* Opción de contacto por correo.
* Link a una guía.

### Componente principal

```tsx
const Soporte: React.FC = () => { ... }
```

### Props:

No recibe props externas.

### Funcionalidades:

* Traducción de contenido usando `react-i18next`.
* Uso de `IonAccordion` para desplegar secciones.
* Lectura de preguntas desde un objeto externo: `FAQsObject`.

---

### 📦 Objeto FAQ (usado en `Soporte.tsx`)

```ts
type FAQsSection = {
  title: string;
  subtitle: string;
  list: {
    question: string;
    answer: string;
  }[];
}

export const FAQsObject: Record<string, FAQsSection> = { ... };
```

> 🔗 Este objeto debe estar en `../other/FAQsObject.ts`.

---

# Dark Mode Context y CSS

## 📁 Archivo: `DarkModeContext.tsx`

### Propósito

Proveer un contexto React que permita gestionar el modo oscuro (dark mode) en toda la aplicación, con persistencia local y sincronización con el sistema operativo.

---

### Código clave

```tsx
// Importaciones
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences'; // Persistencia local en dispositivo

// Creación del contexto con tipo específico
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Proveedor del contexto que envuelve la app
export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  // Función para aplicar o quitar clase y guardar preferencia
  const applyTheme = useCallback(async (mode: boolean) => {
    const method = mode ? 'add' : 'remove';
    document.body.classList[method]('dark-mode'); // Agrega o quita clase CSS
    await Preferences.set({ key: 'darkMode', value: String(mode) }); // Guarda en storage
    setDarkMode(mode);
  }, []);

  // Al montar, carga la preferencia guardada o detecta sistema
  useEffect(() => {
    const loadPreference = async () => {
      const { value } = await Preferences.get({ key: 'darkMode' });
      if (value !== null) {
        applyTheme(value === 'true');
      } else {
        // Si no hay preferencia, detecta la preferencia del sistema operativo
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
      }
    };
    loadPreference();
  }, [applyTheme]);

  // Escucha cambios en la preferencia del sistema y actualiza si el usuario no tiene preferencia guardada
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = async (event: MediaQueryListEvent) => {
      const { value } = await Preferences.get({ key: 'darkMode' });
      if (value === null) {
        applyTheme(event.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [applyTheme]);

  // Funciones para toggle, activar y desactivar modo oscuro
  const toggleDarkMode = () => applyTheme(!darkMode);
  const enableDarkMode = () => applyTheme(true);
  const disableDarkMode = () => applyTheme(false);

  // Context provider entrega estado y funciones
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, enableDarkMode, disableDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook personalizado para consumir el contexto en cualquier componente
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe usarse dentro de un DarkModeProvider');
  }
  return context;
};
```

---

### Descripción del flujo

* El contexto guarda un booleano `darkMode` que indica si el modo oscuro está activo.
* Cuando cambia, aplica o elimina la clase CSS `dark-mode` en el `<body>`.
* La preferencia se guarda usando Capacitor Preferences para persistirla en el dispositivo.
* Al cargar la app, recupera la preferencia y si no existe, detecta la preferencia del sistema operativo.
* Escucha eventos para detectar cambios en el sistema operativo y aplicar la preferencia si el usuario no estableció una.
* Proporciona funciones para activar, desactivar o alternar modo oscuro.
* El hook `useDarkMode` permite que cualquier componente acceda a esta lógica.

---

## 📁 Archivo: `dark-mode.css`

### Propósito

Definir las variables CSS y estilos específicos para el modo oscuro, aplicados cuando el `body` tiene la clase `.dark-mode`.

---

### Variables y estilos destacados

```css
body.dark-mode {
  --ion-background-color: #121212;      /* Fondo oscuro */
  --ion-text-color: #e0e0e0;            /* Texto claro */
  --ion-color-primary: #4caf50;         /* Color primario (verde) */
  --ion-color-secondary: #66bb6a;       /* Color secundario */
  
  /* Tonos de grises oscuros para sombras y fondo */
  --ion-color-step-50: #2a2a2a;
  --ion-color-step-100: #252525;
  /* ... hasta --ion-color-step-900 */
  
  color: var(--ion-text-color);
  background: var(--ion-background-color);
}

/* Ejemplo: item seleccionado en modo oscuro */
.dark-mode .option-selected-setting {
  --background: var(--co-gray); /* gris suave */
}

/* Botones y textos */
.dark-mode .btn-edit-profile,
.dark-mode .apply-button {
  --background: var(--primary-color);
  --color: var(--Texto-primario);
  --box-shadow: 2px 2px var(--co-gray);
}

/* Fondos generales */
.dark-mode .tema-oscuro,
.dark-mode .tema-oscuro2 {
  background-color: var(--tema-oscuro) !important;
}

/* Texto con colores según jerarquía */
.dark-mode .texto-primario { color: var(--Texto-primario) !important; }
.dark-mode .texto-quinto { color: var(--color-btns) !important; }
.dark-mode .iconos-oscuros { color: var(--color-btns); }

/* IonDatetime estilo para día activo */
.dark-mode ion-datetime::part(calendar-day-active) {
  color: #4caf50 !important;
  border: 1px solid #4caf50;
  border-radius: 50%;
  font-weight: bold;
}

/* Modales con fondo translúcido y texto claro */
.dark-mode .modal-edit-profile,
.dark-mode .modal-profile,
.dark-mode .modal-privacy,
.dark-mode .modal-setting-options {
  --background: rgba(18, 18, 18, 0.9);
  backdrop-filter: blur(12px);
  color: var(--Texto-primario) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease-in-out;
}

/* Barra de búsqueda estilo oscuro */
.dark-mode .modern-searchbar {
  --color: var(--Texto-primario) !important;
  --background: var(--co-back-gray-8);
  --placeholder-color: var(--Texto-primario) !important;
  --icon-color: var(--Texto-secundario);
  --clear-button-color: var(--Texto-secundario);
}

/* Tab bar fondo oscuro */
.dark-mode .tab {
  background: var(--co-back-gray-8);
}
```

---

### Resumen de estilos

* Se usan variables CSS para mantener consistencia en colores oscuros.
* Se estilizan backgrounds, textos, iconos, botones, modales y otros componentes con colores adecuados para modo oscuro.
* Se agregan efectos visuales como desenfoque en modales para mejor experiencia.
* IonDatetime y otros componentes de Ionic reciben estilos específicos para que encajen con tema oscuro.

---

# Cómo se integra en la app

* El contexto `DarkModeProvider` envuelve tu app en el componente raíz (por ejemplo, en `App.tsx`).
* El CSS `dark-mode.css` se carga globalmente.
* Al activar modo oscuro, el contexto añade la clase `.dark-mode` al `<body>`.
* Las variables CSS y reglas bajo `.dark-mode` se aplican automáticamente a tus componentes.
* Puedes cambiar el tema desde cualquier parte de la app usando el hook `useDarkMode`.

---

# Documentación del Back-End donde esta alojado el algoritmo que integra la Api de DeepSeek AI para ejecutrar la logica de recomendación mediantes las preferencias del usuario recopiladas en el wizard que se muestra al registrarse por primera vez 

https://app.swaggerhub.com/apis/salomeloor-7d5/MiApiDocumentationRoadMap/1.0.0


---
## 📄 Licencia

[MIT](LICENSE) © Joel Mera
