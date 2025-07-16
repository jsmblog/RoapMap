export interface PlaceMarker {
  id: string;
  lat: number;
  lng: number;
}

export interface MapProps {
  searchInputRef: React.RefObject<any>;
  selectedCategory: string | null;
  placeMarkers: google.maps.Marker[];
  setPlaceMarkers: React.Dispatch<React.SetStateAction<google.maps.Marker[]>>;
  shouldRefocus?: boolean;
  setShouldRefocus?: (v: boolean) => void;
}
export interface ListCategoriesProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}

export interface DetailedPlace extends google.maps.places.PlaceResult {
  photos?: google.maps.places.PlacePhoto[];
  reviews?: google.maps.places.PlaceReview[];
  formatted_phone_number?: string;
  opening_hours?: google.maps.places.PlaceOpeningHours;
  website?: string;
}

export interface LocationDetails {
  country: string;
  state: string;
  city: string;
}
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}