import { useState, ReactElement } from 'react';
import { IonToast } from '@ionic/react';

export function useToast() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [duration, setDuration] = useState<number>(3000);
  const [type, setType] = useState<string>('dark');
  const showToast = (msg: string, dur: number = 3000,type:string = 'dark') => {
    setMessage(msg);
    setDuration(dur);
    setIsOpen(true);
    setType(type);
  };

  const ToastComponent: ReactElement = (
    <IonToast
      color={type}
      isOpen={isOpen}
      message={message}
      duration={duration}
      onDidDismiss={() => setIsOpen(false)}
    />
  );

  return { showToast, ToastComponent };
}
