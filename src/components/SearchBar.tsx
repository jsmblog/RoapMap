import React, { useState, useRef } from "react";
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
} from "@ionic/react";
import {
  closeOutline,
  locationOutline,
  timeOutline,
  starOutline,
  cardOutline,
  accessibilityOutline,
  carOutline,
  wifiOutline,
  restaurantOutline,
  funnel,
} from "ionicons/icons";
import { categories } from "../functions/categories";
import "../styles/searchbar.css";
import { SearchBarProps } from "../Interfaces/iPlacesResults";
import { useAuthContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const SearchBar: React.FC<SearchBarProps> = ({
  setIsModalOpen,
  searchInputRef,
  onClear,
  onFilterChange,
}) => {
  const { currentUserData } = useAuthContext();
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
  const [sortBy, setSortBy] = useState<
    "distance" | "rating" | "relevance" | "price"
  >("relevance");
  const [activeFilterTab, setActiveFilterTab] = useState<
    "categories" | "features" | "preferences"
  >("categories");

  const { t } = useTranslation();

  const scrollRef = useRef<HTMLIonContentElement>(null);

  const toggleType = (placeType: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      next.has(placeType) ? next.delete(placeType) : next.add(placeType);
      return next;
    });
  };

  const togglePrice = (level: number) => {
    setPriceLevels((prev) => {
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
    if (sortBy !== "relevance") count++;
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
    setSortBy("relevance");
  };

  const cancelFilters = () => {
    setShowFilter(false);
  };

  const getPriceSymbol = (level: number) =>level === 0 ? t("search.features.priceLevels.0") : "$".repeat(level);
  const getPriceDescription = (level: number) => t(`search.features.priceLevels.${level}`);
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
            placeholder={t("search.placeholder")}
            onIonClear={onClear}
          />
          <div className="search-actions">
            <IonButton
              fill="clear"
              className="filter-button"
              onClick={() => setShowFilter(true)}
            >
              <IonIcon icon={funnel} />
              {getActiveFiltersCount() > 0 && (
                <IonBadge className="filter-badge">
                  {getActiveFiltersCount()}
                </IonBadge>
              )}
            </IonButton>
            <IonAvatar
              className="profile-avatar"
              onClick={() => setIsModalOpen(true)}
            >
              <IonImg
                src={
                  currentUserData?.photo
                    ? currentUserData?.photo
                    : "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
                alt="avatar"
              />
            </IonAvatar>
          </div>
        </div>

        {getActiveFiltersCount() > 0 && (
          <div className="active-filters">
            {selectedTypes.size > 0 && (
              <IonChip className="filter-chip">
                <IonLabel>
                  {selectedTypes.size} {t("search.tabs.categories")}
                </IonLabel>
              </IonChip>
            )}
            {radius !== 1000 && (
              <IonChip className="filter-chip">
                <IonIcon icon={locationOutline} />
                <IonLabel>
                  {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}
                </IonLabel>
              </IonChip>
            )}
            {openNow && (
              <IonChip className="filter-chip">
                <IonIcon icon={timeOutline} />
                <IonLabel>{t("search.features.openNow")}</IonLabel>
              </IonChip>
            )}
            {minRating > 0 && (
              <IonChip className="filter-chip">
                <IonIcon icon={starOutline} />
                <IonLabel>
                  {minRating}+ {t("search.features.minRating")}
                </IonLabel>
              </IonChip>
            )}
            {priceLevels.size > 0 && (
              <IonChip className="filter-chip">
                <IonIcon icon={cardOutline} />
                <IonLabel>
                  {priceLevels.size} {t("search.features.price")}
                </IonLabel>
              </IonChip>
            )}
          </div>
        )}
      </div>

      <IonModal
        isOpen={showFilter}
        onDidDismiss={() => setShowFilter(false)}
        className="filter-modal"
      >
        <IonHeader className="modal-header">
          <IonToolbar>
            <IonTitle className="texto-quinto">{t("search.title")}</IonTitle>
            <IonButtons slot="end">
              <IonButton fill="clear" onClick={cancelFilters}>
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent ref={scrollRef} className="filter-content">
          <div className="filter-tabs tema-oscuro2">
            <IonSegment
              value={activeFilterTab}
              onIonChange={(e) => setActiveFilterTab(e.detail.value as any)}
              className="filter-segment"
            >
              <IonSegmentButton value="categories">
                <IonLabel className="texto-quinto">
                  {t("search.tabs.categories")}
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="features">
                <IonLabel className="texto-quinto">
                  {t("search.tabs.features")}
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="preferences">
                <IonLabel className="texto-quinto">
                  {t("search.tabs.preferences")}
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Categories Tab */}
          {activeFilterTab === "categories" && (
            <div className="filter-section tema-oscuro2">
              <div className="section-header">
                <h3 className="texto-quinto">{t("search.categories.title")}</h3>
                <p className="texto-secundario">
                  {t("search.categories.description")}
                </p>
              </div>
              <div className="categories-grid">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-card ${
                      selectedTypes.has(cat.place) ? "selected" : ""
                    } tema-oscuro3`}
                    onClick={() => toggleType(cat.place)}
                  >
                    <div className="category-content">
                      <span className="category-name iconos-oscuros">
                        {t(`categories.${cat.name}`)}
                      </span>
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
          {activeFilterTab === "features" && (
            <div className="filter-section tema-oscuro2">
              <div className="section-header">
                <h3 className="texto-quinto">
                  {t("search.features.radiusTitle")}
                </h3>
              </div>

              <div className="feature-item tema-oscuro3">
                <div className="feature-header">
                  <IonIcon icon={locationOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">
                      {t("search.features.radiusSubTitle")}
                    </IonLabel>
                    <p className="feature-subtitle">
                      {radius >= 1000
                        ? `${radius / 1000} km`
                        : `${radius} metros`}
                    </p>
                  </div>
                </div>
                <IonRange
                  min={100}
                  max={100000}
                  step={100}
                  snaps
                  value={radius}
                  onIonChange={(e) => setRadius(e.detail.value as number)}
                  className="custom-range"
                />
              </div>

              <div className="feature-item tema-oscuro3">
                <div className="feature-toggle">
                  <div className="toggle-info">
                    <IonIcon icon={timeOutline} className="feature-icon" />
                    <div>
                      <IonLabel className="feature-title">
                        {t("search.features.openNow")}
                      </IonLabel>
                      <p className="feature-subtitle">
                        {t("search.features.openNowDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={openNow}
                    onIonChange={(e) => setOpenNow(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>
              </div>

              <div className="section-header">
                <h3 className="texto-quinto">
                  {t("search.features.QualityAndPrice")}
                </h3>
              </div>

              <div className="feature-item tema-oscuro3">
                <div className="feature-header">
                  <IonIcon icon={starOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">
                      {t("search.features.minRating")}
                    </IonLabel>
                    <p className="feature-subtitle">
                      {t("search.features.minRatingDescription")}
                    </p>
                  </div>
                </div>
                <div className="rating-buttons">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={`rating-btn ${
                        minRating === rating ? "active" : ""
                      }`}
                      onClick={() => setMinRating(rating)}
                    >
                      {rating === 0 ? t("search.features.all") : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="feature-item tema-oscuro3">
                <div className="feature-header">
                  <IonIcon icon={cardOutline} className="feature-icon" />
                  <div>
                    <IonLabel className="feature-title">
                      {t("search.features.priceRange")}
                    </IonLabel>
                    <p className="feature-subtitle texto-secundario">
                      {t("search.features.priceDescription")}
                    </p>
                  </div>
                </div>
                <div className="price-grid">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`price-card ${
                        priceLevels.has(level) ? "selected" : ""
                      }`}
                      onClick={() => togglePrice(level)}
                    >
                      <div className="price-symbol">
                        {getPriceSymbol(level)}
                      </div>
                      <div className="price-description">
                        {getPriceDescription(level)}
                      </div>
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
          {activeFilterTab === "preferences" && (
            <div className="filter-section tema-oscuro2">
              <div className="section-header">
                <h3 className="texto-quinto">
                  {t("search.preferences.AdditionalServicesDeciption")}
                </h3>
                <p className="texto-secundario">
                  {t("search.preferences.AdditionalServicesDeciption")}
                </p>
              </div>

              <div className="preferences-list">
                <div className="preference-item tema-oscuro3">
                  <div className="preference-info">
                    <IonIcon
                      icon={accessibilityOutline}
                      className="preference-icon"
                    />
                    <div>
                      <IonLabel className="preference-title texto-terciario">
                        {t("search.preferences.accessible")}
                      </IonLabel>
                      <p className="preference-subtitle texto-cuaternario">
                        {t("search.preferences.accessibleDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={accessibility}
                    onIonChange={(e) => setAccessibility(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item tema-oscuro3">
                  <div className="preference-info">
                    <IonIcon icon={carOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title texto-terciario">
                        {t("search.preferences.parking")}
                      </IonLabel>
                      <p className="preference-subtitle texto-cuaternario">
                        {t("search.preferences.parkingDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={parking}
                    onIonChange={(e) => setParking(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item tema-oscuro3">
                  <div className="preference-info">
                    <IonIcon icon={wifiOutline} className="preference-icon" />
                    <div>
                      <IonLabel className="preference-title texto-terciario">
                        {t("search.preferences.wifi")}
                      </IonLabel>
                      <p className="preference-subtitle texto-cuaternario">
                        {t("search.preferences.wifiDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={wifi}
                    onIonChange={(e) => setWifi(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item tema-oscuro3">
                  <div className="preference-info">
                    <IonIcon
                      icon={restaurantOutline}
                      className="preference-icon"
                    />
                    <div>
                      <IonLabel className="preference-title texto-terciario">
                        {t("search.preferences.takeout")}
                      </IonLabel>
                      <p className="preference-subtitle texto-cuaternario">
                        {t("search.preferences.takeoutDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={takeout}
                    onIonChange={(e) => setTakeout(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>

                <div className="preference-item tema-oscuro3">
                  <div className="preference-info">
                    <IonIcon
                      icon={restaurantOutline}
                      className="preference-icon"
                    />
                    <div>
                      <IonLabel className="preference-title texto-terciario">
                        {t("search.preferences.delivery")}
                      </IonLabel>
                      <p className="preference-subtitle texto-cuaternario">
                        {t("search.preferences.deliveryDescription")}
                      </p>
                    </div>
                  </div>
                  <IonToggle
                    checked={delivery}
                    onIonChange={(e) => setDelivery(e.detail.checked)}
                    className="custom-toggle"
                  />
                </div>
              </div>

              <div className="section-header">
                <h3 className="texto-quinto">{t("search.sort.title")}</h3>
                <p className="texto-secundario">
                  {t("search.sort.description")}
                </p>
              </div>

              <div className="sort-options">
                {[
                  {
                    value: "relevance",
                    label: t("search.sort.relevance.label"),
                    subtitle: t("search.sort.relevance.subtitle"),
                  },
                  {
                    value: "distance",
                    label: t("search.sort.distance.label"),
                    subtitle: t("search.sort.distance.subtitle"),
                  },
                  {
                    value: "rating",
                    label: t("search.sort.rating.label"),
                    subtitle: t("search.sort.rating.subtitle"),
                  },
                  {
                    value: "price",
                    label: t("search.sort.price.label"),
                    subtitle: t("search.sort.price.subtitle"),
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={`sort-option ${
                      sortBy === option.value ? "selected" : ""
                    } tema-oscuro3`}
                    onClick={() => setSortBy(option.value as any)}
                  >
                    <div className="sort-content">
                      <IonLabel className="sort-title texto-terciario">
                        {option.label}
                      </IonLabel>
                      <p className="sort-subtitle texto-cuaternario">
                        {option.subtitle}
                      </p>
                    </div>
                    <div className="sort-radio">
                      <div
                        className={`radio-dot ${
                          sortBy === option.value ? "active" : ""
                        }`}
                      />
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
                className="clear-button texto-secundario"
                disabled={getActiveFiltersCount() === 0}
              >
                {t("search.clear")}
              </IonButton>
              <IonButton onClick={applyFilters} className="apply-button">
                {t("search.apply")}{" "}
                {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </IonButton>
            </div>
          </IonToolbar>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default SearchBar;
