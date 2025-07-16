import type { TextFieldTypes } from "@ionic/core";

const validInputTypes: TextFieldTypes[] = [
    "text",
    "password",
    "email",
    "number",
    "date",
    "tel",
    "url",
    "search",
    "time",
    "week",
    "month", 
    "datetime-local"
];
export const getSafeType = (type: string): TextFieldTypes | undefined => {
    return validInputTypes.includes(type as TextFieldTypes) ? (type as TextFieldTypes) : undefined;
}