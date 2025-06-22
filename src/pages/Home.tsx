import { useState } from "react";
import "../styles/Home.css";
import { IonButton, IonContent, IonPage, useIonRouter } from "@ionic/react";
import ModalProfile from "../Components/ModalProfile";
import { useLoading } from "../hooks/UseLoading";
import { signOut } from "firebase/auth";
import { AUTH_USER } from "../Firebase/initializeApp";
import { useAuthContext } from "../context/UserContext";

const Home: React.FC = () => {
 const {currentUserData}= useAuthContext();

  const router = useIonRouter();
  const { showLoading, hideLoading } = useLoading();

  const handleLogout = async () => {
    showLoading('Cerrando sesión...');
    try {
      await signOut(AUTH_USER);
      await hideLoading();
      router.push('/', 'root', 'replace');
    } catch (error) {
      console.error(error);
      await hideLoading();
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="user-profile">
          <IonButton 
          className="button-modal"
          onClick={()=>setIsModalOpen(true)}
          id="open-modal" 
          expand="block"
          >
            <img
              className="user-avatar"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
              alt="avatar"
            />
          </IonButton>

          <div className="user-info">
            <h2 className="user-name">¡Hola,{currentUserData.name}!</h2>
            <p className="user-hora">viernes, 30 junio</p>
          </div>
        </div>


       <button onClick={handleLogout}>
          Cerrar sesión
        </button>

       <ModalProfile 
       isOpen={isModalOpen}
       onClose={()=>setIsModalOpen(false)} />

      </IonContent>
    </IonPage>
  );
};

export default Home;
