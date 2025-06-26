import React from 'react';
import {
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonIcon,
    IonChip,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButtons,
    IonText,
} from '@ionic/react';
import {
    star,
    starOutline,
    location,
    chevronDown,
    chevronUp,
    close,
    personCircle,
    timeOutline,
    call,
    time,
    checkmarkCircle,
    closeCircle
} from 'ionicons/icons';
import '../styles/placesResults.css';
import { PlacesResultProps } from '../Interfaces/iPlacesResults';

const PlacesResult: React.FC<PlacesResultProps> = ({
    isModalOpen,
    setIsModalOpen,
    places,
    expandedIdx,
    setExpandedIdx,
}) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<IonIcon key={i} icon={star} className="star-filled" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<IonIcon key={i} icon={star} className="star-half" />);
            } else {
                stars.push(<IonIcon key={i} icon={starOutline} className="star-empty" />);
            }
        }
        return stars;
    };

    const formatReviewDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCurrentDaySchedule = (weekdayText: string[]) => {
        const today = new Date().getDay();
        const dayIndex = today === 0 ? 6 : today - 1;
        return weekdayText[dayIndex] || null;
    };

    const isOpenNow = (place: google.maps.places.PlaceResult) => {
        return place.opening_hours?.open_now;
    };

    const formatPhoneNumber = (phone: string) => {
        return phone;
    };

    const getPriceLevel = (level?: number) => {
        if (!level) return null;
        return '€'.repeat(level);
    };

    return (
        <IonModal
            isOpen={isModalOpen}
            onDidDismiss={() => setIsModalOpen(false)}
            className="places-modal"
        >
            <IonHeader className="modal-header">
                <IonToolbar>
                    <IonTitle className="modal-title">
                        <IonText color="primary">
                            Lugares encontrados ({places.length})
                        </IonText>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            fill="clear"
                            onClick={() => {
                                setIsModalOpen(false)
                                
                            }}
                            className="close-modal-places-result"
                        >
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="places-content">
                <div className="places-container">
                    {places.map((place, index) => {
                        const isExpanded = expandedIdx === index;
                        const reviewsToShow = place.reviews ?
                            (isExpanded ? place.reviews : place.reviews.slice(0, 2)) : [];

                        return (
                            <IonCard key={index} className="place-card">
                                <div className="card-image-container">
                                    {place.photos?.length ? (
                                        <IonImg
                                            src={place.photos[0].getUrl({ maxWidth: 400, maxHeight: 200 })}
                                            alt={place.name!}
                                            className="place-image"
                                        />
                                    ) : (
                                        <div className="no-image-placeholder">
                                            <IonIcon icon={location} size="large" />
                                        </div>
                                    )}

                                    {place.rating && (
                                        <div className="rating-overlay">
                                            <IonChip color="light" className="rating-chip">
                                                <IonIcon icon={star} />
                                                <span>{place.rating.toFixed(1)}</span>
                                            </IonChip>
                                        </div>
                                    )}
                                </div>

                                <IonCardHeader className="place-header">
                                    <h1 className="place-name">
                                        {place.name}
                                    </h1>

                                    {place.vicinity && (
                                        <IonCardSubtitle className="place-address">
                                            <IonIcon icon={location} className="address-icon" />
                                            {place.vicinity}
                                        </IonCardSubtitle>
                                    )}

                                    <div className="place-meta">
                                        {place.rating && (
                                            <div className="rating-section">
                                                <div className="stars">
                                                    {renderStars(place.rating)}
                                                </div>
                                                <IonText className="rating-text">
                                                    {place.rating.toFixed(1)} ({place.user_ratings_total} reseñas)
                                                </IonText>
                                            </div>
                                        )}

                                        <div className="contact-info">
                                            {place.formatted_phone_number && (
                                                <div className="contact-item">
                                                    <IonIcon icon={call} className="contact-icon" />
                                                    <a
                                                        href={`tel:${place.formatted_phone_number}`}
                                                        className="phone-link"
                                                    >
                                                        {formatPhoneNumber(place.formatted_phone_number)}
                                                    </a>
                                                </div>
                                            )}
                                            {
                                                place.website && (
                                                    <h4>sitio web: <a href={place.website} target="_blank" rel="noopener noreferrer"></a>{place.website}</h4>
                                                )
                                            }
                                            {place.opening_hours && (
                                                <div className="opening-hours">
                                                    <div className="hours-today">
                                                        <IonIcon icon={time} className="contact-icon" />
                                                        <span className="hours-text">
                                                            {getCurrentDaySchedule(place.opening_hours.weekday_text ?? [])}
                                                        </span>
                                                        <IonChip
                                                            color={isOpenNow(place) ? "success" : "danger"}
                                                            className="status-chip"
                                                        >
                                                            <IonIcon
                                                                icon={isOpenNow(place) ? checkmarkCircle : closeCircle}
                                                            />
                                                            {isOpenNow(place) ? "Abierto" : "Cerrado"}
                                                        </IonChip>
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="full-schedule">
                                                            {place.opening_hours.weekday_text && place.opening_hours.weekday_text.map((day, idx) => (
                                                                <div key={idx} className="schedule-day">
                                                                    {day}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="place-tags">
                                            {place.types?.slice(0, 2).map((type, idx) => (
                                                <IonChip key={idx} color="tertiary" outline>
                                                    {type.replace(/_/g, ' ')}
                                                </IonChip>
                                            ))}

                                            {getPriceLevel(place.price_level) && (
                                                <IonChip color="success" outline>
                                                    {getPriceLevel(place.price_level)}
                                                </IonChip>
                                            )}
                                        </div>
                                    </div>
                                </IonCardHeader>

                                {reviewsToShow.length > 0 && (
                                    <IonCardContent className="reviews-section">
                                        <div className="reviews-header">
                                            <h3>Reseñas destacadas</h3>
                                        </div>

                                        <div className="reviews-list">
                                            {reviewsToShow.map((review, idx) => (
                                                <div key={idx} className="review-item">
                                                    <div className="review-header">
                                                        <div className="reviewer-info">
                                                            <IonIcon
                                                                icon={personCircle}
                                                                className="reviewer-avatar"
                                                            />
                                                            <div className="reviewer-details">
                                                                <span className="reviewer-name">
                                                                    {review.author_name}
                                                                </span>
                                                                {review.time && (
                                                                    <span className="review-date">
                                                                        <IonIcon icon={timeOutline} />
                                                                        {formatReviewDate(review.time)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {review.rating && (
                                                            <div className="review-rating">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="review-text">
                                                        {review.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {place.reviews && place.reviews.length > 2 && (
                                            <IonButton
                                                fill="clear"
                                                size="small"
                                                className="expand-button"
                                                onClick={() => setExpandedIdx(isExpanded ? null : index)}
                                            >
                                                <IonIcon
                                                    icon={isExpanded ? chevronUp : chevronDown}
                                                    slot="start"
                                                />
                                                {isExpanded ? 'Ver menos' : `Ver todas las reseñas (${place.reviews.length})`}
                                            </IonButton>
                                        )}
                                    </IonCardContent>
                                )}

                                {place.opening_hours && place.opening_hours.weekday_text && reviewsToShow.length === 0 && (
                                    <IonCardContent className="schedule-only-section">
                                        <IonButton
                                            fill="clear"
                                            size="small"
                                            className="expand-button"
                                            onClick={() => setExpandedIdx(isExpanded ? null : index)}
                                        >
                                            <IonIcon
                                                icon={isExpanded ? chevronUp : chevronDown}
                                                slot="start"
                                            />
                                            {isExpanded ? 'Ocultar horarios' : 'Ver todos los horarios'}
                                        </IonButton>
                                    </IonCardContent>
                                )}
                            </IonCard>
                        );
                    })}
                </div>
            </IonContent>
        </IonModal>
    );
};

export default PlacesResult;