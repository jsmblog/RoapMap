import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonTextarea,
  IonSpinner
} from '@ionic/react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { close, folderOpen, image, videocam, trashOutline } from 'ionicons/icons';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, STORAGE } from '../Firebase/initializeApp';
import { generateUUID } from '../functions/uuid';
import { useAuthContext } from '../context/UserContext';
import { useToast } from '../hooks/UseToast';
import convertToWebP from '../functions/convertToWebP';
import { formatDateTime } from '../functions/formatDate';
import '../styles/createPostModal.css'; 
import { getAllHashTags } from '../functions/getAllHashTags';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUserData } = useAuthContext();
  const { showToast, ToastComponent } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLIonTextareaElement>(null);

  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>('');
  const [creating, setCreating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const maxCharacters = 600;
  const userInitial = currentUserData?.name?.charAt(0)?.toUpperCase() || 'U';

  // Generate preview URL for file
  useEffect(() => {
    if (!file) {
      setPreviewURL('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Update character count
  useEffect(() => {
    setCharacterCount(prompt.length);
  }, [prompt]);

  // Focus text area when modal opens
  useEffect(() => {
    if (isOpen && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.setFocus();
      }, 300);
    }
  }, [isOpen]);

  const handleFileChange = useCallback((selectedFile: File | null) => {
    if (selectedFile && /^(image|video)\//.test(selectedFile.type)) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('El archivo no puede ser mayor a 5MB', 3000, 'warning');
        return;
      }
      setFile(selectedFile);
    } else if (selectedFile) {
      showToast('Solo se permiten imágenes o videos', 2000, 'warning');
    }
  }, [showToast]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    handleFileChange(selected);
  }, [handleFileChange]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setPreviewURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  }, [handleFileChange]);

  const isFormValid = useMemo(() => {
    return (prompt.trim() !== '' || file !== null) && characterCount <= maxCharacters;
  }, [prompt, file, characterCount]);

  const handleCreate = useCallback(async () => {
    if (!isFormValid) {
      showToast('Por favor, añade contenido válido antes de publicar', 2000, 'warning');
      return;
    }

    setCreating(true);
    try {
      let fileURL = '';
      let fileType = '';

      if (file) {
        fileType = file.type;
        let uploadBlob: Blob = file;

        if (file.type.startsWith('image/')) {
          const webpBlob = await convertToWebP(file);
          if (!webpBlob) {
            showToast('Error al procesar la imagen', 2000, 'danger');
            setCreating(false);
            return;
          }
          uploadBlob = webpBlob;
        }

        const ext = file.type.startsWith('image/') ? 'webp' : file.name.split('.').pop();
        const storagePath = `posts/${currentUserData.uid}/${generateUUID()}.${ext}`;
        const storageRef = ref(STORAGE, storagePath);

        await uploadBytes(storageRef, uploadBlob);
        fileURL = await getDownloadURL(storageRef);
      }
      const txt = prompt.trim();
      const postData = {
        txt:getAllHashTags(txt,'txt') || '',
        ht:getAllHashTags(txt,'hashtags') || [],
        fl: fileURL || '',
        ft: fileType || '',
        img: currentUserData.photo || '',
        n: currentUserData.name || 'Usuario',
        likes: 0,
        comments: [],
        share: 0,
      };

      const postsRef = collection(db, 'POSTS', currentUserData.uid, 'posts');
      await setDoc(doc(postsRef, generateUUID()), {
        post: postData,
        d: formatDateTime(new Date()),
      }, { merge: true });

      showToast('¡Publicación creada exitosamente!', 3000, 'success');
      
      setPrompt('');
      setFile(null);
      setPreviewURL('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Error al crear la publicación. Inténtalo de nuevo.', 3000, 'danger');
    } finally {
      setCreating(false);
    }
  }, [file, isFormValid, prompt, currentUserData, showToast, onClose]);

  const handleClose = useCallback(() => {
    if (creating) return;
    
    // Reset form when closing
    setPrompt('');
    setFile(null);
    setPreviewURL('');
    setCharacterCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    onClose();
  }, [creating, onClose]);

  const getCharacterCountColor = useMemo(() => {
    if (characterCount > maxCharacters) return 'error';
    if (characterCount > maxCharacters * 0.8) return 'warning';
    return '';
  }, [characterCount]);

  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={handleClose} 
      backdropDismiss={!creating}
      className="create-post-modal"
    >
      <div className="modal-wrapper">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Crear publicación</h2>
          <IonButton 
            className="close-button" 
            fill="clear" 
            onClick={handleClose} 
            disabled={creating}
          >
            <IonIcon icon={close} />
          </IonButton>
        </div>

        {/* Content */}
        <IonContent className="modal-content">
          {ToastComponent}
          
          <div className="fade-in">
            {/* User Info */}
            <div className="user-info">
              <div className="user-avatar">
                {userInitial}
              </div>
              <div className="user-name">
                {currentUserData?.name || 'Usuario'}
              </div>
            </div>

            {/* Text Input */}
            <div className="text-input-container slide-up">
              <IonTextarea
                ref={textAreaRef}
                className="text-input"
                value={prompt}
                onIonInput={e => setPrompt(e.detail.value!)}
                placeholder="¿Qué quieres compartir hoy?"
                autoGrow
                disabled={creating}
                maxlength={maxCharacters}
              />
              <div className={`character-counter ${getCharacterCountColor}`}>
                {characterCount}/{maxCharacters}
              </div>
            </div>

            {previewURL && (
              <div className="media-preview slide-up">
                <IonButton
                  className="media-remove"
                  fill="clear"
                  onClick={handleRemoveFile}
                  disabled={creating}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
                
                {file?.type.startsWith('image/') ? (
                  <img src={previewURL} alt="Preview" />
                ) : (
                  <video src={previewURL} controls />
                )}
              </div>
            )}

            {/* File Upload */}
            {!previewURL && (
              <div
                className={`file-upload-container slide-up ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <IonIcon 
                  icon={file?.type.startsWith('video/') ? videocam : image} 
                  className="file-upload-icon" 
                />
                <div className="file-upload-text">
                  Arrastra archivos aquí o haz clic para seleccionar
                </div>
                <div className="file-upload-hint">
                  Soporta imágenes y videos (máx. 5MB)
                </div>
                <IonButton
                  className="file-upload-button"
                  fill="solid"
                  disabled={creating}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <IonIcon icon={folderOpen} slot="start" />
                  Seleccionar archivo
                </IonButton>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
              disabled={creating}
            />
          </div>
        </IonContent>

      </div>
        <div className="modal-actions">
          <IonButton
            className="publish-button"
            onClick={handleCreate}
            disabled={creating || !isFormValid}
          >
            {creating && <IonSpinner name="crescent" className="loading-spinner" />}
            {creating ? 'Publicando...' : 'Publicar'}
          </IonButton>
        </div>
    </IonModal>
  );
};

export default CreatePostModal;