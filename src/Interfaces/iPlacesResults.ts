export interface PlacesResultProps {
    isModalOpen: boolean;
    places: google.maps.places.PlaceResult[];
    expandedIdx: number | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setExpandedIdx: React.Dispatch<React.SetStateAction<number | null>>;
}

export interface NearestPlaceProps {
  info: {
    distance: string;
    duration: string;
    place: google.maps.places.PlaceResult | null;
  };
  setInfo: (info: any) => void;
}

export interface FilterOptions {
  types: string[];
  radius: number;
  openNow: boolean;
  minRating: number;
  priceLevels: number[];
  accessibility: boolean;
  parking: boolean;
  wifi: boolean;
  takeout: boolean;
  delivery: boolean;
  sortBy: 'distance' | 'rating' | 'relevance' | 'price';
}

export interface SearchBarProps {
  setIsModalOpen: (open: boolean) => void;
  searchInputRef: React.RefObject<HTMLIonSearchbarElement | null>;
  onClear: () => void;
  onFilterChange?: (options: FilterOptions) => void;
}