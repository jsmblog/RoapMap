interface CurrentUserData {
  name?: string;
}
export interface Preference {
  c: string; // Category
  v: string; // Value
}

export const buildPayload = (currentUserData: CurrentUserData, preferences: Preference[]): { prompt: string; isAppFastforms: boolean } => {
  const { name } = currentUserData || {};

  const formattedPrefs = (preferences || [])
    .map(pref => `${pref.c}: ${pref.v}`)
    .join(', ');

  const prompt = `
Actúa como un experto en redacción creativa y personal branding. Tu tarea es crear una breve descripción tipo “About Me” para un usuario, adaptada a su personalidad, intereses y objetivos. 
- Nombre del usuario: ${name || 'N/A'}.
- Preferencias: ${formattedPrefs || 'sin preferencias'}.
El tono debe ser natural, auténtico y con impacto, ideal para un perfil profesional o red social.
`.trim();
return {
    prompt,
    isAppFastforms: false,
}
};
