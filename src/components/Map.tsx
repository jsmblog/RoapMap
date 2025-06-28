import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuthContext } from '../context/UserContext';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { GoogleMap } from '@capacitor/google-maps';
import { VITE_API_KEY_GOOGLE } from '../config/config';
import { Loader, LoaderOptions } from '@googlemaps/js-api-loader';
import { MapProps } from '../Interfaces/iGoogleMaps';
import PlacesResult from './PlacesResult';
import { IonButton, IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import NearestPlace from './NearestPlace';

interface DetailedPlace extends google.maps.places.PlaceResult {
  photos?: google.maps.places.PlacePhoto[];
  reviews?: google.maps.places.PlaceReview[];
}

const Map: React.FC<
  MapProps & { shouldRefocus?: boolean; setShouldRefocus?: (v: boolean) => void }
> = ({
  searchInputRef,
  selectedCategory,
  placeMarkers,
  setPlaceMarkers,
  shouldRefocus,
  setShouldRefocus,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentUserData } = useAuthContext();
  const { location: permLocation, getLocation } = useRequestLocationPermission();
  const [jsMap, setJsMap] = useState<google.maps.Map>();
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService>();
  const [places, setPlaces] = useState<DetailedPlace[]>([]);

  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [info, setInfo] = useState<{ distance: string; duration: string; place: DetailedPlace | null }>({ distance: '', duration: '', place: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const userLocation = permLocation ?? currentUserData?.location;

  // Solicita permiso de ubicación al montar
  useEffect(() => {
    getLocation();
  }, []);

  // Inicializa el mapa y DirectionsRenderer
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const center = { lat: userLocation.lat, lng: userLocation.lng };
    const libs: LoaderOptions['libraries'] = ['places', 'geometry'];

    if (Capacitor.getPlatform() !== 'web') {
      GoogleMap.create({ id: 'home-map', element: mapRef.current, apiKey: VITE_API_KEY_GOOGLE, config: { center, zoom: 16 } })
        .then(m => m.addMarker({ coordinate: center, title: 'Tu ubicación' }));
    } else {
      new Loader({ apiKey: VITE_API_KEY_GOOGLE, libraries: libs }).load().then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          center,
          zoom: 16,
          gestureHandling: 'greedy',
          disableDefaultUI: true,
        });
        setJsMap(map);
        setPlacesService(new google.maps.places.PlacesService(map));
        new google.maps.Marker({ map, position: center, title: 'Tu ubicación' });

        const dr = new google.maps.DirectionsRenderer({ map });
        setDirectionsRenderer(dr);
      });
    }
  }, [userLocation]);

  // Autocompletado de direcciones
  useEffect(() => {
    if (!jsMap || !searchInputRef.current) return;
    searchInputRef.current.getInputElement().then((input: HTMLInputElement) => {
      const auto = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
      auto.addListener('place_changed', () => {
        const place = auto.getPlace();
        if (!place.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        jsMap.panTo({ lat, lng });
        jsMap.setZoom(17);
        new google.maps.Marker({ map: jsMap, position: { lat, lng }, title: place.name });
      });
    });
  }, [jsMap]);

  // Recentrar al limpiar búsqueda
  useEffect(() => {
    if (shouldRefocus && jsMap && userLocation) {
      jsMap.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      jsMap.setZoom(16);
      setShouldRefocus?.(false);
    }
  }, [shouldRefocus, jsMap, userLocation, setShouldRefocus]);

  // Función de recenter simple
  const recenterMap = () => {
    if (jsMap && userLocation) {
      jsMap.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      jsMap.setZoom(16);
    }
  };

  // Limpia marcadores y ruta
  const clearMarkersAndRoute = () => {
    if (!jsMap) return;
    placeMarkers.forEach(m => m.setMap(null));
    setPlaceMarkers([]);
    setPlaces([]);
    setExpandedIdx(null);
    directionsRenderer?.setDirections(null);
    setInfo({ distance: '', duration: '', place: null });
  };

  // Busca lugares cercanos y traza la ruta al más cercano
  useEffect(() => {
    if (!selectedCategory || !jsMap || !placesService || !userLocation) {
      clearMarkersAndRoute();
      return;
    }

    placesService.nearbySearch(
      {
        location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        radius: 5000,
        keyword: selectedCategory,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          clearMarkersAndRoute();

          // Coloca marcadores
          const markers = results.map(r =>
            new google.maps.Marker({ map: jsMap, position: r.geometry!.location!, title: r.name })
          );
          setPlaces(results)
          setPlaceMarkers(markers as any);

          // Encuentra el más cercano
          const distances = results.map(r =>
            google.maps.geometry.spherical.computeDistanceBetween(
              r.geometry!.location!,
              new google.maps.LatLng(userLocation.lat, userLocation.lng)
            )
          );
          const minIdx = distances.indexOf(Math.min(...distances));
          const nearest = results[minIdx];

          jsMap.panTo(nearest.geometry!.location!);
          jsMap.setZoom(15);

          // Detalles y ruta
          const fields: (keyof google.maps.places.PlaceResult)[] = [
            'name', 'vicinity', 'rating', 'user_ratings_total',
            'photos', 'reviews', 'formatted_phone_number',
            'opening_hours', 'website', 'types',
          ];
          placesService.getDetails({ placeId: nearest.place_id!, fields }, detail => {
            if (detail) {
              setInfo(prev => ({ ...prev, place: detail }));

              const ds = new google.maps.DirectionsService();
              ds.route(
                {
                  origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                  destination: nearest.geometry!.location!,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (res, status2) => {
                  if (status2 === 'OK' && res) {
                    directionsRenderer?.setDirections(res);
                    const leg = res.routes[0].legs[0];
                    setInfo({
                      distance: leg.distance?.text || '',
                      duration: leg.duration?.text || '',
                      place: detail,
                    });
                  }
                }
              );
            }
          });

          setIsModalOpen(true);
        }
      }
    );
  }, [selectedCategory, jsMap, placesService, userLocation]);

  return (
    <>
      <div ref={mapRef} className="full-screen-map" />
      {selectedCategory && (
        <div className="my_location">
          <IonButton
            onClick={recenterMap}
            className="btn_my_location"
          >
            <IonIcon icon={locationOutline} />
          </IonButton>
        </div>
      )}
      <NearestPlace info={info} setInfo={setInfo} />
      <PlacesResult
        isModalOpen={isModalOpen}
        places={places}
        expandedIdx={expandedIdx}
        setIsModalOpen={setIsModalOpen}
        setExpandedIdx={setExpandedIdx}
      />
    </>
  );
};

export default Map;
