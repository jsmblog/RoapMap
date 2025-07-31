import {
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonPopover,
    IonSpinner,
    IonTextarea,
    IonTitle,
    IonToolbar,
    IonAvatar,
    IonItem,
    IonLabel,
} from '@ionic/react';
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';
import {
    chevronBackOutline,
    ellipsisVertical,
    sendOutline,
    peopleOutline,
    personAddOutline,
    checkmarkCircleOutline,
    closeCircleOutline
} from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { db } from '../Firebase/initializeApp';
import { useToast } from '../hooks/UseToast';
import { Follower, Group, Message } from '../Interfaces/iChats';
import { useAuthContext } from '../context/UserContext';
import '../styles/chat.css'
interface Props {
    selectedGroup: Group | null;
    setSelectedGroup: Group | any;
    messages: Message[];
    messagesEndRef: HTMLDivElement | any;
}

const Chat: React.FC<Props> = ({ selectedGroup, setSelectedGroup, messages, messagesEndRef }) => {
    const { showToast, ToastComponent } = useToast();
    const [messageText, setMessageText] = useState<string>('');
    const [sendingMessage, setSendingMessage] = useState<boolean>(false);

    const [popoverEvent, setPopoverEvent] = useState<MouseEvent | null>(null);
    const [modalDataType, setModalDataType] = useState<'mem' | 'req' | null>(null);

    const { currentUserData } = useAuthContext();
    const messageInputRef = useRef<HTMLIonTextareaElement>(null);

    const user: Follower = {
        uid: currentUserData?.uid ?? '',
        n: currentUserData?.name ?? '',
        pt: currentUserData?.photo ?? '',
    };

    const acceptRequest = async (grp: Group, member: Follower) => {
        try {
            const groupRef = doc(db, 'CHATS', grp.id);
            await updateDoc(groupRef, {
                members: arrayUnion(member),
                requests: arrayRemove(member),
            });
            showToast(`${member.n} se unió al grupo`, 4000, 'success');
        } catch {
            showToast('Error al aceptar solicitud', 4000, 'danger');
        }finally{
            setSelectedGroup(null)
            closeModal()
        }
    };

    const removeMember = async (grp: Group, member: Follower, from: 'members' | 'requests') => {
        try {
            const groupRef = doc(db, 'CHATS', grp.id);
            await updateDoc(groupRef, {
                [from]: arrayRemove(member),
            });
            const action = from === 'members' ? 'eliminado' : 'removido';
            showToast(`${member.n} fue ${action}`, 4000, 'success');
        } catch {
            showToast('Error al procesar solicitud', 4000, 'danger');
        }finally {
            setSelectedGroup(null)
            closeModal()
        }
    };

    const sendMessage = async () => {
        if (!messageText.trim() || !selectedGroup) return;

        setSendingMessage(true);
        try {
            await addDoc(collection(db, 'CHATS', selectedGroup.id, 'MESSAGES'), {
                senderId: user.uid,
                senderName: user.n,
                photo: user.pt,
                text: messageText.trim(),
                type: 'text',
                timestamp: serverTimestamp(),
            });
            setMessageText('');
            messageInputRef.current?.setFocus();
        } catch {
            showToast('Error al enviar mensaje', 4000, 'danger');
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        if (isToday) {
            return date.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit'
            });
        }
    };

    const handlePopoverClick = (e: React.MouseEvent) => {
        setPopoverEvent(e.nativeEvent);
    };

    const handleShowModal = (type: 'mem' | 'req') => {
        setModalDataType(type);
        setPopoverEvent(null);
    };

    const closeModal = () => {
        setModalDataType(null);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            <IonModal
                isOpen={!!selectedGroup}
                onDidDismiss={() => setSelectedGroup(null)}
                className="chat-modal-improved"
            >
                {selectedGroup && (
                    <>
                        <IonHeader className="chat-header">
                            <IonToolbar className="chat-toolbar">
                                <IonButtons slot="start">
                                    <IonButton 
                                        className="header-button back-button" 
                                        onClick={() => setSelectedGroup(null)}
                                    >
                                        <IonIcon icon={chevronBackOutline} />
                                    </IonButton>
                                </IonButtons>
                                
                                <div className="chat-title-container">
                                    <div className="group-avatar">
                                        {getInitials(selectedGroup.name)}
                                    </div>
                                    <div className="chat-info">
                                        <IonTitle className="chat-title">{selectedGroup.name}</IonTitle>
                                        <div className="members-count">
                                            {selectedGroup.members?.length || 0} miembros
                                        </div>
                                    </div>
                                </div>

                                <IonButtons slot="end">
                                    <IonButton 
                                        className="header-button menu-button" 
                                        onClick={handlePopoverClick}
                                    >
                                        <IonIcon icon={ellipsisVertical} />
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                         {ToastComponent}
                        <IonContent className="chat-content">
                            <div className="chat-container-improved">
                                <div className="messages-container-improved">
                                    {messages.length > 0 ? (
                                        messages.map((msg, index) => {
                                            const isCurrentUser = msg.senderId === user.uid;
                                            const showSender = !isCurrentUser && 
                                                (index === 0 || messages[index - 1].senderId !== msg.senderId);
                                            
                                            return (
                                                <div key={msg.id} className={`message-wrapper ${isCurrentUser ? 'message-out' : 'message-in'}`}>
                                                    {showSender && (
                                                        <div className="message-sender-info">
                                                            <div className="sender-avatar">
                                                                {msg.photo ? (
                                                                    <img src={msg.photo} alt="avatar" />
                                                                ) : (
                                                                    <span>{getInitials(msg.senderName)}</span>
                                                                )}
                                                            </div>
                                                            <span className="sender-name">{msg.senderName}</span>
                                                        </div>
                                                    )}
                                                    <div className={`message-bubble-improved ${showSender ? 'with-sender' : ''}`}>
                                                        <p className="message-text-improved">{msg.text}</p>
                                                        <div className="message-time-improved">
                                                            {formatTime(msg.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="empty-state-improved">
                                            <div className="empty-icon">💬</div>
                                            <h3>¡Inicia la conversación!</h3>
                                            <p>Sé el primero en enviar un mensaje a este grupo</p>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="input-container-improved">
                                    <div className="input-wrapper">
                                        <IonTextarea
                                            ref={messageInputRef}
                                            className="message-input-improved"
                                            placeholder="Escribe tu mensaje..."
                                            value={messageText}
                                            onIonInput={e => setMessageText(e.detail.value!)}
                                            onKeyPress={handleKeyPress}
                                            disabled={sendingMessage}
                                            autoGrow={true}
                                            rows={1}
                                        />
                                        <IonButton
                                            className={`send-button-improved ${messageText.trim() ? 'active' : ''}`}
                                            onClick={sendMessage}
                                            disabled={!messageText.trim() || sendingMessage}
                                            size="small"
                                        >
                                            {sendingMessage ? (
                                                <IonSpinner name="crescent" />
                                            ) : (
                                                <IonIcon icon={sendOutline} />
                                            )}
                                        </IonButton>
                                    </div>
                                </div>
                            </div>
                        </IonContent>
                    </>
                )}
            </IonModal>

            {/* Popover mejorado */}
            <IonPopover
                isOpen={!!popoverEvent}
                event={popoverEvent!}
                onDidDismiss={() => setPopoverEvent(null)}
                className="chat-popover"
            >
                <div className="popover-content">
                    <IonButton 
                        fill="clear" 
                        className="popover-option"
                        onClick={() => handleShowModal('mem')}
                    >
                        <IonIcon icon={peopleOutline} slot="start" />
                        Ver miembros
                        <div className="member-badge">{selectedGroup?.members?.length || 0}</div>
                    </IonButton>
                    <IonButton 
                        fill="clear" 
                        className="popover-option"
                        onClick={() => handleShowModal('req')}
                    >
                        <IonIcon icon={personAddOutline} slot="start" />
                        Solicitudes
                        <div className="request-badge">{selectedGroup?.requests?.length || 0}</div>
                    </IonButton>
                </div>
            </IonPopover>

            <IonModal 
                isOpen={!!modalDataType} 
                onDidDismiss={closeModal}
                className="members-modal"
            >
                <IonHeader>
                    <IonToolbar className="modal-toolbar">
                        <IonTitle className="modal-title">
                            {modalDataType === 'mem' ? 'Miembros del grupo' : 'Solicitudes pendientes'}
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonButton 
                                className="close-button"
                                onClick={closeModal}
                                fill="clear"
                            >
                                <IonIcon icon={closeCircleOutline} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="modal-content">
                    <div className="members-list">
                        {(modalDataType === 'mem' ? selectedGroup?.members : selectedGroup?.requests)?.map((member: Follower) => (
                            <div key={member.uid} className="member-item">
                                <div className="member-info">
                                    <div className="member-avatar">
                                        {member.pt ? (
                                            <img src={member.pt} alt="avatar" />
                                        ) : (
                                            <span>{getInitials(member.n)}</span>
                                        )}
                                    </div>
                                    <div className="member-details">
                                        <h3>{member.n}</h3>
                                        {modalDataType === 'mem' && member.uid === user.uid && (
                                            <span className="you-badge">Tú</span>
                                        )}
                                    </div>
                                </div>
                                {modalDataType === 'req' && (
                                    <div className="action-buttons">
                                        <IonButton 
                                            className="accept-button"
                                            onClick={() => acceptRequest(selectedGroup!, member)}
                                            size="small"
                                        >
                                            <IonIcon icon={checkmarkCircleOutline} />
                                        </IonButton>
                                        <IonButton 
                                            className="reject-button"
                                            onClick={() => removeMember(selectedGroup!, member, 'requests')}
                                            size="small"
                                        >
                                            <IonIcon icon={closeCircleOutline} />
                                        </IonButton>
                                    </div>
                                )}
                            </div>
                        ))}
                        {((modalDataType === 'mem' ? selectedGroup?.members : selectedGroup?.requests)?.length === 0) && (
                            <div className="empty-list">
                                <div className="empty-icon">
                                    {modalDataType === 'mem' ? '👥' : '📋'}
                                </div>
                                <p>
                                    {modalDataType === 'mem' 
                                        ? 'No hay miembros en este grupo'
                                        : 'No hay solicitudes pendientes'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </IonContent>
            </IonModal>
        </>
    );
};

export default Chat;