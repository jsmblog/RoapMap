import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonBadge,
  IonText,
  IonLoading,
  IonButton,
} from '@ionic/react';
import {
  heartOutline,
  chatbubble,
  shareSocial,
  add,
  musicalNote,
  volumeHighOutline,
  volumeMuteOutline,
  playOutline,
  pauseOutline,
  heart,
} from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '../styles/community.css';
import CreatePostModal from '../components/CreatePostModal';
import iconEmpty from '/empty.png';
import { db } from '../Firebase/initializeApp';
import { collectionGroup, onSnapshot, QueryDocumentSnapshot, DocumentData, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PostData } from '../Interfaces/iPostData';
import { useToast } from '../hooks/UseToast';
import { useAuthContext } from '../context/UserContext';
import ModalComments from '../components/ModalComments';

const Community: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { showToast, ToastComponent } = useToast();
  const [isOnModalComments, setIsOnModalComments] = useState<boolean>(false);
  const { currentUserData } = useAuthContext();
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});
  const [overlayMap, setOverlayMap] = useState<
    Record<string, { icon: typeof playOutline | typeof pauseOutline; visible: boolean }>
  >({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    const unsub = onSnapshot(
      collectionGroup(db, 'posts'),
      (snap) => {
        const fetched = snap.docs
          .map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const data = doc.data() as any;
            return { id: doc.id, ...data };
          })
          .sort((a, b) => {
            const ta = a.c?.toMillis?.() || 0;
            const tb = b.c?.toMillis?.() || 0;
            return tb - ta;
          });
        setPosts(fetched);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error listening posts:', err);
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const onSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    posts.forEach((post, idx) => {
      const vid = videoRefs.current[post.id];
      if (!vid) return;
      const isActive = idx === swiper.activeIndex;
      if (isActive && !pausedMap[post.id]) vid.play().catch(() => { });
      else vid.pause();
      vid.muted = mutedMap[post.id] ?? true;
    });
  };

  const toggleMute = (postId: string) => {
    setMutedMap(prev => {
      const next = { ...prev, [postId]: !prev[postId] };
      const vid = videoRefs.current[postId];
      if (vid && posts[activeIndex]?.id === postId) {
        vid.muted = next[postId];
      }
      return next;
    });
  };

  const togglePause = (postId: string) => {
    const vid = videoRefs.current[postId];
    if (!vid) return;
    const nowPaused = !pausedMap[postId];
    setPausedMap(prev => ({ ...prev, [postId]: nowPaused }));
    // Show overlay
    setOverlayMap(prev => ({
      ...prev,
      [postId]: { icon: nowPaused ? playOutline : pauseOutline, visible: true }
    }));
    // Hide overlay after 600ms
    setTimeout(() => {
      setOverlayMap(prev => ({
        ...prev,
        [postId]: { ...prev[postId], visible: false }
      }));
    }, 600);

    // actually play/pause
    nowPaused ? vid.pause() : vid.play().catch(() => { });
  };

  const handleLike = async (post: PostData) => {
    const uid = currentUserData?.uid;
    if (!uid) {
      showToast('Debes iniciar sesión para dar like', 3000, 'danger');
      return;
    }

    if (post.post.likes?.includes(uid)) {
      showToast('Ya diste like a esta publicación', 3000, 'warning');
      return;
    }
    try {
      const postRef = doc(db, 'POSTS', post.uid, 'posts', post.id);
      await updateDoc(postRef, {
        'post.likes': arrayUnion(uid),
      });
      showToast('Te gustó la publicación 👍', 2000, 'success');
    } catch (error) {
      console.error('Error al dar like:', error);
      showToast('Error al dar like. Intenta nuevamente.', 3000, 'danger');
    }
  };

  return (
    <IonPage className="community-page">
      <div className="top-tab-bar">
        <IonButton
          fill="clear"
          className="create-tab-button"
          onClick={() => setShowModal(true)}
        >
          <span className="tab-text">Crear</span>
        </IonButton>
        <IonButton
          fill="clear"
          className="community-tab-button active"
        >
          <span className="tab-text">Comunidad</span>
        </IonButton>
      </div>

      <IonContent className="community-content">
        {ToastComponent}
        {!isLoading && posts.length === 0 && (
          <div className="no-posts">
            <p>¡¡ No hay publicaciones aún !!</p>
            <img width={300} src={iconEmpty} alt="No posts" />
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <Swiper
            direction="vertical"
            slidesPerView={1}
            onSlideChange={onSlideChange}
            style={{ height: '100%' }}
          >
            {posts.map((post, idx) => {
              const isVideo = post.post.ft.startsWith('video/');
              const isMuted = mutedMap[post.id] ?? true;
              const overlay = overlayMap[post.id] || { icon: playOutline, visible: false };

              return (
                <SwiperSlide key={post.id}>
                  <div className="video-container">
                    <div
                      className="video-background"
                      onClick={() => isVideo && togglePause(post.id)}
                    >
                      {isVideo ? (
                        <video
                          ref={el => { videoRefs.current[post.id] = el; }}
                          src={post.post.fl}
                          className="video-player"
                          playsInline
                          loop
                        />
                      ) : (
                        <img
                          src={post.post.fl}
                          alt="thumbnail"
                          className="video-thumbnail"
                        />
                      )}

                      {/* mute/unmute */}
                      {isVideo && (
                        <IonIcon
                          icon={isMuted ? volumeMuteOutline : volumeHighOutline}
                          className="sound-toggle-icon"
                          onClick={e => {
                            e.stopPropagation();
                            toggleMute(post.id);
                          }}
                        />
                      )}

                      {isVideo && overlay.visible && (
                        <div className="play-overlay">
                          <IonIcon icon={overlay.icon} />
                        </div>
                      )}
                    </div>

                    <div className="video-overlay">
                      <IonItem routerLink={`/profile/${post.uid}`} lines="none" className="user-info">
                        <IonAvatar slot="start" className="user-avatar">
                          <img src={post.post.img} alt={post.post.n} />
                        </IonAvatar>
                        <IonLabel className="user-name">
                          <h2 className="username">
                            @{post.post.n.replace(/\s+/g, '_')}
                          </h2>
                        </IonLabel>
                      </IonItem>

                      <div className="video-caption">
                        <IonText>
                          <p>{post.post.txt}</p>
                          {post.post.ht && (
                            <p className="hashtags">{post.post.ht.join(' ')}</p>
                          )}
                        </IonText>
                      </div>

                      <div className="music-info">
                        <IonIcon icon={musicalNote} className="music-icon" />
                        <IonText className="music-text">
                          <span>{post.post.ft}</span>
                        </IonText>
                      </div>

                      <div className="video-actions">
                        <div className="action-item">
                          <IonIcon
                            icon={Array.isArray(post.post.likes) && post.post.likes.includes(currentUserData?.uid) ? heart : heartOutline}
                            className={`action-icon ${Array.isArray(post.post.likes) && post.post.likes.includes(currentUserData?.uid) ? 'liked' : ''}`}
                            onClick={() => handleLike(post)}
                          />
                          <IonBadge>
                            {Array.isArray(post.post.likes)
                              ? post.post.likes.length
                              : typeof post.post.likes === 'number'
                                ? post.post.likes
                                : 0}
                          </IonBadge>
                        </div>
                        <div className="action-item">
                          <IonIcon onClick={() => {
                            setPost(post);
                            setIsOnModalComments(true);
                          }} icon={chatbubble} className="action-icon" />
                          <IonBadge>{post.post.comments.length}</IonBadge>
                        </div>
                        <div className="action-item">
                          <IonIcon icon={shareSocial} className="action-icon" />
                          <IonBadge>
                            {Array.isArray(post.post.share)
                              ? post.post.share.length
                              : typeof post.post.share === 'number'
                                ? post.post.share
                                : 0}
                          </IonBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}

        <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </IonContent>
      {isOnModalComments && post && (
        <ModalComments
          post={post}
          isOpen={isOnModalComments}
          onClose={() => setIsOnModalComments(false)}
        />
      )}
    </IonPage>
  );
};

export default Community;