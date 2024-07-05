import { ERRORS, Locale, PAGE, SEED } from './constants';
import { random } from 'underscore';
import { z } from 'zod';

export const querySchema = z.object({
  locale: z.nativeEnum(Locale).catch(Locale.default).default(Locale.default),
  errors: z.coerce
    .number()
    .min(ERRORS.MIN)
    .max(ERRORS.MAX)
    .catch(ERRORS.DEFAULT)
    .default(ERRORS.DEFAULT),
  seed: z.coerce
    .number()
    .int()
    .min(SEED.MIN)
    .max(SEED.MAX)
    .catch(() => random(SEED.MAX))
    .default(() => random(SEED.MAX)),
  page: z.coerce
    .number()
    .int()
    .nonnegative()
    .catch(PAGE.DEFAULT)
    .default(PAGE.DEFAULT),
});
