import { getAuth, sendEmailVerification } from "firebase/auth";
import React, { useEffect, useState } from "react";
import "../styles/roomWaiting.css";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/initializeApp"; 
import { useAuthContext } from "../context/UserContext";
import { IonPage, useIonRouter } from "@ionic/react";
import { useToast } from "../hooks/UseToast";

const RoomWaiting:React.FC = () => {
  const auth = getAuth();
  const navigate = useIonRouter();
  const [isVerified, setIsVerified] = useState(auth?.currentUser?.emailVerified || false);
  const [isFirestoreUpdated, setIsFirestoreUpdated] = useState(false); 
  const {showToast,ToastComponent} = useToast();
  const { currentUserData } = useAuthContext(); 

  useEffect(() => {
    if (currentUserData?.verified) {          
      navigate.push('/home' ,'forward', 'push');
    }
  }, [currentUserData?.verified, navigate]);

  useEffect(() => {
    if (isVerified && isFirestoreUpdated) return; 

    const checkVerification = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await currentUser.reload(); 
      if (currentUser.emailVerified) {
        setIsVerified(true);

        const userId = currentUser.uid;
        const userDocRef = doc(db, "USERS", userId);
        const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            if (!docSnap.data().verified) {
              await updateDoc(userDocRef, { v: true });
            }
            setIsFirestoreUpdated(true);
            unsubscribe();
          }
        });
      }
    };

    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval); 
  }, [isVerified, isFirestoreUpdated, navigate]);

  const reenviarCorreo = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await sendEmailVerification(currentUser);
        showToast("Correo de verificación reenviado.");
      } else {
        showToast("No hay un usuario autenticado.");
      }
    } catch (error) {
      showToast("Error al reenviar el correo.");
      console.error(error);
    }
  };

  return (
    <>
      <IonPage className="room-waiting">
        {ToastComponent}
        <h1 className="merriweather-bold">¡Confirma tu correo electrónico!</h1>
        <p>
          Te hemos enviado un enlace a tu correo (no recargues la página). 
          Por favor, verifica tu bandeja de entrada y haz clic en el enlace para confirmar tu cuenta.
        </p>
        <div className="btn-container">
          <button id="resend" onClick={reenviarCorreo}>
            Reenviar correo
          </button>
          <button onClick={() => window.open("https://mail.google.com", "_blank")}>
            Abrir correo
          </button>
        </div>
        <div className="loader-spinner"></div>
      </IonPage>
    </>
  );
};

export default RoomWaiting;