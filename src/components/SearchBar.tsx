import { IonAvatar, IonImg, IonSearchbar } from "@ionic/react";
import React from "react";

interface SearchBarProps {
  setIsModalOpen: (open: boolean) => void;
  searchInputRef: React.RefObject<HTMLIonSearchbarElement | null>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setIsModalOpen, searchInputRef }) => (
  <div className="banner">
    <IonSearchbar
      id="search-bar"
      ref={searchInputRef}
      className="custom-searchbar"
      animated
      debounce={500}
      showCancelButton="focus"
      placeholder="Busca un lugar..."
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
