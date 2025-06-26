import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuthContext } from '../context/UserContext';
import { useRequestLocationPermission } from '../hooks/UseRequestLocationPermission';
import { GoogleMap } from '@capacitor/google-maps';
import { VITE_API_KEY_GOOGLE } from '../config/config';
import { Loader } from '@googlemaps/js-api-loader';
import { MapProps } from '../Interfaces/iGoogleMaps';
import PlacesResult from './PlacesResult';

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
    console.log(places)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const userLocation = permLocation ?? currentUserData?.location;

    useEffect(() => { getLocation(); }, []);

    useEffect(() => {
      if (!mapRef.current || !userLocation) return;
      const center = { lat: userLocation.lat, lng: userLocation.lng };
      if (Capacitor.getPlatform() !== 'web') {
        GoogleMap.create({ id: 'home-map', element: mapRef.current, apiKey: VITE_API_KEY_GOOGLE, config: { center, zoom: 16 } })
          .then(m => m.addMarker({ coordinate: center, title: 'Tu ubicación' }));
      } else {
        new Loader({ apiKey: VITE_API_KEY_GOOGLE, libraries: ['places'] }).load().then(() => {
          const map = new google.maps.Map(mapRef.current!, { center, zoom: 16, gestureHandling: 'greedy', disableDefaultUI: true });
          setJsMap(map);
          setPlacesService(new google.maps.places.PlacesService(map));
          new google.maps.Marker({ map, position: center, title: 'Tu ubicación' });
        });
      }
    }, [userLocation]);

    // Autocompletado
    useEffect(() => {
      if (!jsMap || !searchInputRef.current) return;
      searchInputRef.current.getInputElement().then((input: HTMLInputElement) => {
        const auto: google.maps.places.Autocomplete = new google.maps.places.Autocomplete(input, { types: ['geocode'] });
        auto.addListener('place_changed', () => {
          const place: google.maps.places.PlaceResult = auto.getPlace();
          if (!place.geometry?.location) return;
          const lat: number = place.geometry.location.lat(), lng: number = place.geometry.location.lng();
          jsMap.panTo({ lat, lng }); jsMap.setZoom(17);
          new google.maps.Marker({ map: jsMap, position: { lat, lng }, title: place.name });
        });
      });
    }, [jsMap]);

    // Recentrar al clear
    useEffect(() => {
      if (shouldRefocus && jsMap && userLocation) {
        jsMap.panTo({ lat: userLocation.lat, lng: userLocation.lng });
        jsMap.setZoom(16);
        setShouldRefocus?.(false);
      }
    }, [shouldRefocus, jsMap, userLocation, setShouldRefocus]);

    const clearMarkers = () => {
      if (!jsMap) return;
      placeMarkers.forEach(m => m.setMap(null));
      setPlaceMarkers([]);
      setPlaces([]);
      setExpandedIdx(null);
    };

    // Búsqueda cercana y detalles completos
    useEffect(() => {
      if (!selectedCategory || !jsMap || !placesService || !userLocation) { clearMarkers(); return; }
      placesService.nearbySearch(
        { location: new google.maps.LatLng(userLocation.lat, userLocation.lng), radius: 20000, keyword: selectedCategory },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearMarkers();
            const markers = results.map(r => new google.maps.Marker({ map: jsMap, position: r.geometry!.location!, title: r.name }));
            setPlaceMarkers(markers as any);
            jsMap.panTo(results[0].geometry!.location!); jsMap.setZoom(15);
            const fields: (keyof google.maps.places.PlaceResult)[] = [
              'name', 'vicinity', 'rating', 'user_ratings_total', 'photos', 'reviews','formatted_phone_number','opening_hours','website','types'
            ];
            // Obtener detalles para cada place
            results.forEach(r => {
              placesService.getDetails({ placeId: r.place_id!, fields }, detail => {
                if (detail) setPlaces(prev => [...prev, detail]);
              });
            });
            setIsModalOpen(true);
          }
        }
      );
    }, [selectedCategory, jsMap, placesService, userLocation]);

    return (
      <>
        <div ref={mapRef} className="full-screen-map" />
        <PlacesResult isModalOpen={isModalOpen} places={places} expandedIdx={expandedIdx} setIsModalOpen={setIsModalOpen} setExpandedIdx={setExpandedIdx} />
      </>
    );
  };

export default Map;
