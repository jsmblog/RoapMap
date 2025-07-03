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
import type { TextFieldTypes } from "@ionic/core";

export type SafeFieldType = TextFieldTypes | "select" | "textarea";
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
    name:string;
    isRequired: boolean;
};