export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

const numbers = '0123456789';
const symbols = ' -,.';
const en = 'abcdefghijklmnopqrstuvwxyz';
const es = 'aábcdeéfghiíjklmnñoópqrstuúüvwxyz';
const fr = 'abcdefghijklmnopqrstuvwxyzàèùéâêîôûëïüÿæœç';

export const chars = {
  [Locale.en]: {
    text: `${en}${en.toLocaleUpperCase(Locale.en)}${numbers}${symbols}`,
    phone: `${numbers}-. x()`,
  },
  [Locale.es]: {
    text: `${es}${es.toLocaleUpperCase(Locale.es)}${numbers}${symbols}`,
    phone: `${numbers}-. `,
  },
  [Locale.fr]: {
    text: `${fr}${fr.toLocaleUpperCase(Locale.fr)}${numbers}${symbols}`,
    phone: `${numbers}+ `,
  },
};

export const DEFAULT_LOCALE = Locale.en;
export const MIN_SEED = 0;
export const MAX_SEED = 9_999_999;
export const DEFAULT_ERRORS = 0;
export const MIN_ERRORS = 0;
export const MAX_ERRORS = 10_000;
export const USERS_PER_PAGE = 20;
