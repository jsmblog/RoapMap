interface HasNameCompleted {
    (name: unknown): boolean;
}
interface IsValidWord {
    (word: string): boolean;
}
export const hasNameCompleted: HasNameCompleted = (name) => {
    if (typeof name !== 'string') return false;
    const trimmedName = name.trim();
    const parts: string[] = trimmedName.split(/\s+/);
    const isValidWord: IsValidWord = word => /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(word);
    const validParts: string[] = parts.filter(isValidWord);
    return validParts.length >= 2 && validParts.length <= 4;
}