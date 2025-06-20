import { Geolocation } from "@capacitor/geolocation";
import { useState } from "react";

export const useRequestLocationPermission = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = async () => {
    try {
      const status = await Geolocation.checkPermissions();
      if (status.location !== 'granted') {
        const permission = await Geolocation.requestPermissions();
        if (permission.location !== 'granted') {
          console.warn('Permisos de ubicación denegados');
          return;
        }
      }

      const coordinates = await Geolocation.getCurrentPosition();
      setLocation({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      });
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  };

  return {
    location,
    getLocation,
  };
};
