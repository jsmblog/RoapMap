import React from 'react'
import { IonButton, IonButtons, IonIcon, IonImg, IonPage, IonSegment } from '@ionic/react';
import { fingerPrint, person } from 'ionicons/icons';
import '../styles/landing.css';
const Landing: React.FC = () => {
    return (
        <IonPage className='home-page'>
            <div className='ion-content-display-flex-column'>
                <h1 className='secular-one title-app'>RoapMap</h1>
                <IonImg src='/Directions.gif' />
                <IonSegment className='ion-segment'>
                    <IonButtons className='ion-btn-display-flex-column'>
                        <IonIcon className='ion-width-icon-home' icon={person} />
                        <h6>Usuario y contraseña</h6>
                    </IonButtons>
                    <IonButtons className='ion-btn-display-flex-column'>
                        <IonIcon className='ion-width-icon-home' icon={fingerPrint} />
                        <h6>Huella /
                            Face ID</h6>
                    </IonButtons>
                </IonSegment>
                <IonButton className='ion-nav-link' routerLink='/login' fill="clear">¿ Aún no tiene una cuenta ?,  <span className='register-txt'> Regístrese</span></IonButton>
            </div>
        </IonPage>
    )
}

export default Landing