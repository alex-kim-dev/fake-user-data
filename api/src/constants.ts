import { Locale } from '@fake-user-data/shared';

import type { CharSet } from '~/types';

const NUMBERS = '0123456789';
const SYMBOLS = ' -,.';
const EN = 'abcdefghijklmnopqrstuvwxyz';
const ES = 'aábcdeéfghiíjklmnñoópqrstuúüvwxyz';
const FR = 'abcdefghijklmnopqrstuvwxyzàèùéâêîôûëïüÿæœç';

export const CHAR_SET: Record<Locale, Record<CharSet, string>> = {
  [Locale.en]: {
    text: `${EN}${EN.toLocaleUpperCase(Locale.en)}${NUMBERS}${SYMBOLS}`,
    phone: `${NUMBERS}-. x()`,
  },
  [Locale.es]: {
    text: `${ES}${ES.toLocaleUpperCase(Locale.es)}${NUMBERS}${SYMBOLS}`,
    phone: `${NUMBERS}-. `,
  },
  [Locale.fr]: {
    text: `${FR}${FR.toLocaleUpperCase(Locale.fr)}${NUMBERS}${SYMBOLS}`,
    phone: `${NUMBERS}+ `,
  },
};

export enum Mistake {
  deleteChar,
  addChar,
  swapAdjacentChars,
}

export const UNIQUE_MISTAKES = Object.keys(Mistake).length;
