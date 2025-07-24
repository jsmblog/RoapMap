import { IonAlert } from "@ionic/react";
import { ReactElement, useState } from "react";

type ButtonHandler = () => void;

export function useAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [type, setType] = useState<string>('dark');
  const [header, setHeader] = useState<string>('');
  const [onConfirm, setOnConfirm] = useState<ButtonHandler>(() => () => {});

  const showAlert = (
    header: string,
    msg: string,
    type: string = 'dark',
    confirmHandler: ButtonHandler = () => {},
  ) => {
    setHeader(header);
    setMessage(msg);
    setType(type);
    setOnConfirm(() => confirmHandler);
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
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            setIsOpen(false);
          },
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            onConfirm();
            setIsOpen(false);
          },
        },
      ]}
      onDidDismiss={() => setIsOpen(false)}
    />
  );

  return { showAlert, AlertComponent };
}
