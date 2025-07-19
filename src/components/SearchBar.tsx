import React, { useState, useRef } from 'react';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonSearchbar,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonCheckbox,
  IonFooter,
  IonRange,
  IonToggle,
  IonChip,
  IonBadge,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { 
  filterOutline, 
  closeOutline, 
  locationOutline,
  timeOutline,
  starOutline,
  cardOutline,
  accessibilityOutline,
  carOutline,
  wifiOutline,
  restaurantOutline
} from 'ionicons/icons';
import { categories } from '../functions/categories';
import '../styles/searchbar.css';
import { SearchBarProps } from '../Interfaces/iPlacesResults';
import { useAuthContext } from '../context/UserContext';

const SearchBar: React.FC<SearchBarProps> = ({
  setIsModalOpen,
  searchInputRef,
  onClear,
  onFilterChange,
}) => {
  const {  currentUserData } = useAuthContext();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [radius, setRadius] = useState(1000);
  const [openNow, setOpenNow] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceLevels, setPriceLevels] = useState<Set<number>>(new Set());
  const [accessibility, setAccessibility] = useState(false);
  const [parking, setParking] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [takeout, setTakeout] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'relevance' | 'price'>('relevance');
  const [activeFilterTab, setActiveFilterTab] = useState<'categories' | 'features' | 'preferences'>('categories');

  const scrollRef = useRef<HTMLIonContentElement>(null);

  const toggleType = (placeType: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(placeType) ? next.delete(placeType) : next.add(placeType);
      return next;
    });
  };

  const togglePrice = (level: number) => {
    setPriceLevels(prev => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedTypes.size > 0) count++;
    if (radius !== 1000) count++;
    if (openNow) count++;
    if (minRating > 0) count++;
    if (priceLevels.size > 0) count++;
    if (accessibility || parking || wifi || takeout || delivery) count++;
    if (sortBy !== 'relevance') count++;
    return count;
  };

  const applyFilters = () => {
    onFilterChange?.({
      types: Array.from(selectedTypes),
      radius,
      openNow,
      minRating,
      priceLevels: Array.from(priceLevels),
      accessibility,
      parking,
      wifi,
      takeout,
      delivery,
      sortBy,
    });
    setShowFilter(false);
  };

  const clearAllFilters = () => {
    setSelectedTypes(new Set());
    setRadius(1000);
    setOpenNow(false);
    setMinRating(0);
    setPriceLevels(new Set());
    setAccessibility(false);
    setParking(false);
    setWifi(false);
    setTakeout(false);
    setDelivery(false);
    setSortBy('relevance');
  };

  const cancelFilters = () => {
    setShowFilter(false);
  };

  const getPriceSymbol = (level: number) => {
    if (level === 0) return 'Gratis';
    return '$'.repeat(level);
  };

  const getPriceDescription = (level: number) => {
    const descriptions = ['Gratis', 'Económico', 'Moderado', 'Caro', 'Muy caro'];
    return descriptions[level] || '';
  };

  
  return (
    <>
      <div className="search-container">
        <div className="search-bar-wrapper">
          <IonSearchbar
            id="search-bar"
            ref={searchInputRef}
            className="modern-searchbar"
            animated
            debounce={500}
            showCancelButton="focus"
            placeholder="¿Qué estás buscando?"
            onIonClear={onClear}
          />
          <div className="search-actions">
            <IonButton 
              fill="clear" 
              className="filter-button"
              onClick={() => setShowFilter(true)}
            >
              <IonIcon icon={filterOutline} />
              {getActiveFiltersCount() > 0 && (
                <IonBadge className="filter-badge">{getActiveFiltersCount()}</IonBadge>
              )}
            </IonButton>
            <IonAvatar className="profile-avatar" onClick={() => setIsModalOpen(true)}>
              <IonImg
                src={currentUserData.photo ? currentUserData.photo : "https://ionicframework.com/docs/img/demos/avatar.svg"}
                alt="avatar"
              />
            </IonAvatar>
          </div>
        </div>

        {getActiveFiltersCount() > 0 && (
          <div className="active-filters">
            {selectedTypes.size > 0 && (
              <IonChip className="filter-chip">
                <IonLabel>{selectedTypes.size} categorías</IonLabel>
              </IonChip>
            )}
            {radius !== 1000 && (
              <IonChip className="filter-chip">
                <IonIcon icon={locationOutline} />
                <IonLabel>{radius >= 1000 ? `${radius/1000}km` : `${radius}m`}</IonLabel>
              </IonChip>
            )}
            {openNow && (
              <IonChip className="filter-chip">
                <IonIcon icon={timeOutline} />
                <IonLabel>Abierto ahora</IonLabel>
              </IonChip>
            )}
            {minRating > 0 && (
              <IonChip className="filter-chip">
                <IonIcon icon={starOutline} />
                <IonLabel>{minRating}+ estrellas</IonLabel>
              </IonChip>
            )}
            {priceLevels.size > 0 && (
              <IonChip className="filter-chip">
                <IonIcon icon={cardOutline} />
                <IonLabel>{priceLevels.size} precios</IonLabel>
              </IonChip>
            )}
          </div>
        )}
      </div>

      <IonModal isOpen={showFilter} onDidDismiss={() => setShowFilter(false)} className="filter-modal">
        <IonHeader className="modal-header">
          <IonToolbar>
            <IonTitle>Filtros de búsqueda</IonTitle>
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={cancelFilters}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={scrollRef} className="filter-content">
          <div className="filter-tabs">
            <IonSegment 
              value={activeFilterTab} 
              onIonChange={e => setActiveFilterTab(e.detail.value as any)}
              className="filter-segment"
            >
              <IonSegmentButton value="categories">
                <IonLabel>Categorías</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="features">
                <IonLabel>Características</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="preferences">
                <IonLabel>Preferencias</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Categories Tab */}
          {activeFilterTab === 'categories' && (
            <div className="filter-section">
              <div className="section-header">
                <h3>Tipos de lugares</h3>
                <p>Selecciona las categorías que te interesan</p>
              </div>
              <div className="categories-grid">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    className={`category-card ${selectedTypes.has(cat.place) ? 'selected' : ''}`}
                    onClick={() => toggleType(cat.place)}
                  >
                    <div className="category-content">
                      <span className="category-name">{cat.name}</span>
                      <IonCheckbox
                        checked={selectedTypes.has(cat.place)}
                        onIonChange={() => toggleType(cat.place)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeFilterTab === 'features' && (
            <div className="filter-section">
              <div className="section-header">
                <h3>Distancia y horarios</h3>
              </div>
              
              <div className="feature-item">
                <div className="feature-header">
                  <IonIcon icon={locationOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">Radio de búsqueda</IonLabel>
                    <p className="feature-subtitle">{radius >= 1000 ? `${radius/1000} km` : `${radius} metros`}</p>
                  </div>
                </div>
                <IonRange
                  min={100}
                  max={100000}
                  step={100}
                  snaps
                  value={radius}
                  onIonChange={e => setRadius(e.detail.value as number)}
                  className="custom-range"
                />
              </div>

              <div className="feature-item">
                <div className="feature-toggle">
                  <div className="toggle-info">
                    <IonIcon icon={timeOutline} className="feature-icon" />
                    <div>
                      <IonLabel className="feature-title">Solo lugares abiertos</IonLabel>
                      <p className="feature-subtitle">Mostrar únicamente lugares abiertos ahora</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={openNow}
                    onIonChange={e => setOpenNow(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>
              </div>

              <div className="section-header">
                <h3>Calidad y precio</h3>
              </div>

              <div className="feature-item">
                <div className="feature-header">
                  <IonIcon icon={starOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">Calificación mínima</IonLabel>
                    <p className="feature-subtitle">Solo lugares con buenas reseñas</p>
                  </div>
                </div>
                <div className="rating-buttons">
                  {[0,1,2,3,4,5].map(rating => (
                    <button
                      key={rating}
                      className={`rating-btn ${minRating === rating ? 'active' : ''}`}
                      onClick={() => setMinRating(rating)}
                    >
                      {rating === 0 ? 'Todas' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-header">
                  <IonIcon icon={cardOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">Rango de precios</IonLabel>
                    <p className="feature-subtitle">Selecciona los precios que te convengan</p>
                  </div>
                </div>
                <div className="price-grid">
                  {[0,1,2,3,4].map(level => (
                    <div
                      key={level}
                      className={`price-card ${priceLevels.has(level) ? 'selected' : ''}`}
                      onClick={() => togglePrice(level)}
                    >
                      <div className="price-symbol">{getPriceSymbol(level)}</div>
                      <div className="price-description">{getPriceDescription(level)}</div>
                      <IonCheckbox
                        checked={priceLevels.has(level)}
                        onIonChange={() => togglePrice(level)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeFilterTab === 'preferences' && (
            <div className="filter-section">
              <div className="section-header">
                <h3>Servicios adicionales</h3>
                <p>Características especiales que buscas</p>
              </div>

              <div className="preferences-list">
                <div className="preference-item">
                  <div className="preference-info">
                    <IonIcon icon={accessibilityOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title">Accesible</IonLabel>
                      <p className="preference-subtitle">Lugares accesibles para personas con discapacidad</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={accessibility}
                    onIonChange={e => setAccessibility(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <IonIcon icon={carOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title">Estacionamiento</IonLabel>
                      <p className="preference-subtitle">Lugares con parking disponible</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={parking}
                    onIonChange={e => setParking(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <IonIcon icon={wifiOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title">WiFi gratuito</IonLabel>
                      <p className="preference-subtitle">Conexión a internet disponible</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={wifi}
                    onIonChange={e => setWifi(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <IonIcon icon={restaurantOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title">Para llevar</IonLabel>
                      <p className="preference-subtitle">Lugares que ofrecen comida para llevar</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={takeout}
                    onIonChange={e => setTakeout(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <IonIcon icon={restaurantOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title">Entrega a domicilio</IonLabel>
                      <p className="preference-subtitle">Servicio de delivery disponible</p>
                    </div>
                  </div>
                  <IonToggle
                    checked={delivery}
                    onIonChange={e => setDelivery(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>
              </div>

              <div className="section-header">
                <h3>Ordenar resultados</h3>
                <p>¿Cómo prefieres ver los resultados?</p>
              </div>

              <div className="sort-options">
                {[
                  { value: 'relevance', label: 'Relevancia', subtitle: 'Los más populares' },
                  { value: 'distance', label: 'Distancia', subtitle: 'Los más cercanos' },
                  { value: 'rating', label: 'Calificación', subtitle: 'Mejor valorados' },
                  { value: 'price', label: 'Precio', subtitle: 'Más económicos' },
                ].map(option => (
                  <div
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? 'selected' : ''}`}
                    onClick={() => setSortBy(option.value as any)}
                  >
                    <div className="sort-content">
                      <IonLabel className="sort-title">{option.label}</IonLabel>
                      <p className="sort-subtitle">{option.subtitle}</p>
                    </div>
                    <div className="sort-radio">
                      <div className={`radio-dot ${sortBy === option.value ? 'active' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </IonContent>

        <IonFooter className="modal-footer">
          <IonToolbar>
            <div className="footer-actions">
              <IonButton 
                fill="clear" 
                onClick={clearAllFilters}
                className="clear-button"
                disabled={getActiveFiltersCount() === 0}
              >
                Limpiar todo
              </IonButton>
              <IonButton 
                onClick={applyFilters}
                className="apply-button"
              >
                Aplicar filtros {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default SearchBar;