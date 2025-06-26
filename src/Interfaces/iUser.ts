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
}

//interfaz para el objeto editable del usuario
export type OptionType = { label: string; value: string };
export interface EditingObjectType {
    title: string;
    label?: string;
    placeholder: string;
    type: string;
    result1?: string;
    result2?: string;
    options?: OptionType[];
    isRequired: boolean;
    icon: string;
  };