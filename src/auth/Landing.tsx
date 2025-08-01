import React from 'react'
import { IonButton, IonButtons, IonImg, IonPage, IonSegment, useIonRouter } from '@ionic/react';
import '../styles/landing.css';
const Landing: React.FC = () => {
    const navigate = useIonRouter();
    const handleLoginClick = (route: string) => {
        navigate.push(`auth/${route}`, 'forward', 'push');
    };
    return (
        <IonPage className='home-page tema-oscuro2'>
            <div className='ion-content-display-flex-column'>
               <h1 translate="no" lang="zxx" className="secular-one title-app texto-quinto">RoadMap</h1>
                <IonImg src='/Directions.gif' />
                <IonSegment className='ion-segment'>
                    <IonButton
                        onClick={() => handleLoginClick('login')}
                        className='btnInicioSesion'>
                        <h5>Iniciar Sesión</h5>
                    </IonButton>
                    <IonButton 
                    routerLink="/auth/signup" 
                    className='btnRegistro'>
                        <h5>Registrarse</h5>
                    </IonButton>
                </IonSegment>
            </div>
        </IonPage> 
    )
}

export default Landing