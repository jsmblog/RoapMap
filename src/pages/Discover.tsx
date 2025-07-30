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
} from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import '../styles/discover.css';
import {
  location,
  globeOutline,
  callOutline,
  star,
  navigateOutline,
  chevronBackOutline,
  chevronForwardOutline,
  sparklesOutline
} from 'ionicons/icons';
import { useAuthContext } from '../context/UserContext';
import { UseOpenWeather } from '../hooks/UseOpenWeather';
import { useToast } from '../hooks/UseToast';
import { connection } from '../connection/connection_to_backend';

type Review = {
  author_name: string;
  rating: number;
  text: string;
};

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
};

type PlaceCategory = {
  title: string;
  places: SavedPlace[];
  icon: string;
};

const Discover: React.FC = () => {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [categories, setCategories] = useState<PlaceCategory[]>([]);
  const carouselRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [generating, setGenerating] = useState<boolean>(false);
  const [recommendationAi, setRecommendationAi] = useState<SavedPlace[] | null>(null);

  console.log(recommendationAi)
  const { currentUserData } = useAuthContext();
  const { showToast, ToastComponent } = useToast();
  const [showModal, setShowModal] = useState(false);

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

    loadPlaces();
  }, []);

  const organizeByCategories = (places: SavedPlace[]) => {
    const categoryMap: { [key: string]: SavedPlace[] } = {};

    places.forEach(place => {
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
      const scrollAmount = 320; // Width of one card plus gap
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

setRecommendationAi(uniquePlaces);


      setRecommendationAi(uniquePlaces);

      setShowModal(true);
      showToast('Recomendación generada exitosamente.', 6000, 'success');

    } catch (error) {
      console.error(error);
      showToast('Error al generar la recomendación. Inténtalo de nuevo más tarde.', 6000, 'danger');
    } finally {
      setGenerating(false);
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
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Recomendaciones</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowModal(false)}>X</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="recommendation-modal-content">
          {recommendationAi && (recommendationAi as SavedPlace[]).length > 0 ? (
            (recommendationAi as SavedPlace[]).map((place, idx) => (
              <IonCard key={idx} className="recommendation-card">
                {place.photoUrl ? (
                  <IonImg src={place.photoUrl} alt={place.name} />
                ) : (
                  <div className="no-image">
                    <IonIcon icon={location} />
                  </div>
                )}
                <IonCardContent>
                  <h3>{place.name}</h3>
                  <p>{place.vicinity}</p>
                  {place.rating && (
                    <IonBadge color="warning">
                      <IonIcon icon={star} /> {place.rating}
                    </IonBadge>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <p style={{ padding: '1rem' }}>No hay recomendaciones.</p>
          )}
        </IonContent>
      </IonModal>

    </IonPage>
  );
};

export default Discover;