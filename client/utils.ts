import {
  Locale,
  MAX_ERRORS,
  MAX_SEED,
  MIN_ERRORS,
  MIN_SEED,
} from '../shared/constants';

const errorsFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  roundingMode: 'trunc',
  useGrouping: false,
} as Intl.NumberFormatOptions);

const seedFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
  roundingMode: 'trunc',
  useGrouping: false,
} as Intl.NumberFormatOptions);

export const parse = {
  locale(value: string) {
    return Object.values(Locale).some((locale) => locale === value)
      ? (value as Locale)
      : null;
  },

  errors(value: string) {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed < MIN_ERRORS || parsed > MAX_ERRORS)
      return null;
    return errorsFormatter.format(parsed);
  },

  seed(value: string) {
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < MIN_SEED || parsed > MAX_SEED)
      return null;
    return seedFormatter.format(parsed);
  },
};
