import React from 'react';
import '../styles/nearestPlace.css';
import { NearestPlaceProps } from '../Interfaces/iPlacesResults';
import { IonIcon, IonImg, IonButton } from '@ionic/react';
import {
  location,
  time,
  call,
  globe,
  navigate,
  heart,
  share,
  close,
} from 'ionicons/icons';
import { useAchievements } from '../hooks/UseAchievements';
import { useAuthContext } from '../context/UserContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useToast } from '../hooks/UseToast';

const NearestPlace: React.FC<NearestPlaceProps> = ({ info, setInfo }) => {
  const { unlockAchievement, AchievementPopup, isAchievementUnlocked } = useAchievements();
  const { currentUserData } = useAuthContext();
  const { showToast, ToastComponent } = useToast();
  const formatRating = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const clearInfo = () => setInfo({ distance: '', duration: '', place: null });

  const handleDirections = () => {
    if (info.place?.geometry?.location) {
      const lat = info.place.geometry.location.lat();
      const lng = info.place.geometry.location.lng();
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  const handleCall = () => {
    if (info.place?.formatted_phone_number) {
      window.open(`tel:${info.place.formatted_phone_number}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share && info.place) {
      try {
        await navigator.share({
          title: info.place.name,
          text: `${info.place.name} - ${info.place.vicinity}`,
          url: info.place.website || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleFavorite = async () => {
    if (!info.place) return;
    const place = info.place;
    interface FavPlace {
      name: string;
      vicinity: string;
    }

    const hasAddPlaceFav: boolean = currentUserData.favorites.some((pl: FavPlace) => pl.name === place.name);
    if(hasAddPlaceFav) {
      return showToast("Ya tienes este lugar en favoritos",3000,'danger');
    }
 
    const favPlace = {
      name: place.name,
      vicinity: place.vicinity,
      };
    if(currentUserData.favorites.length === 4 && !isAchievementUnlocked("five_favorites")) {
        unlockAchievement("five_favorites");
    }
    try {
      await updateDoc(
        doc(db, "USERS", currentUserData?.uid),
        {
          fav:arrayUnion(favPlace),
        }
      );
      showToast("Lugar agregado a favoritos");
      if (!isAchievementUnlocked("first_favorite")) {
        unlockAchievement("first_favorite");
      }
    } catch (error) {
      console.error("Error al guardar favorito:", error);
    }
  };

  return (
    <>
      {AchievementPopup}
      {ToastComponent}
      {info.place && (
        <div className="nearest-place-card">
          <button onClick={clearInfo} className="close-nearest-place-card">
            <IonIcon icon={close} />
          </button>

          <div className="card-header">
            <div className="image-container">
              {info.place.photos?.length ? (
                <IonImg
                  src={info.place.photos[0].getUrl({ maxWidth: 400, maxHeight: 200 })}
                  alt={info.place.name!}
                  className="place-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <IonIcon icon={location} className="placeholder-icon" />
                  <span>Sin imagen</span>
                </div>
              )}
              <div className="image-overlay">
                <div className="action-buttons">
                  <button
                    className="action-btn favorite-btn"
                    aria-label="Favorito"
                    onClick={handleFavorite}
                  >
                    <IonIcon icon={heart} />
                  </button>
                  <button
                    className="action-btn share-btn"
                    onClick={handleShare}
                    aria-label="Compartir"
                  >
                    <IonIcon icon={share} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card-content">
            <div className="place-header">
              <h3 className="place-name">{info.place.name}</h3>
              {info.place.opening_hours?.open_now !== undefined && (
                <span className={`status-badge ${info.place.opening_hours.open_now ? 'open' : 'closed'}`}>
                  {info.place.opening_hours.open_now ? 'Abierto' : 'Cerrado'}
                </span>
              )}
            </div>

            <div className="place-address">
              <IonIcon icon={location} className="info-icon" />
              <span>{info.place.vicinity}</span>
            </div>

            <div className="distance-time">
              <div className="metric">
                <IonIcon icon={navigate} className="metric-icon" />
                <span className="metric-value">distancia: {info.distance}</span>
              </div>
              <div className="metric">
                <IonIcon icon={time} className="metric-icon" />
                <span className="metric-value">Tiempo estimado: {info.duration}</span>
              </div>
            </div>

            {info.place.rating && (
              <div className="rating-section-nearest-place">
                <div className="rating-stars">
                  <span className="stars">{formatRating(info.place.rating)}</span>
                  <span className="rating-number">{info.place.rating}</span>
                </div>
                <span className="reviews-count">
                  ({info.place.user_ratings_total} reseñas)
                </span>
              </div>
            )}

            <div className="contact-info">
              {info.place.formatted_phone_number && (
                <div className="contact-item">
                  <IonIcon icon={call} className="contact-icon" />
                  <span>{info.place.formatted_phone_number}</span>
                </div>
              )}
              {info.place.website && (
                <div className="contact-item">
                  <IonIcon icon={globe} className="contact-icon" />
                  <a href={info.place.website} target="_blank" rel="noreferrer" className="website-link">
                    Sitio web
                  </a>
                </div>
              )}
            </div>

            <div className="action-buttons-bottom">
              <IonButton fill="solid" className="directions-btn" onClick={handleDirections}>
                <IonIcon icon={navigate} slot="start" />
                Direcciones
              </IonButton>

              {info.place.formatted_phone_number && (
                <IonButton fill="outline" className="call-btn" onClick={handleCall}>
                  <IonIcon icon={call} slot="start" />
                  Llamar
                </IonButton>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NearestPlace;
