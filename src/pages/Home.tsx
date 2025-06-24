import { useEffect, useRef, useState } from "react";
import "../styles/Home.css";
import {
  IonContent,
  IonHeader,
  IonPage,
  useIonRouter,
} from "@ionic/react";
import { GoogleMap } from '@capacitor/google-maps';
import ModalProfile from "../components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import { useAuthContext } from "../context/UserContext";
import { VITE_API_KEY_GOOGLE } from "../config/config";
import ListCategories from "../components/ListCategories";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";

const Home: React.FC = () => {
  const router = useIonRouter();
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUserData } = useAuthContext();
  const location = currentUserData?.location;

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<GoogleMap>();

  useEffect(() => {
    if (!mapRef.current || !location) return;

    GoogleMap.create({
      id: 'home-map',
      element: mapRef.current,
      apiKey: VITE_API_KEY_GOOGLE,
      config: {
        center: { lat: location.lat, lng: location.lng },
        zoom: 20,
        disableDefaultUI: false,
        clickableIcons: true,
        disableDoubleClickZoom: false,
        draggable: true,
        keyboardShortcuts: false,
        scrollwheel: true,
        zoomControl: true,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ]
      },
    }).then(createdMap => {
      setMap(createdMap);

      createdMap.addMarker({
        coordinate: { lat: location.lat, lng: location.lng },
        title: 'Tu ubicación',
        snippet: 'Estás aquí',
      });
    });

    return () => {
      if (map) {
        map.destroy();
      }
    };
  }, [location]);

  const handleLogout = async () => {
    showLoading("Cerrando sesión...");
    try {
      await signOut(AUTH_USER);
      await hideLoading();
      router.push("/", "root", "replace");
    } catch (error) {
      console.error(error);
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding" fullscreen>
        <div className="map-container">
          <div
            ref={mapRef}
            className="full-screen-map"
          />
          <IonHeader className="floating-header">
            <SearchBar setIsModalOpen={setIsModalOpen} />
          </IonHeader>
          <ListCategories />
        </div>
        <WeatherCard />
        <ModalProfile
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;