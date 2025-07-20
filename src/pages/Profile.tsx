import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonImg,
    IonSpinner,
    IonText,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonButtons,
    IonBackButton
} from '@ionic/react';
import {
    locationOutline,
    heartOutline,
    chatbubbleOutline,
    paperPlaneOutline,
    ellipsisHorizontal,
    addOutline,
    checkmarkCircle,
    chevronBack,
    checkmark
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import '../styles/profile.css';
import { useToast } from '../hooks/UseToast';
import { useAuthContext } from '../context/UserContext';
import { removeFriend } from '../functions/removeFriend';
import { UserProfile } from '../Interfaces/iUserProfile';

const STORAGE_KEY = 'visited_profile_';

const Profile: React.FC = () => {
    const { uid } = useParams<{ uid: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const { showToast, ToastComponent } = useToast();
    const { currentUserData } = useAuthContext();

    useEffect(() => {
        const loadProfile = async () => {
            if (!uid) return;
            setLoading(true);

            const prefKey = STORAGE_KEY + uid;
            const { value } = await Preferences.get({ key: prefKey });

            if (value) {
                try {
                    const cached = JSON.parse(value) as UserProfile;
                    setProfile(cached);
                } catch {
                    // ignore parse errors
                }
            }

            if (!value) {
                const userRef = doc(db, 'USERS', uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    const data = snap.data() as any;
                    const userData: UserProfile = {
                        uid: data.uid,
                        n: data.n,
                        e: data.e,
                        d: data.d,
                        g: data.g,
                        pt: data.pt,
                        ach: data.ach || [],
                        fav: data.fav || [],
                        f: data.f || [],
                        h: data.h || [],
                        loc: data.loc,
                        pre: data.pre || [],
                        v: data.v,
                        ca: data.ca,
                        b: data.b
                    };
                    setProfile(userData);
                    setIsFollowing(currentUserData?.followers?.includes(userData.uid) || false);
                    await Preferences.set({
                        key: prefKey,
                        value: JSON.stringify(userData)
                    });
                }
            }
            setLoading(false);
        };

        loadProfile();
    }, [uid]);

    if (loading) {
        return (
            <IonPage className="profile-page">
                <IonContent className="loading-content">
                    <div className="loading-container">
                        <IonSpinner name="crescent" color="primary" />
                        <IonText color="medium">Cargando perfil...</IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    if (!profile) {
        return (
            <IonPage className="profile-page">
                <IonContent className="error-content">
                    <div className="error-container">
                        <IonText color="medium">Perfil no encontrado</IonText>
                    </div>
                </IonContent>
            </IonPage>
        );
    }

    const follow = async () => {
        if (currentUserData?.uid === profile.uid) {
            return showToast('No puedes seguirte a ti mismo', 3000, 'warning');
        }

        try {
            const hasFollowed: boolean = currentUserData.followers?.some((f: { uid: string }) => f.uid === profile.uid);

            const docRef = doc(db, 'USERS', currentUserData?.uid);
            if (hasFollowed) {
                removeFriend(currentUserData.uid,currentUserData.followers, profile.uid);
                return showToast(`Dejaste de seguir a ${profile.n}`, 4000, 'success');
            }

            const userFollow = {
                uid: profile.uid,
                n: profile.n,
                pt: profile.pt || '',
            }

            await setDoc(docRef, {
                f: arrayUnion(userFollow)
            }, { merge: true });
            showToast(`Siguiendo a ${profile.n}`, 3000, 'success');
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <IonPage className="profile-page">
            <IonHeader className="profile-header-bar">
                <IonToolbar className="profile-toolbar">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" className="iconos-oscuros" icon={chevronBack} text='' />
                    </IonButtons>
                    <IonTitle className="profile-header-title">{profile.n}</IonTitle>
                    <IonButton slot="end" fill="clear" className="header-menu-btn">
                        <IonIcon icon={ellipsisHorizontal} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="profile-content">
                {ToastComponent}
                <div className="profile-header-section">
                    <IonGrid>
                        <IonRow className="profile-main-row">
                            <IonCol size="4" className="avatar-col">
                                <div className="profile-avatar-container">
                                    <IonAvatar className="profile-avatar-large">
                                        <IonImg src={profile.pt || '/assets/default-avatar.png'} />
                                    </IonAvatar>
                                    {profile.v && (
                                        <IonIcon
                                            icon={checkmarkCircle}
                                            className="verified-badge"
                                        />
                                    )}
                                </div>
                            </IonCol>

                            {/* Stats */}
                            <IonCol size="8" className="stats-col">
                                <IonGrid>
                                    <IonRow className="stats-row">
                                        <IonCol className="stat-item">
                                            <div className="stat-number">{profile.fav?.length || 0}</div>
                                            <div className="stat-label">lugares</div>
                                        </IonCol>
                                        <IonCol className="stat-item">
                                            <div className="stat-number">{profile.ach?.length || 0}</div>
                                            <div className="stat-label">logros</div>
                                        </IonCol>
                                        <IonCol className="stat-item">
                                            <div className="stat-number">{profile.h?.length || 0}</div>
                                            <div className="stat-label">historias</div>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    {/* User Info */}
                    <div className="user-info-section">
                        <h2 className="display-name">{profile.n}</h2>
                        <p className="bio-text">{profile.d}</p>
                        {profile.loc && (
                            <div className="location-info">
                                <IonIcon icon={locationOutline} className="location-icon" />
                                <span className="location-text">
                                    Coordenadas: {profile.loc.lat.toFixed(4)}, {profile.loc.lng.toFixed(4)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="action-buttons-section">
                        <IonButton
                            expand="block"
                            className={`follow-button ${currentUserData.followers.some((f: { uid: string }) => f.uid === profile.uid) ? 'following' : 'not-following'}`}
                            onClick={follow}
                        >
                            {currentUserData.followers.some((f: { uid: string }) => f.uid === profile.uid) ? 'Siguiendo' : 'Seguir'}
                        </IonButton>

                        <div className="secondary-buttons">
                            <IonButton fill="outline" size="small" className="secondary-btn">
                                <IonIcon icon={chatbubbleOutline} slot="icon-only" />
                            </IonButton>
                            <IonButton fill="outline" size="small" className="secondary-btn">
                                <IonIcon icon={paperPlaneOutline} slot="icon-only" />
                            </IonButton>
                            <IonButton fill="outline" size="small" className="secondary-btn">
                                <IonIcon icon={currentUserData.followers.some((f: { uid: string }) => f.uid === profile.uid) ? checkmark : addOutline} slot="icon-only" />
                            </IonButton>
                        </div>
                    </div>
                </div>

                {/* Highlights/Logros Section */}
                {profile.ach && profile.ach.length > 0 && (
                    <div className="highlights-section">
                        <h3 className="section-title">Logros</h3>
                        <div className="highlights-container">
                            {profile.ach.map((achievement, index) => (
                                <div key={index} className="highlight-item">
                                    <div className="highlight-circle">
                                        <IonIcon icon={checkmarkCircle} />
                                    </div>
                                    <span className="highlight-label">{achievement}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Favorite Places Section */}
                {profile.fav && profile.fav.length > 0 && (
                    <div className="favorites-section">
                        <h3 className="section-title">Lugares Favoritos</h3>
                        <div className="places-grid">
                            {profile.fav.map((place, index) => (
                                <div key={index} className="place-card">
                                    <div className="place-image">
                                        <IonIcon icon={locationOutline} />
                                    </div>
                                    <div className="place-info">
                                        <h4 className="place-name">{place.name}</h4>
                                        <p className="place-vicinity">{place.vicinity}</p>
                                    </div>
                                    <IonButton fill="clear" size="small" className="place-heart-btn">
                                        <IonIcon icon={heartOutline} slot="icon-only" />
                                    </IonButton>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Profile;