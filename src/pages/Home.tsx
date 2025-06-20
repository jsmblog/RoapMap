// src/pages/Home.tsx
import { signOut } from 'firebase/auth';
import './Home.css';
import { IonPage, useIonRouter } from '@ionic/react';
import { AUTH_USER } from '../Firebase/initializeApp';
import { useLoading } from '../hooks/UseLoading';

const Home: React.FC = () => {
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

  return (
    <IonPage>
      <div className="home-container">
        <h1>Hola</h1>
        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </IonPage>
  );
};

export default Home;
