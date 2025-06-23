import { useEffect, useState } from "react";
import "../styles/Home.css";
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonList,
  IonPage,
  IonSearchbar,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import ModalProfile from "../components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import { UseOpenWeather } from "../hooks/UseOpenWeather";
import { thermometerOutline } from "ionicons/icons";
import { categories } from "../functions/categories";

const Home: React.FC = () => {
  const router = useIonRouter();
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { weather } = UseOpenWeather();
  console.log(weather);
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
  const convertToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };
  const convertToFahrenheit = (kelvin: number) => {
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
  };
  return (
    <IonPage>
      <div>
        <IonToolbar className="toolbar-with-avatar">
          <div className="banner">
            <IonSearchbar
            className="custom-searchbar"
            animated
            debounce={500}
            showCancelButton="focus"
            placeholder="Buscar un lugar..."
          />
            <IonAvatar onClick={() => setIsModalOpen(true)}>
              <IonImg
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
                alt="avatar"
                />
            </IonAvatar>
            </div>
        </IonToolbar>
      </div>

      <IonContent className="ion-padding" fullscreen>
        <IonList className="list-categories">
          {categories.map((c) => (
            <button className="btn-item" key={c.id}>
              <IonIcon size="small" icon={Object.values(c.icon)[0]} />
              <h4 className="name-item">{c.name}</h4>
            </button>
          ))}
        </IonList>

        <div className="weather-box">
          <IonImg
            className="weather-icon"
            src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`}
          />
          <p className="weather-temp">
            <IonIcon icon={thermometerOutline} />{" "}
            {convertToCelsius(weather?.main.temp)}°C /{" "}
            {convertToFahrenheit(weather?.main.temp)}°F
          </p>
        </div>

        <IonButton expand="block" color="medium" onClick={handleLogout}>
          Cerrar sesión
        </IonButton>

        <ModalProfile
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
