import { useEffect, useState } from "react";
import "../styles/Home.css";
import { IonButton, IonContent, IonIcon, IonList, IonPage, IonSearchbar, IonToolbar, useIonRouter } from "@ionic/react";
import ModalProfile from "../Components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import { useAuthContext } from "../context/UserContext";
import { UseOpenWeather } from "../hooks/UseOpenWeather";
import { thermometerOutline } from "ionicons/icons";
import { categories } from "../functions/categories";

const Home: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const router = useIonRouter();
  const { showLoading, hideLoading } = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { weather } = UseOpenWeather();
  console.log(weather);
  const handleLogout = async () => {
    showLoading('Cerrando sesión...');
    try {
      await signOut(AUTH_USER);
      await hideLoading();
      router.push('/', 'root', 'replace');
    } catch (error) {
      console.error(error);
      await hideLoading();
    }
  };
  const convertToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  }
  const convertToFahrenheit = (kelvin: number) => {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
  }
  return (
    <IonPage >
      <IonContent className="ion-padding" fullscreen>
        
        <div className="user-profile">
          <input type="text" 
          placeholder="Busque un lugar" className="input-search-bar" />
          
            <img
              className="user-avatar"
              onClick={() => setIsModalOpen(true)}
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
              alt="avatar"
            />
        </div>
        <IonList className="list-categories">
          {
            categories.map((c)=>(
              <button className="btn-item" key={c.id}>
                <IonIcon size="small" icon={Object.values(c.icon)[0]} />
                <h4 className="name-item">{c.name}</h4>
              </button>
            ))
          }
        </IonList>
        <div>
          <img className="weather-icon" src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`} />
          <p><IonIcon icon={thermometerOutline} /> {convertToCelsius(weather?.main.temp)}°C / {convertToFahrenheit(weather?.main.temp)}°F</p>
        </div>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>

        <ModalProfile
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} />

      </IonContent>
    </IonPage>
  );
};

export default Home;
