import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonSpinner, IonTextarea, IonTitle, IonToolbar } from '@ionic/react'
import { addDoc, arrayRemove, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { chevronBackOutline, ellipsisVertical, sendOutline } from 'ionicons/icons'
import React, { useRef, useState } from 'react'
import { db } from '../Firebase/initializeApp';
import { useToast } from '../hooks/UseToast';
import { Follower, Group, Message } from '../Interfaces/iChats';
import { useAuthContext } from '../context/UserContext';
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
    const [onBoxChats, setOnBoxChats] = useState<boolean>(false);

    const [displayAllMembersOrRequests, setDisplayAllMembersOrRequests] = useState<any | null>(null);

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
        }
    };

    // Remover miembro
    const removeMember = async (grp: Group, member: Follower) => {
        try {
            const groupRef = doc(db, 'CHATS', grp.id);
            await updateDoc(groupRef, { members: arrayRemove(member) });
            showToast(`${member.n} fue eliminado del grupo`, 4000, 'success');
        } catch {
            showToast('Error al eliminar miembro', 4000, 'danger');
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
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const displayMembersOrRequests = (type: string) => {
        setDisplayAllMembersOrRequests(type !== 'req' ? selectedGroup?.members : selectedGroup?.requests)
    }
    return (
        <IonModal
            isOpen={!!selectedGroup}
            onDidDismiss={() => setSelectedGroup(null)}
            className="chat-modal"
        >
            {selectedGroup && (
                <>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonButton className='btn-actions-chat' onClick={() => setSelectedGroup(null)}>
                                    <IonIcon icon={chevronBackOutline} />
                                </IonButton>
                            </IonButtons>
                            <IonTitle>{selectedGroup.name}</IonTitle>
                            <IonBadge slot="end" color="primary">
                                <IonButton onClick={() => setOnBoxChats(!onBoxChats)} className='btn-actions-chat'>
                                    <IonIcon icon={ellipsisVertical} />
                                </IonButton>
                                {
                                    onBoxChats && <div>
                                        <IonButton >
                                            miembros
                                        </IonButton>
                                        <IonButton onClick={() => displayMembersOrRequests('req')}>
                                            solicitudes
                                        </IonButton>
                                    </div>
                                }
                            </IonBadge>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div className="chat-container-modal">
                            <div className="messages-container">
                                {messages.length > 0 ? (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`message ${msg.senderId === user.uid ? 'msg-out' : 'msg-in'}`}>
                                            {msg.senderId !== user.uid && (
                                                <div className="message-sender">{msg.senderName}</div>
                                            )}
                                            <div className="message-bubble">
                                                <p className="message-text">{msg.text}</p>
                                                <div className="message-time">
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">💭</div>
                                        <div className="empty-state-text">No hay mensajes aún</div>
                                        <div className="empty-state-subtext">Sé el primero en escribir algo</div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="message-input-container">
                                <IonTextarea
                                    ref={messageInputRef}
                                    className="message-input"
                                    placeholder="Escribe un mensaje..."
                                    value={messageText}
                                    onIonInput={e => setMessageText(e.detail.value!)}
                                    onKeyPress={handleKeyPress}
                                    disabled={sendingMessage}
                                    autoGrow={true}
                                    rows={1}
                                />
                                <IonButton
                                    className="send-button-chats"
                                    onClick={sendMessage}
                                    disabled={!messageText.trim() || sendingMessage}
                                >
                                    {sendingMessage ? (
                                        <IonSpinner name="crescent" />
                                    ) : (
                                        <IonIcon icon={sendOutline} />
                                    )}
                                </IonButton>
                            </div>
                        </div>
                    </IonContent>
                </>
            )}
        </IonModal>
    )
}

export default Chat