import React, { useEffect, useState, useRef } from 'react';
import '../styles/Chats.css';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonSpinner,
    IonModal,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
} from '@ionic/react';
import {
    peopleOutline,
    addOutline,
    enterOutline,
    chatbubbleOutline,
    closeOutline,
    arrowBackOutline,
    ellipsisVertical,
    chevronBackOutline
} from 'ionicons/icons';
import { useAuthContext } from '../context/UserContext';
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    arrayUnion,
    QueryDocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useToast } from '../hooks/UseToast';
import { generateUUID } from '../functions/uuid';
import { Follower, Group, Message } from '../Interfaces/iChats';
import Chat from '../components/Chat';

const Chats: React.FC = () => {
    const { currentUserData } = useAuthContext();
    const user: Follower = {
        uid: currentUserData?.uid ?? '',
        n: currentUserData?.name ?? '',
        pt: currentUserData?.photo ?? '',
    };

    // State
    const [followers] = useState<Follower[]>(currentUserData?.followers || []);
    const [groupName, setGroupName] = useState<string>('');
    const [groupCode, setGroupCode] = useState<string>('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'create' | 'join' | null>(null);
    const { showToast, ToastComponent } = useToast();

    const sliderRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Carga de grupos en tiempo real
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'CHATS'));
        const unsub = onSnapshot(q, snapshot => {
            const loaded: Group[] = snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
                id: d.id,
                ...(d.data() as Omit<Group, 'id'>),
            }));
            setGroups(loaded);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Carga de mensajes al seleccionar grupo
    useEffect(() => {
        if (!selectedGroup) return;
        const msgsRef = collection(db, 'CHATS', selectedGroup.id, 'MESSAGES');
        const q = query(msgsRef, orderBy('timestamp', 'asc'));
        const unsub = onSnapshot(q, snapshot => {
            const loaded: Message[] = snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
                id: d.id,
                ...(d.data() as Omit<Message, 'id'>),
            }));
            setMessages(loaded);
        });
        return () => unsub();
    }, [selectedGroup]);

    const userGroups = groups?.filter(g =>
        g.members?.some(m => m.uid === user.uid)
    ) || [];

    const createGroup = async () => {
        if (!groupName.trim()) {
            showToast('El nombre del grupo no puede estar vacío', 3000, 'warning');
            return;
        }
        setLoading(true);
        try {
            const groupRef = doc(collection(db, 'CHATS'));
            const code = generateUUID();
            await setDoc(groupRef, {
                name: groupName.trim(),
                admin: user.uid,
                createdAt: serverTimestamp(),
                code,
                members: [user],
                requests: [],
            }, { merge: true });
            setGroupName('');
            showToast(`Grupo "${groupName}" creado exitosamente`, 3000, 'success');
            setShowGroupModal(false);
        } catch (error) {
            showToast('Error al crear el grupo', 4000, 'danger');
        } finally {
            setLoading(false);
        }
    };

    const joinByCode = async () => {
        if (!groupCode.trim()) {
            showToast('Ingresa un código de grupo', 3000, 'warning');
            return;
        }

        const target = groups?.find(g => g.code === groupCode.trim());
        if (!target) {
            showToast('Código de grupo inválido', 4000, 'warning');
            return;
        }

        if (target.members.some(m => m.uid === user.uid)) {
            showToast('Ya eres miembro de este grupo', 3000, 'warning');
            return;
        }

        if (target.requests.some(r => r.uid === user.uid)) {
            showToast('Ya enviaste una solicitud para este grupo', 3000, 'warning');
            return;
        }

        setLoading(true);
        try {
            const groupRef = doc(db, 'CHATS', target.id);
            await updateDoc(groupRef, { requests: arrayUnion(user) });
            setGroupCode('');
            showToast('Solicitud enviada al administrador', 4000, 'success');
            setShowGroupModal(false);
        } catch (error) {
            showToast('Error al enviar solicitud', 4000, 'danger');
        } finally {
            setLoading(false);
        }
    };


    return (
        <IonPage className="chat-container">
            <IonHeader className="chat-header">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink='/' >
                            <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="chat-title">
                        <IonIcon icon={chatbubbleOutline} />
                        Comunidad
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setShowOptions(!showOptions)}>
                            <IonIcon icon={ellipsisVertical} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {ToastComponent}
                {showOptions && (
                    <div className="group-options-popup">
                        <div className="popup-header">
                            <IonButton fill="clear" onClick={() => setShowOptions(false)}>
                                Cerrar <IonIcon icon={closeOutline} />
                            </IonButton>
                        </div>
                        <div className="popup-content">
                            <IonItem
                                className="group-option-item"
                                onClick={() => {
                                    setModalType('create');
                                    setShowGroupModal(true);
                                    setShowOptions(false);
                                }}
                            >
                                <IonIcon icon={addOutline} slot="start" />
                                <IonLabel>Crear Grupo</IonLabel>
                            </IonItem>
                            <IonItem
                                className="group-option-item"
                                onClick={() => {
                                    setModalType('join');
                                    setShowGroupModal(true);
                                    setShowOptions(false);
                                }}
                            >
                                <IonIcon icon={enterOutline} slot="start" />
                                <IonLabel>Unirse a Grupo</IonLabel>
                            </IonItem>
                        </div>
                    </div>
                )}

                <IonModal
                    isOpen={showGroupModal}
                    onDidDismiss={() => {
                        setShowGroupModal(false);
                        setModalType(null);
                    }}
                    className="group-modal"
                >
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                <IonButton
                                    onClick={() => {
                                        setShowGroupModal(false);
                                        setModalType(null);
                                    }}
                                >
                                    <IonIcon icon={arrowBackOutline} />
                                </IonButton>
                            </IonButtons>
                            <IonTitle>
                                {modalType === 'create' ? 'Crear Grupo' : 'Únete a un Grupo con su código'}
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        {modalType === 'create' && (
                            <div className="modal-section">
                                <h3 className="modal-section-title">Crear Grupo</h3>
                                <IonItem>
                                    <IonLabel position="stacked">Nombre del Grupo</IonLabel>
                                    <IonInput
                                        value={groupName}
                                        onIonInput={(e) => setGroupName(e.detail.value!)}
                                        placeholder="Nombre del grupo"
                                    />
                                </IonItem>
                                <IonButton
                                    expand="block"
                                    onClick={createGroup}
                                    disabled={!groupName.trim()}
                                    className="btn-join-code"
                                >
                                    <IonIcon icon={addOutline} slot="start" />
                                    Crear Grupo
                                </IonButton>
                            </div>
                        )}

                        {modalType === 'join' && (
                            <div className="modal-section">
                                <h3 className="modal-section-title">Unirse a Grupo</h3>
                                <IonItem>
                                    <IonLabel position="stacked">Código del Grupo</IonLabel>
                                    <IonInput
                                        value={groupCode}
                                        onIonInput={(e) => setGroupCode(e.detail.value!)}
                                        placeholder="Código (ej: ABC123)"
                                    />
                                </IonItem>
                                <IonButton
                                    expand="block"
                                    onClick={joinByCode}
                                    disabled={!groupCode.trim()}
                                    className="btn-join-code"
                                >
                                    <IonIcon icon={enterOutline} slot="start" />
                                    Unirse con Código
                                </IonButton>
                            </div>
                        )}
                    </IonContent>
                </IonModal>

                <Chat selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} messages={messages} messagesEndRef={messagesEndRef} />
                <div className="chat-section">
                    <div className="section-header">
                        <IonIcon icon={peopleOutline} />
                        <span>Amigos ({followers.length})</span>
                    </div>
                    <div className="section-content">
                        {followers.length > 0 ? (
                            <div className="followers-slider" ref={sliderRef}>
                                {followers.map(f => (
                                    <div key={f.uid} className="follower-slide">
                                        <div className="follower-card">
                                            {f.pt && f.pt.trim() ? (
                                                <img
                                                    src={f.pt}
                                                    alt={f.n}
                                                    className="follower-avatar"
                                                />
                                            ) : (
                                                <div className="follower-avatar">
                                                    {f.n.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="follower-name">{f.n}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">👥</div>
                                <div className="empty-state-text">No tienes seguidores aún</div>
                                <div className="empty-state-subtext">Comparte tu perfil para conectar con otros</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chat-section">
                    <div className="section-header">
                        <IonIcon icon={chatbubbleOutline} />
                        <span>Mis Grupos ({userGroups.length})</span>
                    </div>
                    <div className="section-content">
                        {loading ? (
                            <div className="text-center">
                                <IonSpinner name="crescent" />
                                <p className="text-muted mt-1">Cargando grupos...</p>
                            </div>
                        ) : userGroups.length > 0 ? (
                            <div className="groups-grid">
                                {userGroups.map(g => (
                                    <IonCard
                                        key={g.id}
                                        className="group-card"
                                        onClick={() => setSelectedGroup(g)}
                                    >
                                        <IonCardHeader>
                                            <IonCardTitle>{g.name}</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <p>Admin: {g.admin === user.uid ? 'Tú' : g.members.find(m => m.uid === g.admin)?.n || 'Desconocido'}</p>
                                            <p>{g.members.length} miembro{g.members.length !== 1 ? 's' : ''}</p>
                                        </IonCardContent>
                                    </IonCard>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">💬</div>
                                <div className="empty-state-text">No tienes grupos aún</div>
                                <div className="empty-state-subtext">Crea un grupo o únete usando un código</div>
                            </div>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Chats;