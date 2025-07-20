import { useEffect, useRef, useState } from "react";
import "../styles/Home.css";
import { IonContent, IonPage } from "@ionic/react";
import ModalProfile from "../components/ModalProfile";
import SearchBar from "../components/SearchBar";
import ListCategories from "../components/ListCategories";
import WeatherCard from "../components/WeatherCard";
import Map from "../components/Map";
import { useAchievements } from "../hooks/UseAchievements";
const Home: React.FC = () => {
 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { unlockAchievement, AchievementPopup, isAchievementUnlocked } = useAchievements();
  // const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placeMarkers, setPlaceMarkers] = useState<google.maps.Marker[]>([]);
  const [shouldRefocus, setShouldRefocus] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLIonSearchbarElement>(null);

  useEffect(() => {
    if (!isAchievementUnlocked("welcome")) {
      unlockAchievement("welcome");
    }
  }, [isAchievementUnlocked, unlockAchievement]);

  const handleSearchClear = () => {
    setShouldRefocus(true);
  };
  return (
    <IonPage>
      {AchievementPopup}
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

          <div className="floating-header">
            <SearchBar
              setIsModalOpen={setIsModalOpen}
              searchInputRef={searchInputRef}
              onClear={handleSearchClear}
            />
          </div>

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
