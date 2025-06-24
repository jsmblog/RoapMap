import { IonAvatar, IonImg, IonSearchbar } from '@ionic/react'
import React from 'react'

interface SearchBarProps {
  setIsModalOpen: (open: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setIsModalOpen }) => {
  return (
    <div className="banner">
                  <IonSearchbar
                    className="custom-searchbar"
                    animated={true}
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
  )
}

export default SearchBar