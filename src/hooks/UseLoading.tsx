import { useIonLoading } from "@ionic/react";

export const useLoading = () => {
  const [present, dismiss] = useIonLoading();

  const showLoading = async (message: string) => {
    await present({
      message,
      spinner: 'circles',
    });
  };

  const hideLoading =async () => {
   await dismiss();
  };

  return { showLoading, hideLoading };
}