import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuthContext } from '../context/UserContext';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { GoogleMap as CapacitorMap } from '@capacitor/google-maps';
import { VITE_API_KEY_GOOGLE } from '../config/config';
import { Loader } from '@googlemaps/js-api-loader';
import { MapProps } from '../Interfaces/iGoogleMaps';



const Map: React.FC<MapProps> = ({
  searchInputRef,
  selectedCategory,
  placeMarkers,
  setPlaceMarkers,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentUserData } = useAuthContext();
  const { location: permLocation, getLocation } = useRequestLocationPermission();
  console.log('ubicación actual:', permLocation);
  const [nativeMap, setNativeMap] = useState<CapacitorMap>();
  const [jsMap, setJsMap] = useState<google.maps.Map>();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService>();

  const userLocation = permLocation ?? currentUserData?.location;

  // Pedir ubicación al cargar
  useEffect(() => {
    getLocation();
  }, []);

  // Crear mapa
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (Capacitor.getPlatform() !== 'web') {
      // Para apps móviles con Capacitor
      GoogleMap.create({
        id: 'home-map',
        element: mapRef.current,
        apiKey: VITE_API_KEY_GOOGLE,
        config: {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 16,
        },
      }).then((m) => {
        setNativeMap(m);
        m.addMarker({
          coordinate: { lat: userLocation.lat, lng: userLocation.lng },
          title: 'Tu ubicación',
        });
      });
    } else {
      // Para la web (sin Map ID)
      new Loader({
        apiKey: VITE_API_KEY_GOOGLE,
        libraries: ['places'],
      }).load().then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 16,
          gestureHandling: 'greedy',
          disableDefaultUI: true,
        });
        setJsMap(map);
        setPlacesService(new google.maps.places.PlacesService(map));

        // Marcador tradicional (sin Map ID)
        new google.maps.Marker({
          map,
          position: { lat: userLocation.lat, lng: userLocation.lng },
          title: 'Tu ubicación',
        });
      });
    }
  }, [userLocation]);

  // Autocompletado
  useEffect(() => {
    if (!jsMap || !searchInputRef.current) return;

    searchInputRef.current.getInputElement().then((input: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        jsMap.panTo({ lat, lng });
        jsMap.setZoom(17);

        new google.maps.Marker({
          map: jsMap,
          position: { lat, lng },
          title: place.name || 'Lugar',
        });
      });
    });
  }, [jsMap]);

  // Eliminar marcadores existentes
  const clearMarkers = async () => {
    if (nativeMap) {
      for (const marker of placeMarkers) {
        await nativeMap.removeMarker(marker.id);
      }
    } else if (jsMap) {
      placeMarkers.forEach((m: google.maps.Marker) => m.setMap(null));
    }
    setPlaceMarkers([]);
  };

  // Buscar lugares por categoría
  useEffect(() => {
    if (!selectedCategory || !jsMap || !placesService || !userLocation) {
      clearMarkers();
      return;
    }

    placesService.nearbySearch(
      {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 10000,
        keyword: selectedCategory,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          clearMarkers();

          const newMarkers: google.maps.Marker[] = [];

          results.forEach((place) => {
            if (place.geometry?.location) {
              const marker = new google.maps.Marker({
                map: jsMap,
                position: place.geometry.location,
                title: place.name,
              });
              newMarkers.push(marker);
            }
          });

          setPlaceMarkers(newMarkers as any);

          if (results[0]?.geometry?.location) {
            jsMap.panTo(results[0].geometry.location);
            jsMap.setZoom(15);
          }
        }
      }
    );
  }, [selectedCategory, jsMap, placesService, userLocation]);

  return <div ref={mapRef} className="full-screen-map" />;
};

export default Map;
