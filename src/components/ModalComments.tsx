import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTextarea,
  IonButton,
  IonSpinner,
  IonIcon,
  IonText,
  IonAvatar,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { chatbubbleOutline } from 'ionicons/icons';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { PostData } from '../Interfaces/iPostData';
import { useAuthContext } from '../context/UserContext';
import { formatDateTime } from '../functions/formatDate';
import { useToast } from '../hooks/UseToast';
import { getTimeAgo } from '../functions/getTimeAgo';
import '../styles/modalComments.css';

interface ModalCommentsProps {
  post: PostData;
  isOpen: boolean;
  onClose: () => void;
}

const ModalComments: React.FC<ModalCommentsProps> = ({ post, isOpen, onClose }) => {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast, ToastComponent } = useToast();
  const { currentUserData } = useAuthContext();

  const handleSubmit = async () => {
    const text = commentText.trim();
    if (text === '') {
      showToast('El comentario no puede estar vacío', 2000, 'warning');
      return;
    }
    setSubmitting(true);
    const comment = {
      p: currentUserData.photo || '',
      n: currentUserData.name,
      txt: text,
      c: formatDateTime(new Date()),
    };
    try {
      const postRef = doc(db, 'POSTS', currentUserData.uid, 'posts', post.id);
      await updateDoc(postRef, {
        'post.comments': arrayUnion(comment)
      });
      showToast('Comentario agregado', 2000, 'success');
      setCommentText('');
    } catch (error) {
      console.error('Error al enviar comentario', error);
      showToast('Error al enviar comentario', 2000, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonModal 
      initialBreakpoint={0.83} 
      breakpoints={[0, 0.83]} 
      isOpen={isOpen} 
      onDidDismiss={onClose}
      className="comments-modal"
    >
      <IonHeader className="modal-header">
        <IonToolbar className="comments-toolbar">
          <div className="header-content">
            <div className="title-section">
              <IonTitle className="modal-title">{post.post.comments?.length} comentarios</IonTitle>
            </div>
            <IonButton 
              fill="clear" 
              onClick={onClose}
              className="close-button"
              size="small"
            >
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="comments-content">
        {ToastComponent}
        
        {/* Comments List */}
        <div className="comments-container">
          {Array.isArray(post.post.comments) && post.post.comments.length > 0 ? (
            post.post.comments.map((c: any, idx: number) => (
              <IonCard key={idx} className="comment-card">
                <IonCardContent className="comment-content">
                  <div className="comment-header">
                    <IonAvatar className="comment-avatar">
                      <img src={c.p || '/default-avatar.png'} alt="avatar" />
                    </IonAvatar>
                    <div className="comment-info">
                      <h3 className="comment-username">@{c.n.replace(/\s+/g, '_')}</h3>
                      <IonText className="comment-time">
                       hace: {getTimeAgo(c.c)}
                      </IonText>
                    </div>
                  </div>
                  <p className="comment-text">{c.txt}</p>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="empty-comments">
              <IonIcon icon={chatbubbleOutline} className="empty-icon" />
              <IonText className="empty-text">
                <h3>¡Sé el primero en comentar!</h3>
                <p>Comparte tu opinión sobre esta publicación</p>
              </IonText>
            </div>
          )}
        </div>

        <div className="comment-input-section">
          <IonCard className="input-card">
            <IonCardContent className="input-content">
              <div className="input-header">
                <IonAvatar className="user-avatar">
                  <img src={currentUserData?.photo || '/default-avatar.png'} alt="Tu avatar" />
                </IonAvatar>
                <IonText className="input-label">Escribir comentario</IonText>
              </div>
              
              <IonTextarea
                value={commentText}
                placeholder="¿Qué opinas sobre esta publicación?"
                rows={3}
                maxlength={500}
                onIonInput={e => setCommentText(e.detail.value!)}
                className="comment-textarea"
                counter={true}
              />
              
              <div className="input-actions">
                <IonButton
                  onClick={handleSubmit}
                  disabled={submitting || !commentText.trim()}
                  className="send-button"
                  size="default"
                >
                  {submitting ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      Enviar
                    </>
                  )}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ModalComments;