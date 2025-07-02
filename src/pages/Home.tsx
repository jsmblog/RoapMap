import { useRef, useState } from "react";
import "../styles/Home.css";
import { IonContent, IonHeader, IonPage, useIonRouter } from "@ionic/react";
import ModalProfile from "../components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import SearchBar from "../components/SearchBar";
import ListCategories from "../components/ListCategories";
import WeatherCard from "../components/WeatherCard";
import Map from "../components/Map";

const Home: React.FC = () => {
  const router = useIonRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [placeMarkers, setPlaceMarkers] = useState<google.maps.Marker[]>([]);
  const [shouldRefocus, setShouldRefocus] = useState<boolean>(false); 
  
const handleSearchClear = () => {
  setShouldRefocus(true); 
};


  const searchInputRef = useRef<HTMLIonSearchbarElement>(null);
  const handleLogout = async () => {
    showLoading("Cerrando sesión...");
    try {
      await signOut(AUTH_USER);
      await hideLoading();
      router.push("/", "root", "replace");
    } catch {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-no-padding" fullscreen scrollEvents={false}>
        <div className="map-container">
          <Map
  searchInputRef={searchInputRef}
  selectedCategory={selectedCategory}
  placeMarkers={placeMarkers}
  setPlaceMarkers={setPlaceMarkers}
  shouldRefocus={shouldRefocus}
  setShouldRefocus={setShouldRefocus}
  
/>

          <IonHeader className="floating-header">
            <SearchBar
              setIsModalOpen={setIsModalOpen}
              searchInputRef={searchInputRef}
              onClear={handleSearchClear}
            />
          </IonHeader>

          <ListCategories
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
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
