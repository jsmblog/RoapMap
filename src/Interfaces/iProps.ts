import { EditingObjectType } from "./iUser";

export interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface ModalEditInfoProfileProps {
  isOpen: boolean;
  onClose: () => void;
  info: EditingObjectType;
}