import { fr } from './fr';
import { en } from './en';

export const translations = {
  fr,
  en,
};

export type Locale = keyof typeof translations;
export type Translations = typeof fr;
