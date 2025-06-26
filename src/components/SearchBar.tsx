import { IonAvatar, IonImg, IonSearchbar } from "@ionic/react";
import React from "react";

interface SearchBarProps {
  setIsModalOpen: (open: boolean) => void;
  searchInputRef: React.RefObject<HTMLIonSearchbarElement | null>;
  onClear: () => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({
  setIsModalOpen,
  searchInputRef,
  onClear,
}) => (
  <div className="banner">
    <IonSearchbar
      id="search-bar"
      ref={searchInputRef}
      className="custom-searchbar"
      animated
      debounce={500}
      showCancelButton="focus"
      placeholder="Busca un lugar..."
      onIonClear={onClear} 
    />
    <IonAvatar onClick={() => setIsModalOpen(true)}>
      <IonImg
        src="https://ionicframework.com/docs/img/demos/avatar.svg"
        alt="avatar"
      />
    </IonAvatar>
  </div>
);

export default SearchBar;
