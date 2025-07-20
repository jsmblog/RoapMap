import { EditingObjectType } from "./iUser";
export interface ListCategoriesProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
}
export interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface ModalEditInfoProfileProps {
  isOpen: boolean;
  onClose: () => void;
  info: EditingObjectType;
  setInfo: React.Dispatch<React.SetStateAction<EditingObjectType>>;
}

export interface ModalOptionSettingProps{
  isOpen:boolean,
  onClose:() => void;
  info: SettingObjectType;
  setInfo: React.Dispatch<React.SetStateAction<SettingObjectType>>;
}
type OptionSettingType = {icon:string, label:string, value: string, action?: () => void };
export interface SettingObjectType {
  initialBreakpoint: number,
  breakpoints: number,
  title: string;
  subtitle?: string;
  options?: OptionSettingType[];
  result1?: string;
}
