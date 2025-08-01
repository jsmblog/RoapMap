import {
  IonPage, IonContent, IonList, IonItem, IonLabel, IonButton,
  IonIcon, IonInput, IonTextarea, IonSelect, IonSelectOption,
  IonDatetime, IonDatetimeButton, IonPopover, IonNote,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import '../styles/events.css';
import { useAuthContext } from '../context/UserContext';
import { trash, create, close, save, calendar, time, timer, chevronBack } from 'ionicons/icons';
import axios from 'axios';
import { VITE_LINK_FIREBASE_FUNCTIONS } from '../config/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../hooks/UseToast';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useTranslation } from 'react-i18next';

interface Event {
  id: string;
  dr: number;
  dt: string;
  sm: string;
  t: string;
  description?: string;
}

const Event: React.FC = () => {
  const { t } = useTranslation();

  const { currentUserData } = useAuthContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    date: '',
    time: '',
    duration: '',
    description: '',
    summary: ''
  });
  console.log(editData)
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (currentUserData?.events) {
      setEvents(currentUserData.events);
    }
  }, [currentUserData]);

  const handleDelete = async (eventId: string) => {
    if (!currentUserData?.uid) return;
    try {
      await axios.post(`${VITE_LINK_FIREBASE_FUNCTIONS}/deleteCalendarEvent`, {
        id: currentUserData.uid,
        eventId
      });

      const docRef = doc(db, "USERS", currentUserData?.uid);
      const eventToDelete = events.find(ev => ev.id === eventId);
      if (!eventToDelete) {
        return showToast("Hubo un error,intentelo más tarde.");
      }
      await updateDoc(docRef, { ev: arrayRemove(eventToDelete) })

      showToast('Evento eliminado correctamente');
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Error al eliminar el evento', 3000, 'danger');
    }
  };

  const startEditing = (event: Event) => {
    setEditingId(event.id);
    setEditData({
      date: event.dt,
      time: event.t,
      duration: event.dr.toString(),
      description: event.description || '',
      summary: event.sm
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleUpdate = async (eventId: string) => {
    if (!currentUserData?.uid) return;

    try {
      const eventDate = new Date(`${editData.date}T${editData.time}:00`);
      await axios.put(`${VITE_LINK_FIREBASE_FUNCTIONS}/updateCalendarEvent`, {
        id: currentUserData.uid,
        eventId,
        description: editData.description,
        eventDate: eventDate.toISOString(),
        duration: parseInt(editData.duration),
        summary: editData.summary
      });

      setEditingId(null);
      showToast('Evento actualizado correctamente');
    } catch (error) {
      console.error('Error updating event:', error);
      showToast('Error al actualizar el evento', 3000, 'danger');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <IonPage>
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
              text=''
            />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">
            {t("events")}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="event-content tema-oscuro">
        {ToastComponent}
        <div className="event-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("myEvents")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
             {t("eventDes")}
          </motion.p>
        </div>

        {events.length === 0 ? (
          <motion.div
            className="no-events"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>{t("noEvent")}</p>
          </motion.div>
        ) : (
          <IonList className="event-list">
            <AnimatePresence>
              {events.map(event => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="event-container"
                >
                  <IonItem
                    className={`event-card ${editingId === event.id ? 'editing' : ''}`}
                    lines="none"
                  >
                    {editingId === event.id ? (
                      <div className="edit-form">
                        <IonInput
                          label="Título"
                          labelPlacement="floating"
                          value={editData.summary}
                          onIonChange={e => setEditData({ ...editData, summary: e.detail.value! })}
                          className="custom-input"
                          fill="outline"
                        />

                        <IonTextarea
                          label="Descripción"
                          labelPlacement="floating"
                          value={editData.description}
                          onIonChange={e => setEditData({ ...editData, description: e.detail.value! })}
                          className="custom-textarea"
                          autoGrow={true}
                          fill="outline"
                        />

                        <div className="date-time-container">
                          <div className="date-picker">
                            <IonLabel>Fecha</IonLabel>
                            <IonDatetimeButton datetime={`date-${event.id}`}></IonDatetimeButton>
                            <IonPopover keepContentsMounted={true}>
                              <IonDatetime
                                id={`date-${event.id}`}
                                presentation="date"
                                value={editData.date}
                                onIonChange={e => setEditData({ ...editData, date: e.detail.value?.toString().split('T')[0]! })}
                              />
                            </IonPopover>
                          </div>

                          <div className="time-picker">
                            <IonLabel>Hora</IonLabel>
                            <IonDatetimeButton datetime={`time-${event.id}`}></IonDatetimeButton>
                            <IonPopover keepContentsMounted={true}>
                              <IonDatetime
                                id={`time-${event.id}`}
                                presentation="time"
                                value={editData.time}
                                onIonChange={e => setEditData({ ...editData, time: e.detail.value?.toString().split('T')[1]?.substring(0, 5)! })}
                              />
                            </IonPopover>
                          </div>
                        </div>

                        <IonSelect
                          label="Duración (minutos)"
                          value={editData.duration}
                          onIonChange={e => setEditData({ ...editData, duration: e.detail.value })}
                          className="custom-select"
                          fill="outline"
                        >
                          {[15, 30, 45, 60, 90, 120].map(min => (
                            <IonSelectOption key={min} value={min.toString()}>{min} min</IonSelectOption>
                          ))}
                        </IonSelect>

                        <div className="edit-actions">
                          <IonButton
                            fill="outline"
                            color="danger"
                            onClick={cancelEditing}
                            className="cancel-button"
                          >
                            <IonIcon icon={close} slot="start" />
                            Cancelar
                          </IonButton>
                          <IonButton
                            onClick={() => handleUpdate(event.id)}
                            className="save-button"
                          >
                            <IonIcon icon={save} slot="start" />
                            Guardar
                          </IonButton>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="event-info">
                          <h2 className="event-title">{event.sm}</h2>

                          <div className="event-meta">
                            <IonNote className="event-date">
                              <IonIcon icon={calendar} className="meta-icon" />
                              {formatDate(event.dt)}
                            </IonNote>

                            <div className="time-container">
                              <IonNote className="event-time">
                                <IonIcon icon={time} className="meta-icon" />
                                {event.t}
                              </IonNote>
                              <IonNote className="event-duration">
                                <IonIcon icon={timer} className="meta-icon" />
                                {event.dr} min
                              </IonNote>
                            </div>
                          </div>

                          {event.description && (
                            <p className="event-description">{event.description}</p>
                          )}
                        </div>

                        <div className="event-actions">
                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => startEditing(event)}
                            className="action-btn-evt"
                          >
                            <IonIcon icon={create} className="action-icon-evt" />
                          </IonButton>
                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(event.id)}
                            className="action-btn-evt"
                          >
                            <IonIcon icon={trash} className="action-icon-evt" />
                          </IonButton>
                        </div>
                      </>
                    )}
                  </IonItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Event;