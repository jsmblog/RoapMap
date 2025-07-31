import { IonAlert } from "@ionic/react";
import { ReactElement, useState } from "react";

type ButtonHandler = () => void;

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<string>('dark');
  const [header, setHeader] = useState<string>('');

  const showAlert = (
    header: string,
    msg: string,
    type: string = 'dark',
  ) => {
    setHeader(header);
    setMessage(msg);
    setType(type);
    setIsOpen(true);
  };

  const AlertComponent: ReactElement = (
    <IonAlert
      color={type}
      isOpen={isOpen}
      header={header}
      message={message}
      buttons={[
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            setIsOpen(false);
          },
        },
      ]}
      onDidDismiss={() => setIsOpen(false)}
    />
  );

  return { showAlert, AlertComponent };
}
