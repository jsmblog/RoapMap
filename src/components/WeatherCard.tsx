import { IonIcon, IonImg } from '@ionic/react'
import React from 'react'
import { UseOpenWeather } from '../hooks/UseOpenWeather';
import { thermometerOutline } from 'ionicons/icons';

const WeatherCard: React.FC = () => {
    const { weather } = UseOpenWeather();
    const convertToCelsius = (kelvin: number) =>
        Math.round(kelvin - 273.15);
    // const convertToFahrenheit = (kelvin: number) =>
    //   Math.round(((kelvin - 273.15) * 9) / 5 + 32);


    return (
        <div className="weather-box">
            <IonImg
                className="weather-icon"
                src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@4x.png`}
            />
            <p className="weather-temp">
                <IonIcon icon={thermometerOutline} />{" "}
                {convertToCelsius(weather?.main.temp)}°C
            </p>
        </div>
    )
}

export default WeatherCard