export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
  default = Locale.en,
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

export const enum SEED {
  MIN = 0,
  MAX = 9_999_999,
}

export const enum ERRORS {
  DEFAULT = 0,
  MIN = 0,
  MAX = 10_000,
}

export const enum PAGE {
  DEFAULT = 0,
  USERS = 20,
}
