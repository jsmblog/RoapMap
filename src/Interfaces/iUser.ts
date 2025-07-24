import type { TextFieldTypes } from "@ionic/core";
export interface IDataUser {
  createAccount: string;
  email: string;
  description: string;
  location: {
    lat: number
    lng: number
  };
  name: string;
  preferences: {
    c: string;
    v: string;
  };
  birth: string;
  gender: string;
  uid: string;
}

//interfaz para el objeto editable del usuario
export type SafeFieldType = TextFieldTypes | "select" | "textarea" | "location-text" ;
export type OptionType = { label: string; value: string };
export interface EditingObjectType {
  initialBreakpoint: number,
  breakpoints: number,
  title: string;
  label?: string;
  label2?: string;
  placeholder: string;
  placeholder2: string,
  type: SafeFieldType
  result1?: string;
  result2?: string;
  options?: OptionType[];
  name: string;
};

export interface User {
  id: string;
  email: string;
  name: string;
}

/*interfaz para la pantalla de favoritos */
export  interface FavoriteItem {
    name: string;
    vicinity: string;
    type: 'restaurant' | 'cafe' | 'store' | 'library' | 'gym' | 'clinic';
}

export interface currentUserData {
    favorites: FavoriteItem[];
}