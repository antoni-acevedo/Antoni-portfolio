import { atom, onMount } from 'nanostores';

export type Language = 'es' | 'en';

// Initial state from localStorage if available
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio_lang');
    if (saved === 'es' || saved === 'en') return saved as Language;
  }
  return 'es';
};

export const languageStore = atom<Language>(getInitialLanguage());

export const setLanguage = (lang: Language) => {
  languageStore.set(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('portfolio_lang', lang);
  }
};

onMount(languageStore, () => {
  // Synchronize on mount just in case
  const lang = getInitialLanguage();
  if (languageStore.get() !== lang) {
    languageStore.set(lang);
  }
});
