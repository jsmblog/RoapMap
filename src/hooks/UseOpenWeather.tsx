import axios from "axios";
import { useEffect, useState } from "react";
import { VITE_API_KEY_OPEN_WHEATER } from "../config/config";
import { useAuthContext } from "../context/UserContext";

export const UseOpenWeather = () => {
  const [weather, setWeather] = useState<any>(null);
  const { currentUserData } = useAuthContext();
  const location = currentUserData?.location;

  useEffect(() => {
    const fetchOpenWeather = async () => {
      if (!location?.lat || !location?.lng) return;
      try {
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${VITE_API_KEY_OPEN_WHEATER}`;
        const { data } = await axios.get(URL);
        setWeather(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOpenWeather();
  }, [location]);

  return { weather };
};