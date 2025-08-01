import React, { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useAuthContext } from "../context/UserContext";
import { Preferences } from '@capacitor/preferences';
import { useRequestLocationPermission } from "../hooks/UseRequestLocationPermission";
import { GoogleMap } from "@capacitor/google-maps";
import { VITE_API_KEY_GOOGLE } from "../config/config";
import { Loader, LoaderOptions } from "@googlemaps/js-api-loader";
import { DetailedPlace, MapProps } from "../Interfaces/iGoogleMaps";
import PlacesResult from "./PlacesResult";
import { IonButton, IonIcon } from "@ionic/react";
import { locationOutline } from "ionicons/icons";
import NearestPlace from "./NearestPlace";
import { getLocationDetails } from "../functions/geocoding";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "../Firebase/initializeApp";
import { useAchievements } from "../hooks/UseAchievements";
import { useToast } from "../hooks/UseToast";
import { Filters } from "../Interfaces/iPlacesResults";

const Map: React.FC<
  MapProps & {
    shouldRefocus?: boolean;
    setShouldRefocus?: (v: boolean) => void;
    filters:Filters
  }
> = ({
  searchInputRef,
  selectedCategory,
  placeMarkers,
  setPlaceMarkers,
  shouldRefocus,
  setShouldRefocus,
  filters
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const { authUser, currentUserData, setLocationDetails } = useAuthContext();
    const { location: permLocation, getLocation } =
      useRequestLocationPermission();
    const { unlockAchievement,
      isAchievementUnlocked, AchievementPopup } = useAchievements();
    const [jsMap, setJsMap] = useState<google.maps.Map>();
    const [placesService, setPlacesService] =
      useState<google.maps.places.PlacesService | null>(null);
    const [places, setPlaces] = useState<DetailedPlace[]>([]);

    const [directionsRenderer, setDirectionsRenderer] =
      useState<google.maps.DirectionsRenderer>();
    const [info, setInfo] = useState<{
      distance: string;
      duration: string;
      destination: any;
      place: DetailedPlace | null;
    }>({ distance: "", duration: "", destination: null, place: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const { showToast, ToastComponent } = useToast();
    const userLocation = permLocation ?? currentUserData?.location;

    // Obtener permisos de ubicación
    useEffect(() => {
      getLocation();
    }, []);

    // Obtener detalles de ubicación (país, provincia, ciudad)
    useEffect(() => {
      if (permLocation) {
        (async () => {
          const details = await getLocationDetails(
            permLocation.lat,
            permLocation.lng,
            VITE_API_KEY_GOOGLE
          );
          if (details) {
            setLocationDetails(details);
          }
        })();
      }
    }, [permLocation, setLocationDetails]);

    // Inicializar mapa
    useEffect(() => {
      if (!mapRef.current || !userLocation) return;
      const center = { lat: userLocation.lat, lng: userLocation.lng };
      const libs: LoaderOptions["libraries"] = ["places", "geometry"];
      const guardarLugaresCercanos = async (lugares: any[]) => {
        const convertPlace = (place: any) => {
          let photoUrl = '';
          if (place.photos && place.photos.length > 0) {
            try {
              photoUrl = place.photos[0].getUrl({ maxWidth: 400 });
            } catch (err) {
              console.warn("No se pudo obtener photo URL:", err);
            }
          }

          return {
            place_id: place.place_id,
            name: place.name,
            geometry: {
              location: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              },
            },
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            types: place.types,
            vicinity: place.vicinity,
            photoUrl,
          };
        };

        const todosLugares: any[] = [];

        const procesarPagina = (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
          pagination: google.maps.places.PlaceSearchPagination | null
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            todosLugares.push(...results.map(convertPlace));

            if (pagination && pagination.hasNextPage) {
              setTimeout(() => {
                pagination.nextPage();
              }, 2000);
            } else {
              Preferences.set({
                key: "saved_nearby_places",
                value: JSON.stringify(todosLugares),
              }).then(() => {
                console.log("✅ Lugares cercanos guardados:", todosLugares.length);
              });
            }
          } else {
            console.warn("❌ Error al obtener lugares cercanos");
          }
        };
        placesService!.nearbySearch(
          {
            location: userLocation,
            radius: 100000, // 100 km
          },
          procesarPagina
        );
      };

      if (Capacitor.getPlatform() !== "web") {
        GoogleMap.create({
          id: "home-map",
          element: mapRef.current,
          apiKey: VITE_API_KEY_GOOGLE,
          config: { center, zoom: 16 },
        }).then((m) => {
          m.addMarker({ coordinate: center, title: "Tu ubicación" });
        });
      } else {
        new Loader({ apiKey: VITE_API_KEY_GOOGLE, libraries: libs })
          .load()
          .then(() => {
            const map = new google.maps.Map(mapRef.current!, {
              center,
              zoom: 16,
              gestureHandling: "greedy",
              disableDefaultUI: true,
            });

            setJsMap(map);
            const placesService = new google.maps.places.PlacesService(map);
            setPlacesService(placesService);

            new google.maps.Marker({
              map,
              position: center,
              title: "Tu ubicación",
            });

            const dr = new google.maps.DirectionsRenderer({
              map,
              polylineOptions: {
                strokeColor: "#E14434",
                strokeWeight: 7,
              },
            });
            setDirectionsRenderer(dr);

            const request: google.maps.places.PlaceSearchRequest = {
              location: center,
              radius: 100000, // 100 km
            };

            placesService.nearbySearch(request, (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                guardarLugaresCercanos(results);
              } else {
                console.warn("❌ No se encontraron lugares o error en Places API");
              }
            });
          });
      }
    }, [userLocation]);

    useEffect(() => {
      if (!jsMap || !searchInputRef.current || !authUser) return;
      searchInputRef.current.getInputElement().then((input: HTMLInputElement) => {
        const auto = new google.maps.places.Autocomplete(input, {
          types: ["geocode"],
        });
        auto.addListener("place_changed", async () => {
          const place = auto.getPlace();
          if (!place.geometry?.location) return;
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          jsMap.panTo({ lat, lng });
          jsMap.setZoom(17);
          new google.maps.Marker({
            map: jsMap,
            position: { lat, lng },
            title: place.name,
          });

          // Guardar en historial de Firestore
          try {
            await setDoc(
              doc(db, 'USERS', authUser.uid),
              { h: arrayUnion(place.name || input.value) },
              { merge: true }
            );
            if (!isAchievementUnlocked("first_search")) {
              unlockAchievement("first_search");
            }
            if (currentUserData?.history?.length === 4 && !isAchievementUnlocked("five_searches")) {
              unlockAchievement("five_searches");
            }
          } catch (err) {
            console.error('Error guardando historial:', err);
          }
        });
      });
    }, [jsMap, searchInputRef, authUser]);

    // Reenfocar mapa cuando se limpia
    useEffect(() => {
      if (shouldRefocus && jsMap && userLocation) {
        jsMap.panTo({ lat: userLocation.lat, lng: userLocation.lng });
        jsMap.setZoom(16);
        setShouldRefocus?.(false);
      }
    }, [shouldRefocus, jsMap, userLocation, setShouldRefocus]);

    const recenterMap = () => {
      if (jsMap && userLocation) {
        jsMap.panTo({ lat: userLocation.lat, lng: userLocation.lng });
        jsMap.setZoom(16);
      }
    };

    const clearMarkersAndRoute = () => {
      if (!jsMap) return;
      placeMarkers.forEach((m) => m.setMap(null));
      setPlaceMarkers([]);
      setPlaces([]);
      setExpandedIdx(null);
      directionsRenderer?.setDirections({ routes: [] } as any);
      setInfo({ distance: "", duration: "", destination: null, place: null });
    };
  
useEffect(() => {
    if (!jsMap || !placesService || !userLocation) return;
    clearMarkersAndRoute();

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: filters.radius,
      openNow: filters.openNow || undefined,
      type: filters.types.length > 0 ? filters.types[0] : undefined,
      keyword: filters.types.length > 1 ? filters.types.join('|') : undefined,
      minPriceLevel: filters.priceLevels.length ? Math.min(...filters.priceLevels) : undefined,
      maxPriceLevel: filters.priceLevels.length ? Math.max(...filters.priceLevels) : undefined,
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        showToast('No se encontraron lugares con los filtros aplicados', 3000, 'warning');
        return;
      }

      let filtered = results;
      if (filters.minRating > 0) filtered = filtered.filter(r => (r.rating || 0) >= filters.minRating);

      // Sort
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating': return (b.rating || 0) - (a.rating || 0);
          case 'price': return (a.price_level || 0) - (b.price_level || 0);
          case 'distance': {
            const da = google.maps.geometry.spherical.computeDistanceBetween(a.geometry!.location!, new google.maps.LatLng(userLocation.lat, userLocation.lng));
            const db = google.maps.geometry.spherical.computeDistanceBetween(b.geometry!.location!, new google.maps.LatLng(userLocation.lat, userLocation.lng));
            return da - db;
          }
          default: return 0;
        }
      });

      // Markers and details
      const markers = filtered.map(r => new google.maps.Marker({ map: jsMap, position: r.geometry!.location!, title: r.name }));
      setPlaceMarkers(markers);

      const fields: (keyof google.maps.places.PlaceResult)[] = ['name', 'vicinity', 'rating', 'user_ratings_total', 'photos', 'opening_hours', 'types'];
      Promise.all(filtered.map(r => new Promise<DetailedPlace>(resolve => placesService.getDetails({ placeId: r.place_id!, fields }, detail => resolve(detail as DetailedPlace)))))
        .then(enriched => setPlaces(enriched));
    });
  }, [jsMap, placesService, userLocation, filters]);
    // Búsqueda por categoría
    useEffect(() => {
      if (!selectedCategory || !jsMap || !placesService || !userLocation) {
        clearMarkersAndRoute();
        return;
      }

      placesService.nearbySearch(
        {
          location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          radius: 100000, // 100 km
          type: selectedCategory.toLowerCase(),
          keyword: selectedCategory,
        },
        (results, status) => {
          if (!results || results.length === 0) {
            showToast("No se encontraron lugares cercanos", 3000, "warning");
            clearMarkersAndRoute();
            return;
          }
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            clearMarkersAndRoute();

            const markers = results.map(
              (r) =>
                new google.maps.Marker({
                  map: jsMap,
                  position: r.geometry!.location!,
                  title: r.name,
                })
            );
            setPlaceMarkers(markers as any);

            const distances = results.map((r) =>
              google.maps.geometry.spherical.computeDistanceBetween(
                r.geometry!.location!,
                new google.maps.LatLng(userLocation.lat, userLocation.lng)
              )
            );
            const minIdx = distances.indexOf(Math.min(...distances));
            const nearest = results[minIdx];

            jsMap.panTo(nearest.geometry!.location!);
            jsMap.setZoom(15);

            const fields: (keyof google.maps.places.PlaceResult)[] = [
              "name",
              "vicinity",
              "rating",
              "user_ratings_total",
              "photos",
              "reviews",
              "formatted_phone_number",
              "opening_hours",
              "website",
              "types",
            ];

            const enrichedPlacesPromises = results.map(
              (r) =>
                new Promise<DetailedPlace>((resolve) => {
                  placesService.getDetails(
                    { placeId: r.place_id!, fields },
                    (detail) => {
                      if (detail) resolve(detail as DetailedPlace);
                      else resolve(r as DetailedPlace);
                    }
                  );
                })
            );

            Promise.all(enrichedPlacesPromises).then((enrichedPlaces) => {
              setPlaces(enrichedPlaces);

              const nearestDetail = enrichedPlaces[minIdx];
              const lat = nearest.geometry!.location!.lat();
              const lng = nearest.geometry!.location!.lng();

              setInfo((prev) => ({
                ...prev,
                place: nearestDetail,
                destination: { lat, lng },
              }));

              const ds = new google.maps.DirectionsService();
              ds.route(
                {
                  origin: new google.maps.LatLng(
                    userLocation.lat,
                    userLocation.lng
                  ),
                  destination: nearest.geometry!.location!,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (res, status2) => {
                  if (status2 === "OK" && res) {
                    directionsRenderer?.setDirections(res);
                    const leg = res.routes[0].legs[0];
                    setInfo({
                      distance: leg.distance?.text || "",
                      duration: leg.duration?.text || "",
                      destination: { lat, lng },
                      place: nearestDetail,
                    });
                  }
                }
              );

              setIsModalOpen(true);
            });
          }
        }
      );
    }, [selectedCategory, jsMap, placesService, userLocation]);

    return (
      <>
        {ToastComponent}
        {AchievementPopup}
        <div ref={mapRef} className="full-screen-map" />
        {selectedCategory && (
          <div className="my_location">
            <IonButton onClick={recenterMap} className="btn_my_location">
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
