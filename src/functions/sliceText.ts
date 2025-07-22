export const sliceText = (text: string, maxLength: number): string => {
    return text.length > maxLength ?  `${text.slice(0, maxLength)}...` : text;
}