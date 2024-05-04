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
export const STEP_SEED = 1;
export const DEFAULT_ERRORS = 0;
export const MIN_ERRORS = 0;
export const MAX_ERRORS = 10_000;
export const MAX_ERRORS_RANGE = 10;
export const STEP_ERRORS_RANGE = 0.25;
export const STEP_ERRORS = 1;
export const DEFAULT_PAGE = 0;
export const MIN_PAGE = 0;
export const MAX_PAGE = 1_000;
export const USERS_PER_PAGE = 20;
export const DEBOUNCE_DELAY = 1000;
