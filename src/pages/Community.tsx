import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonIcon,
  IonAvatar,
  IonBadge,
  IonText,
  IonFab,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading,
} from '@ionic/react';
import {
  heart,
  heartOutline,
  chatbubble,
  bookmark,
  share,
  add,
  play,
  musicalNote,
} from 'ionicons/icons';
import '../styles/community.css';
import CreatePostModal from '../components/CreatePostModal';
import { db } from '../Firebase/initializeApp';
import {
  collectionGroup,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

interface PostData {
  id: string;
  post: {
    txt: string;
    ht: string[];
    fl: string;
    ft: string;
    img: string;
    n: string;
    likes: number;
    comments: any[];
    share: number;
  };
  d: string;
}

const PAGE_SIZE = 10;

const Community: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const containerRef = useRef<HTMLIonContentElement>(null);

  const fetchPosts = async (event?: CustomEvent<void>) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let q = query(
        collectionGroup(db, 'posts'),
        orderBy('d', 'desc'),
        limit(PAGE_SIZE)
      );
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      const snap = await getDocs(q);
      const fetched: PostData[] = snap.docs.map(docSnap => ({ id: docSnap.id, ...(docSnap.data() as any) }));
      setPosts(prev => [...prev, ...fetched]);
      if (snap.docs.length < PAGE_SIZE) {
        setIsInfiniteDisabled(true);
      } else {
        setLastDoc(snap.docs[snap.docs.length - 1]);
      }
      if (event) (event.target as HTMLIonInfiniteScrollElement).complete();
    } catch (e) {
      console.error('Error fetching posts:', e);
      if (event) (event.target as HTMLIonInfiniteScrollElement).complete();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    // implement liking logic or local toggle
  };

  return (
    <IonPage className="community-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Comunidad</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="community-content"
        ref={containerRef}
        scrollY={false}
      >
        {isLoading && <IonLoading isOpen message="Cargando publicaciones..." />}

        <div className="video-feed">
          {posts.map((video, index) => (
            <div key={video.id} className="video-container">
              <div className="video-background">
                <img
                  src={video.post.fl}
                  alt="thumbnail"
                  className="video-thumbnail"
                />
                <div className="play-overlay">
                  <IonIcon icon={play} className="play-icon" />
                </div>
              </div>
              <div className="video-overlay">
                <IonItem lines="none" className="user-info">
                  <IonAvatar slot="start" className="user-avatar">
                    <img src={video.post.img} alt={video.post.n} />
                  </IonAvatar>
                  <IonLabel>
                    <h2 className="username">@{video.post.n}</h2>
                  </IonLabel>
                </IonItem>
                <div className="video-caption">
                  <IonText>
                    <p>{video.post.txt}</p>
                  </IonText>
                </div>
                <div className="music-info">
                  <IonIcon icon={musicalNote} className="music-icon" />
                  <IonText className="music-text">
                    <span>{video.post.ft}</span>
                  </IonText>
                </div>
                <div className="video-actions">
                  <div className="action-item">
                    <IonIcon
                      icon={heartOutline}
                      className="action-icon"
                      onClick={() => handleLike(video.id)}
                    />
                    <IonBadge>{video.post.likes}</IonBadge>
                  </div>
                  <div className="action-item">
                    <IonIcon icon={chatbubble} className="action-icon" />
                    <IonBadge>{video.post.comments.length}</IonBadge>
                  </div>
                  <div className="action-item">
                    <IonIcon icon={bookmark} className="action-icon" />
                  </div>
                  <div className="action-item">
                    <IonIcon icon={share} className="action-icon" />
                    <IonBadge>{video.post.share}</IonBadge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <IonInfiniteScroll
          threshold="100px"
          disabled={isInfiniteDisabled}
          onIonInfinite={e => fetchPosts(e)}
        >
          <IonInfiniteScrollContent loadingText="Cargando más publicaciones..." />
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Community;
