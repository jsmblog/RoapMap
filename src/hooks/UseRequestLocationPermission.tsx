import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const useRequestLocationPermission = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = async () => {
    try {
      if (Capacitor.getPlatform() === 'web') {
        if (!navigator.geolocation) {
          console.error('Geolocalización no soportada en este navegador');
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.error('Error al obtener ubicación (web):', err);
          },
          { enableHighAccuracy: true }
        );
      } else {
        const status = await Geolocation.checkPermissions();
        if (status.location !== 'granted') {
          const permission = await Geolocation.requestPermissions();
          if (permission.location !== 'granted') {
            console.warn('Permisos de ubicación denegados en nativo');
            return;
          }
        }

        const coords = await Geolocation.getCurrentPosition();
        setLocation({
          lat: coords.coords.latitude,
          lng: coords.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  };

  return { location, getLocation };
};
