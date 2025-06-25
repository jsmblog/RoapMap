export interface PlaceMarker {
    id: string;
    lat: number;
    lng: number;
    // Add other properties as needed
}

export interface MapProps {
  searchInputRef: React.RefObject<HTMLIonSearchbarElement>;
  selectedCategory: string | null;
  placeMarkers: PlaceMarker[];
  setPlaceMarkers: React.Dispatch<React.SetStateAction<PlaceMarker[]>>;
}
export interface ListCategoriesProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}