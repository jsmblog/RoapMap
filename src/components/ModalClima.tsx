import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
} from '@ionic/react';
import React from 'react';
import { ModalProfileProps } from '../Interfaces/iProps';
import { close, locationOutline, thermometerOutline, waterOutline, speedometerOutline, compassOutline, cloudOutline, eyeOutline } from 'ionicons/icons';
import { UseOpenWeather } from '../hooks/UseOpenWeather';
import '../styles/ModalClima.css';
import { useTranslation } from 'react-i18next';

const ModalClima: React.FC<ModalProfileProps> = ({ isOpen, onClose }) => {
    const { weather } = UseOpenWeather();
    const { t } = useTranslation();

    const weatherInfo = weather?.weather?.[0];

    const kelvinToCelsius = (k: number) => (k - 273.15).toFixed(1);

    const getWindDirection = (degrees: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(degrees / 45) % 8];
    };

    return (
        <IonModal className="modal-clima" isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar className="clima-toolbar tema-oscuro2">
                    <IonButtons slot="start" onClick={onClose}>
                        <IonIcon className="close-icon texto-quinto " icon={close} />
                    </IonButtons>
                    <IonTitle className="clima-title texto-quinto ">{t('wearther.title')}</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="clima-content">
                <div className="clima-background tema-oscuro2">
                    {/* Header con información principal */}
                    <IonCard className="clima-main-card">
                        <IonCardContent>
                            <div className="ciudad-info">
                                <IonIcon icon={locationOutline} className="location-icon texto-primario " />
                                <IonLabel className="ciudad-nombre texto-primario ">{weather?.name},</IonLabel>
                                <IonLabel className="pais texto-primario ">{weather?.sys?.country}</IonLabel>
                            </div>

                            {weatherInfo && (
                                <div className="weather-main">
                                    <div className="weather-icon-container">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`}
                                            alt="icono clima"
                                            className="weather-icon-large"
                                        />
                                    </div>
                                    <div className="temp-info">
                                        <span className="temp-actual texto-primario">{kelvinToCelsius(weather?.main?.temp || 0)}°</span>
                                        <div className="weather-desc">
                                            <h3 className='texto-quinto '>{weatherInfo.main}</h3>
                                            <p className='texto-secundario'>{weatherInfo.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </IonCardContent>
                    </IonCard>

                    {/* Grid con información detallada */}
                    <IonGrid className="clima-grid">
                        <IonRow>
                            <IonCol size="6">
                                <IonCard className="stat-card temperature-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario ">
                                            <IonIcon className='icon-modal-clima-temp texto-quinto ' icon={thermometerOutline} />
                                            {t('wearther.tem')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <div className="temp-item">
                                            <span className="temp-label texto-primario">{t('wearther.sen')}</span>
                                            <span className="temp-value texto-quinto">{kelvinToCelsius(weather?.main?.feels_like || 0)}°C</span>
                                        </div>
                                        <div className="temp-range">
                                            <span className="temp-min texto-quinto ">{kelvinToCelsius(weather?.main?.temp_min || 0)}°</span>
                                            <div className="temp-bar"></div>
                                            <span className="temp-max texto-quinto ">{kelvinToCelsius(weather?.main?.temp_max || 0)}°</span>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol size="6">
                                <IonCard className="stat-card humidity-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-Humidity texto-quinto ' icon={waterOutline} />
                                            {t('wearther.hum')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <span className="humidity-value texto-quinto ">{weather?.main?.humidity}%</span>
                                        <div className="humidity-bar">
                                            <div
                                                className="humidity-fill"
                                                style={{ width: `${weather?.main?.humidity}%` }}
                                            ></div>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol size="6">
                                <IonCard className="stat-card wind-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-Wind texto-quinto ' icon={compassOutline} />
                                            {t('wearther.vient')}
                                        </IonCardTitle>
                                    </IonCardHeader >
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <div className="wind-info">
                                            <div className="wind-speed texto-quinto ">{weather?.wind?.speed} m/s</div>
                                            <div className="wind-direction ">
                                                <IonChip className="direction-chip texto-secundario">
                                                    {getWindDirection(weather?.wind?.deg || 0)}
                                                </IonChip>
                                            </div>
                                            {weather?.wind?.gust && (
                                                <div className="wind-gust texto-quinto "> {t('wearther.rasf')}: {weather.wind.gust} m/s</div>
                                            )}
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol size="6">
                                <IonCard className="stat-card pressure-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-pressure texto-quinto ' icon={speedometerOutline} />
                                            {t('wearther.pres')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <div className="pressure-info">
                                            <div className="pressure-main texto-quinto ">{weather?.main?.pressure} hPa</div>
                                            {weather?.main?.sea_level && (
                                                <div className="pressure-detail texto-secundario"> {t('wearther.mar')}: {weather.main.sea_level} hPa</div>
                                            )}
                                            {weather?.main?.grnd_level && (
                                                <div className="pressure-detail texto-secundario"> {t('wearther.suelo')}: {weather.main.grnd_level} hPa</div>
                                            )}
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol size="6">
                                <IonCard className="stat-card clouds-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-clouds texto-quinto ' icon={cloudOutline} />
                                            {t('wearther.nub')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <span className="clouds-value texto-quinto ">{weather?.clouds?.all}%</span>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol size="6">
                                <IonCard className="stat-card visibility-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-visibility texto-quinto ' icon={eyeOutline} />
                                             {t('wearther.visi')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <span className="visibility-value texto-quinto ">{weather?.visibility} m</span>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>

                            <IonCol size="6.5">
                                <IonCard className="stat-card coords-card">
                                    <IonCardHeader className='ion-carda-header-modal-clima'>
                                        <IonCardTitle className="stat-title texto-primario">
                                            <IonIcon className='icon-modal-clima-coords texto-quinto ' icon={locationOutline} />
                                             {t('wearther.coor')}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent className='ion-card-content-modal-clima'>
                                        <div className="coord-item">
                                            <span className="coord-label texto-secundario">Latitud:</span>
                                            <span className="coord-value texto-quinto ">{weather?.coord?.lat}</span>
                                        </div>
                                        <div className="coord-item">
                                            <span className="coord-label texto-secundario">Longitud:</span>
                                            <span className="coord-value texto-quinto ">{weather?.coord?.lon}</span>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default ModalClima;