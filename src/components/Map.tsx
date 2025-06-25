import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../context/UserContext';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { GoogleMap } from '@capacitor/google-maps';
import { VITE_API_KEY_GOOGLE } from '../config/config';
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  searchInputRef: React.RefObject<any>;
  selectedCategory: string | null;
  placeMarkers:any[];
  setPlaceMarkers: React.Dispatch<React.SetStateAction<any[]>>; // <-- Nuevo prop
}

const Map: React.FC<MapProps> = ({ searchInputRef, selectedCategory,placeMarkers,setPlaceMarkers}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentUserData } = useAuthContext();
  const { location: permLocation, getLocation } = useRequestLocationPermission();
  const [map, setMap] = useState<GoogleMap>();
  const [googleReady, setGoogleReady] = useState(false);
  const userLocation = permLocation ?? currentUserData?.location;

  useEffect(() => {
    getLocation();
  }, []);

  // Crear el mapa
  useEffect(() => {
    if (!mapRef.current || !userLocation || map) return;

    let createdMap: GoogleMap | undefined;

    GoogleMap.create({
      id: 'home-map',
      element: mapRef.current,
      apiKey: VITE_API_KEY_GOOGLE,
      config: {
        center: { lat: userLocation.lat, lng: userLocation.lng },
        zoom: 16,
        zoomControl: true,
        gestureHandling: 'greedy',
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      },
    }).then(async (m) => {
      createdMap = m;
      setMap(m);

      await m.addMarker({
        coordinate: { lat: userLocation.lat, lng: userLocation.lng },
        title: 'Tu ubicación',
      });
    });

    return () => {
      if (createdMap) {
        createdMap.destroy();
      }
    };
  }, [userLocation]);

  // Cargar Autocomplete en SearchBar
  useEffect(() => {
    if (!map || !searchInputRef.current) return;

    const initAutocomplete = async () => {
      const inputEl = await searchInputRef.current!.getInputElement();
      if (!inputEl) return;

      const ac = new google.maps.places.Autocomplete(inputEl, {
        types: ['geocode'],
        fields: ['geometry', 'name'],
      });

      ac.addListener('place_changed', async () => {
        const p = ac.getPlace();
        if (!p.geometry?.location) return;

        const lat = p.geometry.location.lat();
        const lng = p.geometry.location.lng();

        await map.setCamera({ coordinate: { lat, lng }, zoom: 17, animate: true });
        await map.addMarker({ coordinate: { lat, lng }, title: p.name || 'Lugar' });
      });
    };

    if (window.google?.maps?.places) {
      setGoogleReady(true);
      initAutocomplete();
    } else {
      new Loader({ apiKey: VITE_API_KEY_GOOGLE, libraries: ['places'] })
        .load()
        .then(() => {
          setGoogleReady(true);
          initAutocomplete();
        });
    }
  }, [map]);

  const clearMarkers = async () => {
    if (!map) return;
    for (const marker of placeMarkers) {
      await map.removeMarker(marker.id);
    }
    
    setPlaceMarkers([]);
  };

  // Buscar lugares cercanos por categoría
  useEffect(() => {
  if (!map || !googleReady || !userLocation) return;

  if (!selectedCategory) {
    clearMarkers();
    return;
  }

  const location = new google.maps.LatLng(userLocation.lat, userLocation.lng);
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  service.nearbySearch(
    {
      location,
      radius: 10000,
      keyword: selectedCategory,
    },
    async (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        await clearMarkers();

        const newMarkers: any[] = [];

        for (const place of results) {
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const newMarker = await map.addMarker({
              coordinate: { lat, lng },
              title: place.name || selectedCategory,
            });

            newMarkers.push(newMarker);
          }
        }

        setPlaceMarkers(newMarkers);

        const firstPlace = results[0];
        if (firstPlace?.geometry?.location) {
          const lat = firstPlace.geometry.location.lat();
          const lng = firstPlace.geometry.location.lng();
          await map.setCamera({ coordinate: { lat, lng }, zoom: 15 });
        }
      }
    }
  );
}, [selectedCategory, map, userLocation, googleReady]);

  return <div ref={mapRef} className="full-screen-map" />;
};

export default Map;
