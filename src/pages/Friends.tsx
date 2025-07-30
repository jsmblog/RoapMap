import React from 'react';
import '../styles/friends.css';
import {
  IonPage,
  IonContent,
  IonIcon,
  useIonRouter
} from '@ionic/react';
import { useAuthContext } from '../context/UserContext';
import { people } from 'ionicons/icons';
import { useToast } from '../hooks/UseToast';
import { removeFriend } from '../functions/removeFriend';
import { Friend } from '../Interfaces/iFriend';

const Friends: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const router = useIonRouter();
  const { showToast, ToastComponent } = useToast();

  const friends: Friend[] = Array.isArray(currentUserData?.followers)
    ? currentUserData.followers
    : [];

  const handleProfileClick = (uid: string) => {
    router.push(`/profile/${uid}`);
  };

  const handleUnFollowing = async (friendUid: string, nameFriend: string) => {
    try {
      await removeFriend(currentUserData.uid, currentUserData.followers, friendUid);
      showToast(`Dejaste de seguir a ${nameFriend}`, 3000, 'success');
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
      showToast('Error al eliminar amigo', 3000, 'danger');
    }
  };

  const NavigateToChats = () => {
    router.push('/chats');
  }

  return (
    <IonPage>
      <IonContent>
        {ToastComponent}
        <div className="friends-container">
          <div className="friends-header">
            <h2>Mis Amigos ({friends.length})</h2>
          </div>

          <div className="friends-list">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.uid} className="friend-card">
                  <div className="friend-avatar">
                    <img
                      src={friend.pt || '/default-avatar.png'}
                      alt={friend.n || 'Amigo'}
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                  </div>

                  <div className="friend-info">
                    <h3 className="friend-name">{friend.n || 'Usuario'}</h3>
                    <h5
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnFollowing(friend.uid, friend.n)
                      }}
                      className="unfollow"
                    >
                      Dejar de seguir
                    </h5>
                  </div>

                  <div className="friend-actions">
                    <button onClick={NavigateToChats} className="action-btn-friends message-btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleProfileClick(friend.uid)}
                      className="action-btn-friends profile-btn"
                    >
                      <IonIcon className="co-icon-nav-friend" icon={people} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-friends">
                <div className="no-friends-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="m22 11-3-3m0 0-3 3m3-3v8" />
                  </svg>
                </div>
                <h3>No tienes amigos aún</h3>
                <p>Comienza a seguir a otros usuarios para verlos aquí</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Friends;
