import { atom } from 'nanostores';

export type Language = 'es' | 'en';

export const languageStore = atom<Language>('es');

export const setLanguage = (lang: Language) => {
  languageStore.set(lang);
};
