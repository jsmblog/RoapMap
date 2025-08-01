import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonImg,
  IonBadge,
  IonText,
  IonIcon,
  IonButton,
  IonChip,
  IonHeader,
  IonModal,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  useIonRouter,
} from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { getDistance } from 'geolib';
import '../styles/discover.css';
import {
  location,
  globeOutline,
  callOutline,
  star,
  navigateOutline,
  chevronBackOutline,
  chevronForwardOutline,
  sparklesOutline,
  closeOutline,
  calendarOutline,
} from 'ionicons/icons';
import { useAuthContext } from '../context/UserContext';
import { useToast } from '../hooks/UseToast';
import axios from 'axios';
import { VITE_LINK_FIREBASE_FUNCTIONS } from '../config/config';
import { generateUUID } from '../functions/uuid';
import { arrayUnion, doc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';

type SavedPlace = {
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  name: string;
  photoUrl?: string;
  place_id: string;
  rating?: number;
  types: string[];
  user_ratings_total?: number;
  vicinity: string;
  distance?: number;
};

type PlaceCategory = {
  title: string;
  places: SavedPlace[];
  icon: string;
};

const Discover: React.FC = () => {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [generating, setGenerating] = useState<boolean>(false);
  const [recommendationAi, setRecommendationAi] = useState<SavedPlace[] | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<SavedPlace | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString());
  const { currentUserData } = useAuthContext();
  const { showToast, ToastComponent } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isProgrammingEv, setIsProgrammingEv] = useState<boolean>(false)
  const router = useIonRouter()
  useEffect(() => {
    const loadPlaces = async () => {
      const result = await Preferences.get({ key: 'saved_nearby_places' });
      if (result.value) {
        try {
          const parsed = JSON.parse(result.value);
          setPlaces(parsed);
          organizeByCategories(parsed);
        } catch (err) {
          console.error('Error parsing saved_nearby_places:', err);
        }
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => {
            // Ubicación por defecto si no se puede obtener
            setUserLocation({ lat: -1.0, lng: -80.0 });
          }
        );
      } else {
        setUserLocation({ lat: -1.0, lng: -80.0 });
      }
    };

    loadPlaces();
    getUserLocation();
  }, []);

  const calculateDistance = (place: SavedPlace): number => {
    if (!userLocation) return 0;

    const distance = getDistance(
      { latitude: userLocation.lat, longitude: userLocation.lng },
      { latitude: place.geometry.location.lat, longitude: place.geometry.location.lng }
    );
    return Math.round(distance / 1000 * 100) / 100;
  };

  const organizeByCategories = (places: SavedPlace[]) => {
    const categoryMap: { [key: string]: SavedPlace[] } = {};

    const placesWithDistance = places.map(place => ({
      ...place,
      distance: userLocation ? calculateDistance(place) : 0
    }));

    placesWithDistance.forEach(place => {
      if (place.types && place.types.length > 0) {
        place.types.forEach(type => {
          const categoryName = getCategoryName(type);
          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = [];
          }
          categoryMap[categoryName].push(place);
        });
      } else {
        if (!categoryMap['Otros']) {
          categoryMap['Otros'] = [];
        }
        categoryMap['Otros'].push(place);
      }
    });

    const categoryList: PlaceCategory[] = Object.keys(categoryMap).map(key => ({
      title: key,
      places: [...new Set(categoryMap[key])],
      icon: getCategoryIcon(key)
    }));

    setCategories(categoryList);
  };

  const getCategoryName = (type: string): string => {
    const categoryMapping: { [key: string]: string } = {
      'restaurant': 'Restaurantes',
      'food': 'Restaurantes',
      'meal_takeaway': 'Restaurantes',
      'cafe': 'Cafeterías',
      'lodging': 'Hoteles',
      'tourist_attraction': 'Atracciones',
      'museum': 'Museos',
      'park': 'Parques',
      'shopping_mall': 'Centros Comerciales',
      'store': 'Tiendas',
      'gas_station': 'Gasolineras',
      'hospital': 'Servicios Médicos',
      'pharmacy': 'Farmacias',
      'bank': 'Bancos',
      'church': 'Lugares Religiosos',
      'school': 'Educación',
      'gym': 'Deportes y Fitness',
      'beauty_salon': 'Belleza y Bienestar',
      'car_repair': 'Servicios Automotrices',
      'night_club': 'Vida Nocturna',
      'bar': 'Bares',
      'movie_theater': 'Entretenimiento'
    };

    return categoryMapping[type] || 'Otros';
  };

  const getCategoryIcon = (category: string): string => {
    const iconMapping: { [key: string]: string } = {
      'Restaurantes': '🍽️',
      'Cafeterías': '☕',
      'Hoteles': '🏨',
      'Atracciones': '🎭',
      'Museos': '🏛️',
      'Parques': '🌳',
      'Centros Comerciales': '🛍️',
      'Tiendas': '🏪',
      'Gasolineras': '⛽',
      'Servicios Médicos': '🏥',
      'Farmacias': '💊',
      'Bancos': '🏦',
      'Lugares Religiosos': '⛪',
      'Educación': '🎓',
      'Deportes y Fitness': '💪',
      'Belleza y Bienestar': '💅',
      'Servicios Automotrices': '🔧',
      'Vida Nocturna': '🌙',
      'Bares': '🍻',
      'Entretenimiento': '🎬',
      'Otros': '📍'
    };

    return iconMapping[category] || '📍';
  };

  const scrollCarousel = (categoryTitle: string, direction: 'left' | 'right') => {
    const carousel = carouselRefs.current[categoryTitle];
    if (carousel) {
      const scrollAmount = 320;
      const currentScroll = carousel.scrollLeft;
      const newScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      carousel.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleCreateRecommendation = async () => {
    if (!currentUserData || !places) {
      return showToast(
        'Por favor, asegúrate de estar autenticado y de que los datos del clima y lugares estén disponibles.',
        6000,
        'danger'
      );
    }

    setGenerating(true);
    try {
      const allowedCategories = [
        'hoteles',
        'restaurantes',
        'cafeterías',
        'parques',
        'centros comerciales',
        'belleza y bienestar',
        'vida nocturna',
        'bares',
        'entretenimiento',
      ];

      const paredPlaces = categories
        .filter(category =>
          allowedCategories.includes(category.title.toLowerCase())
        )
        .flatMap(category => category.places)
        .filter(place =>
          place.rating && place.rating > 4 &&
          place.types.every(type => type !== 'supermarket' && type !== 'grocery_or_supermarket')
        );

      if (paredPlaces.length === 0) {
        return showToast("No hay lugares disponibles para generar una recomendación.", 6000, 'warning');
      }

      const uniquePlaces = Array.from(
        new Map(paredPlaces.map(item => [item.place_id, item])).values()
      ).sort((a, b) => (b.rating || 0) - (a.rating || 0));

      // Agregar distancias a las recomendaciones
      const placesWithDistance = uniquePlaces.map(place => ({
        ...place,
        distance: userLocation ? calculateDistance(place) : 0
      }));

      setRecommendationAi(placesWithDistance);
      setShowModal(true);
      showToast('Recomendación generada exitosamente.', 6000, 'success');

    } catch (error) {
      console.error(error);
      showToast('Error al generar la recomendación. Inténtalo de nuevo más tarde.', 6000, 'danger');
    } finally {
      setGenerating(false);
    }
  };

  const openEventModal = (place: SavedPlace) => {
    if (currentUserData?.googleToken === null) {
      showToast("Debes estar conectado a Google para poder ver los eventos.", 3000, 'warning');
      setTimeout(() => {
        router.push('/auth/google/calendar', 'forward')
      }, 3000);
      return;
    }
    setSelectedPlace(place);
    setEventTitle(`Visita a ${place.name}`);
    setEventDescription('');
    setEventDate(new Date().toISOString());
    setShowEventModal(true);
  };

  const saveEvent = async () => {
    if (!eventTitle || !selectedPlace) {
      showToast('Por favor completa el título del evento', 3000, 'warning');
      return;
    }
    setIsProgrammingEv(true);
    try {
      const reserveData = {
        id: currentUserData?.uid,
        summary: eventTitle,
        description: eventDescription ? eventDescription : `¡${currentUserData?.name} haz programado un evento para visitar ${selectedPlace.name}!`,
        eventDate: `${eventDate}-07:00`,
        duration: 60,
        country: "Ecuador"
      };

      const response = await axios.post(`${VITE_LINK_FIREBASE_FUNCTIONS}/manage-calendar`, reserveData)
      if (response.status === 500) {
        return showToast("Ha ocurrido un error , por favor intentelo nuevamente.")
      }
      if (response.status === 409) {
        return showToast("Ya haz programado un evento en esta fecha", 4000, "warning")
      }
      console.log("Datos de programación: ", response)
      const eventId = response?.data?.eventId;
      if (!eventId) {
        return showToast("Hubo un error, intentelo nuevamente...")
      }
      const date = eventDate.split("T")[0];
      const time = eventDate.split("T")[1];
      const event = {
        id: eventId,
        sm: reserveData.summary,
        d: reserveData.description,
        dt: date,
        dr: reserveData.duration,
        t: time.slice(0, 5)
      }
      const docRef = doc(db, "USERS", currentUserData?.uid);
      await setDoc(docRef, { ev: arrayUnion(event) }, { merge: true })
      showToast('Evento guardado exitosamente', 3000, 'success');
      setShowEventModal(false);
      setIsProgrammingEv(false)
    } catch (error) {
      console.log(error)
    } finally {
      setIsProgrammingEv(false)
    }
  };

  return (
    <IonPage>
      <IonHeader className="discover-header">
        <IonButton
          className="generate-recommendation-btn"
          fill="solid"
          expand="block"
          onClick={handleCreateRecommendation}
          disabled={generating}
        >
          <IonIcon icon={sparklesOutline} slot="start" />
          {generating ? 'Generando...' : 'Generar Recomendación'}
        </IonButton>
      </IonHeader>
      <IonContent className="discover-content">
        {ToastComponent}
        {places.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={location} />
            <IonText>
              <h2>No hay lugares guardados</h2>
              <p>Explora y descubre lugares interesantes</p>
            </IonText>
          </div>
        ) : (
          <div className="categories-container">
            {categories.map((category) => (
              <div key={category.title} className="category-section">
                <div className="category-header">
                  <h2 className="category-title">
                    <span className="category-icon">{category.icon}</span>
                    {category.title}
                    <span className="category-count">({category.places.length})</span>
                  </h2>
                  <div className="carousel-controls">
                    <button
                      className="carousel-btn prev"
                      onClick={() => scrollCarousel(category.title, 'left')}
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    <button
                      className="carousel-btn next"
                      onClick={() => scrollCarousel(category.title, 'right')}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                </div>

                <div
                  className="places-carousel"
                  ref={(el) => {
                    carouselRefs.current[category.title] = el;
                  }}
                >
                  {category.places.map((place, index) => (
                    <div key={`${category.title}-${index}`} className="carousel-card">
                      <div className="card-image">
                        {place.photoUrl ? (
                          <IonImg src={place.photoUrl} alt={place.name} />
                        ) : (
                          <div className="no-image">
                            <IonIcon icon={location} />
                          </div>
                        )}

                        <div className="card-overlay">
                          <div className="overlay-content">
                            <h3>{place.name}</h3>
                            <p>{place.vicinity}</p>

                            {place.rating && (
                              <div className="rating">
                                <IonIcon icon={star} />
                                <span>{place.rating}</span>
                              </div>
                            )}

                            {place.distance && (
                              <div className="distance">
                                <IonIcon icon={navigateOutline} />
                                <span>{place.distance} km {place.distance <= 20 ? "¡estas cerca!" : null}</span>
                              </div>
                            )}

                            <div className="overlay-actions">
                              <button className="action-btn primary">
                                visitar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>

      {/* Modal de Recomendaciones Mejorado */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Recomendaciones</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="recommendation-modal-content">
          {recommendationAi && recommendationAi.length > 0 ? (
            <div className="recommendations-grid">
              {recommendationAi.map((place, idx) => (
                <IonCard key={idx} className="recommendation-card-enhanced">
                  <div className="card-header">
                    {place.photoUrl ? (
                      <IonImg src={place.photoUrl} alt={place.name} />
                    ) : (
                      <div className="no-image-rec">
                        <IonIcon icon={location} />
                      </div>
                    )}
                  </div>
                  <IonCardContent>
                    <h3 className="place-name">{place.name}</h3>
                    <p className="place-vicinity">{place.vicinity}</p>
                    <div className="place-stats">
                      {place.rating && (
                        <div className="stat-item rating-stat">
                          <IonIcon icon={star} />
                          <span>{place.rating}</span>
                        </div>
                      )}
                      {place.distance && (
                        <div className="stat-item distance-stat">
                          <IonIcon icon={navigateOutline} />
                          <span>{place.distance} km {place.distance <= 20 ? "¡estas cerca!" : null}</span>
                        </div>
                      )}
                    </div>
                    <IonButton
                      onClick={() => openEventModal(place)}
                      className="program-btn"
                      fill="solid"
                      expand="block"
                    >
                      <IonIcon icon={calendarOutline} slot="start" />
                      Programar evento
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : (
            <p style={{ padding: '1rem', textAlign: 'center' }}>No hay recomendaciones.</p>
          )}
        </IonContent>
      </IonModal>

      {/* Modal de Programación de Eventos */}
      <IonModal isOpen={showEventModal} onDidDismiss={() => setShowEventModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Programar Evento</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowEventModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="event-modal">
          <div className="event-form-container">
            {selectedPlace && (
              <div className="selected-place-info">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.vicinity}</p>
                {selectedPlace.distance && (
                  <span className="distance-badge">{selectedPlace.distance} km</span>
                )}
              </div>
            )}

            <IonItem>
              <IonLabel position="stacked">Título del evento</IonLabel>
              <IonInput
                value={eventTitle}
                onIonInput={(e) => setEventTitle(e.detail.value!)}
                placeholder="Título del evento"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Descripción</IonLabel>
              <IonTextarea
                value={eventDescription}
                onIonInput={(e) => setEventDescription(e.detail.value!)}
                placeholder="Descripción del evento (opcional)"
                rows={3}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Fecha y hora</IonLabel>
              <IonDatetime
                value={eventDate}
                min={new Date().toISOString().split('T')[0]}
                onIonChange={(e) => setEventDate(e.detail.value as string)}
                presentation="date-time"
              />
            </IonItem>

            <div className="event-actions">
              <IonButton
                expand="block"
                onClick={saveEvent}
                className="save-btn"
                disabled={isProgrammingEv}
              >
                {isProgrammingEv ? "Guardando..." : "Guardar Evento"}
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Discover;