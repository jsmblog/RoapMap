export interface PlaceMarker {
    id: string;
    lat: number;
    lng: number;
    // Add other properties as needed
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