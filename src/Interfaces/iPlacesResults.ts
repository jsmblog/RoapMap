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