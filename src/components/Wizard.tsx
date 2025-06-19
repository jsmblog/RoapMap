import {
  IonPage,
  IonToolbar,
  IonFooter,
  IonButton,
  IonButtons,
  IonIcon,
  useIonRouter,
} from '@ionic/react';
import React, { useState } from 'react';
import { wizardSteps } from '../functions/wizardSteps';
import '../styles/wizard.css';
import { chevronBackOutline } from 'ionicons/icons';
import { useToast } from '../hooks/UseToast';
import { useLoading } from '../hooks/UseLoading';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/initializeApp';
import { useAuthContext } from '../context/UserContext';

interface Selection {
  v: string;
  c: string;
}

const Wizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Selection[]>>({});
  const current = wizardSteps[step];
  const [loading, setLoading] = useState<boolean>(false);

  const { showToast, ToastComponent } = useToast();
  const { showLoading, hideLoading } = useLoading();
  const { currentUserData } = useAuthContext();
  const router = useIonRouter();

  const toggleOption = (v: string, c: string) => {
    setAnswers(prev => {
      const list = prev[step] ?? [];
      const exists = list.some(s => s.v === v);

      if (exists) {
        return { 
          ...prev,
          [step]: list.filter(s => s.v !== v)
        };
      }

      if (list.length >= current.maxSelect) {
        showToast(`Puedes seleccionar máximo ${current.maxSelect} opciones`);
        return prev;
      }

      return {
        ...prev,
        [step]: [...list, { v, c }]
      };
    });
  };

  const handleNext = async () => {
    if (step < wizardSteps.length - 1) {
      return setStep(step + 1);
    }
    showLoading('Guardando cambios...');
    setLoading(true);
    try {
      const refUser = doc(db, 'USERS', currentUserData!.uid);
      const allSelections = Object.values(answers).flat();
      await updateDoc(refUser, { pre: allSelections });
    } catch (error) {
      console.error(error);
      showToast('Error al finalizar el wizard. Inténtalo de nuevo.');
      return;
    } finally {
      await hideLoading();
      setLoading(false);
    }
    router.push('/tab/home', 'root');
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    handleNext();
  };

  const selectedVs = (answers[step] ?? []).map(s => s.v);

  return (
    <IonPage className="wizard-page">
      {ToastComponent}

      <section className="wizard-content">
        <h2 className="wizard-title">{current.title}</h2>

        <div className="text-center">
          <h5 className="step-counter">
            {step + 1} / {wizardSteps.length}
          </h5>
          <p className="wizard-subtitle">{current.subtitle}</p>
          <span className="max-select">
            máximo: {current.maxSelect}
          </span>
        </div>

        <div className="options-grid">
          {current.options.map(opt => {
            const isSel = selectedVs.includes(opt.value);
            return (
              <IonButton
                key={opt.value}
                fill={isSel ? 'solid' : 'outline'}
                shape="round"
                size="small"
                onClick={() => toggleOption(opt.value, opt.category)}
                className={isSel ? 'option-selected' : 'option'}
              >
                {opt.label}
              </IonButton>
            );
          })}
        </div>
      </section>

      <IonFooter>
        <IonToolbar className="wizard-footer">
          <IonButtons slot="start">
            {step > 0 && (
              <IonButton onClick={handlePrev} fill="clear">
                <IonIcon size="small" icon={chevronBackOutline} />
              </IonButton>
            )}
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton className="skip" onClick={handleSkip} fill="clear">
              Omitir
            </IonButton>
            <IonButton onClick={handleNext} disabled={loading} expand="block">
              {step === wizardSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default React.memo(Wizard);
