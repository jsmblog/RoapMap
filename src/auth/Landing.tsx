import React from 'react'
import { IonButton, IonButtons, IonIcon, IonImg, IonPage, IonSegment, useIonRouter } from '@ionic/react';
import { fingerPrint, person } from 'ionicons/icons';
import '../styles/landing.css';
const Landing: React.FC = () => {
    const navigate = useIonRouter();
    const handleLoginClick = (route: string) => {
        navigate.push(`auth/${route}`, 'forward', 'push');
    };
    return (
        <IonPage className='home-page'>
            <div className='ion-content-display-flex-column'>
               <h1 translate="no" lang="zxx" className="secular-one title-app">RoadMap</h1>
                <IonImg src='/Directions.gif' />
                <IonSegment className='ion-segment'>
                    <IonButtons
                        onClick={() => handleLoginClick('login')}
                        className='ion-btn-display-flex-column'>
                        <IonIcon className='ion-width-icon-home' icon={person} />
                        <h5>Usuario y contraseña</h5>
                    </IonButtons>
                    <IonButtons className='ion-btn-display-flex-column'>
                        <IonIcon
                            className='ion-width-icon-home' icon={fingerPrint} />
                        <h5>Huella /
                            Face ID</h5>
                    </IonButtons>
                </IonSegment>
                <IonButton className='ion-nav-link' routerLink="/auth/signup" fill="clear">¿ Aún no tiene una cuenta ?,  <span className='register-txt'> Regístrese</span></IonButton>
            </div>
        </IonPage>
    )
}

export default Landing