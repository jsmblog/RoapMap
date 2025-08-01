import React, { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { chevronBack, locationOutline } from 'ionicons/icons';
import { useAuthContext } from '../context/UserContext';
import '../styles/History.css';
import { HistoryItem } from '../Interfaces/iUser';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useAlert } from '../hooks/UseAlert';
import { useTranslation } from 'react-i18next';

const History: React.FC = () => {
  const { currentUserData } = useAuthContext();
  const { showAlert, AlertComponent } = useAlert();
  const { t } = useTranslation();

  const [isCheckMark, setIsCheckMark] = useState(false);
  const [btnAction, setBtnAction] = useState(true);
  const [OnConfirm, setOnConfirm] = useState(false);
  const [onCancel, setOnCancel] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState<string[]>([]);

  const handleRemoveHistory = () => {
    try {
      const todosLosIds =
        currentUserData.history?.map((history: HistoryItem) => history.id) || [];
      setIsDeleteAll(todosLosIds);
      setOnConfirm(true);
      setOnCancel(true);
      setIsCheckMark(true);
      setBtnAction(false);
    } catch (error) {
      console.log('Error deleting history', error);
    }
  };

  const handleSelectHistory = (id: string, checked: boolean) => {
    if (checked) {
      setIsDeleteAll((prev) => [...prev, id]);
    } else {
      setIsDeleteAll((prev) => prev.filter((favId) => favId !== id));
    }
  };

  const ConfirmDeletHistory = async () => {
    try {
      const historyFilter = currentUserData.history.filter(
        (h: HistoryItem) => !isDeleteAll.includes(h.id)
      );

      const refDocument = doc(db, 'USERS', currentUserData.uid);
      await updateDoc(refDocument, { h: historyFilter });

      showAlert(t('historys.deletedTitle'), t('historys.deletedMessage'));

      setIsCheckMark(false);
      setOnConfirm(false);
      setIsDeleteAll([]);
      setBtnAction(true);
    } catch (error) {
      console.log('Error deleting history', error);
    }
  };

  const CalcelDeletHistory = () => {
    setIsCheckMark(false);
    setOnConfirm(false);
    setOnCancel(false);
    setBtnAction(true);
    setIsDeleteAll([]);
  };

  return (
    <IonPage>
      {AlertComponent}
      <IonHeader className="edit-profile-hearder">
        <IonToolbar className="setting-toolbar tema-oscuro">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tab/settings"
              className="iconos-oscuros"
              icon={chevronBack}
            />
          </IonButtons>
          <IonTitle className="settings-ion-title texto-quinto">
            {t('historys.title')}
          </IonTitle>
          {btnAction && (
            <IonButton
              onClick={handleRemoveHistory}
              disabled={currentUserData.history.length === 0}
              fill="outline"
              className="btn-action btn-delete"
              slot="end"
            >
              {t('historys.deleteAll')}
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent className="favorite-content tema-oscuro ">
        {!currentUserData.history || currentUserData.history.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={locationOutline} size="large" className="empty-icon" />
            <h2>{t('historys.emptyTitle')}</h2>
            <p>{t('historys.emptyMessage')}</p>
          </div>
        ) : (
          <IonList className="history-list tema-oscuro2">
            <>
              <div className="button-container">
                {OnConfirm && (
                  <IonButton
                    onClick={ConfirmDeletHistory}
                    fill="solid"
                    color="success"
                    className="btn-action btn-confirm"
                  >
                    {t('historys.confirm')}
                  </IonButton>
                )}
                {onCancel && (
                  <IonButton
                    onClick={CalcelDeletHistory}
                    fill="outline"
                    color="danger"
                    className="btn-action btn-cancel"
                  >
                    {t('historys.cancel')}
                  </IonButton>
                )}
              </div>
              {currentUserData.history.map((place: HistoryItem, index: number) => (
                <IonItem key={index} className="history-item tema-oscuro">
                  <IonIcon className="category-icon texto-quinto" icon={locationOutline} />
                  <IonLabel className="place-name place-name-history texto-primario">
                    {place.name}
                    <p className="history-date">{place.date}</p>
                  </IonLabel>
                  {isCheckMark && (
                    <IonCheckbox
                      checked={isDeleteAll.includes(place.id)}
                      onIonChange={(e) =>
                        handleSelectHistory(place.id, e.detail.checked)
                      }
                    />
                  )}
                </IonItem>
              ))}
            </>
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default History;
