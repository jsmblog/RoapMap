

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
    router.push('/');
   } catch (error) {
    console.log(error)
   } finally {
      await hideLoading();
    }
  };
  return (
    <IonPage>
 hola
 <button onClick={handleLogout}>
  cerrar sesión
 </button>
    </IonPage>
  );
};

export default Home;
