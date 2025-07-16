import React, { useEffect, useState } from 'react';
import {
  IonIcon,
  IonImg,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonSpinner
} from '@ionic/react';
import {
  thermometerOutline,
  informationCircleOutline,
  closeOutline,
  warningOutline
} from 'ionicons/icons';
import { UseOpenWeather } from '../hooks/UseOpenWeather';
import { connection } from '../connection/connection_to_backend';
import '../styles/weatherCard.css';
import { useAchievements } from '../hooks/UseAchievements';

const WeatherCard: React.FC = () => {
  const { weather } = UseOpenWeather();
  const [recommendation, setRecommendation] = useState<string>('');
  const { unlockAchievement, AchievementPopup, isAchievementUnlocked } = useAchievements();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [applyAnimation, setApplyAnimation] = useState(false);

  const weatherKey = weather ? 
    `${weather.weather[0].id}-${Math.round(weather.main.temp)}-${Math.round(weather.main.humidity)}` : 
    null;

  const handleOpenCardRecommendation = () => {
    setIsModalOpen(true);
    setApplyAnimation(true);
     if (!isAchievementUnlocked("weather_checked")) {
      unlockAchievement("weather_checked");
    }
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!weather || !weatherKey) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const storageKey = `climate_${weatherKey}`;
        const stored = sessionStorage.getItem(storageKey);
        
        if (stored) {
          setRecommendation(stored);
          setLoading(false);
          return;
        }

        const payload = {
          mod: 'climate_recommendation',
          data_to_analyze: weather,
        };

        const { data } = await connection.post('/send/request/ai', payload);
        
        sessionStorage.setItem(storageKey, data.message);
        setRecommendation(data.message);
        
      } catch (err: any) {
        console.error('Error getting climate recommendation:', err.response?.data || err.message);
        setError('No se pudo obtener la recomendación. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (weatherKey && !recommendation) {
      fetchRecommendation();
    }
  }, [weatherKey]); 

  const convertToCelsius = (kelvin: number) => Math.round(kelvin - 273.15);

  if (!weather) {
    return (
      <div className="weather-box loading-container">
        <IonSpinner name="crescent" />
        <p>Obteniendo datos climáticos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="weather-box">
        <IonImg
          className="weather-icon"
          alt={`Clima: ${weather.weather[0].description}`}
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
        />
        <p className="weather-temp">
          <IonIcon icon={thermometerOutline} /> {convertToCelsius(weather.main.temp)}°C
        </p>

        {loading && (
          <IonButton fill="clear" className="recommendation-button">
            <IonSpinner name="crescent" />
            Cargando recomendación...
          </IonButton>
        )}

        {error && (
          <IonButton fill="clear" className="recommendation-button" color="danger">
            <IonIcon icon={warningOutline} />
            {error}
          </IonButton>
        )}

        {recommendation && !loading && (
          <IonButton
            fill="clear"
            className={`recommendation-button ${!applyAnimation ? 'heartbeat' : ''}`}
            onClick={handleOpenCardRecommendation}
          >
            <IonIcon icon={informationCircleOutline} />
            {!applyAnimation && 'Ver Recomendación'}
          </IonButton>
        )}
      </div>

      <IonModal
        isOpen={isModalOpen}
        onDidDismiss={() => setIsModalOpen(false)}
        className="recommendation-modal"
      >
        <IonHeader className="modal-header">
          <IonToolbar>
            <IonTitle className="modal-title">Recomendación Climática</IonTitle>
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={() => setIsModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="modal-content">
          {AchievementPopup}
          <IonCard className="recommendation-card">
            <IonCardContent>
              <div className="weather-summary">
                <div className="weather-info">
                  <IonImg
                    className="modal-weather-icon"
                    alt={`Clima: ${weather.weather[0].description}`}
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  />
                  <div className="weather-details">
                    <h3>{convertToCelsius(weather.main.temp)}°C</h3>
                    <p>{weather.weather[0].description}</p>
                    <p className="weather-subdetails">
                      Humedad: {weather.main.humidity}% | 
                      Viento: {weather.wind.speed} m/s
                    </p>
                  </div>
                </div>
              </div>

              <div className="recommendation-content">
                <h4 className="recommendation-title">
                  <IonIcon icon={informationCircleOutline} /> Recomendación con IA
                </h4>
                <p className="recommendation-text">{recommendation}</p>
                
                {error && (
                  <div className="retry-container">
                    <IonButton 
                      color="medium" 
                      fill="outline"
                      onClick={() => {
                        setError(null);
                        setRecommendation('');
                      }}
                    >
                      Reintentar
                    </IonButton>
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonModal>
    </>
  );
};

export default WeatherCard;