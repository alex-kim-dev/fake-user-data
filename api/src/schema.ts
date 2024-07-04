import {
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  Locale,
  MAX_ERRORS,
  MAX_SEED,
  MIN_ERRORS,
  MIN_SEED,
} from '@fake-user-data/shared';
import { random } from 'underscore';
import { z } from 'zod';

export const querySchema = z.object({
  locale: z.nativeEnum(Locale).catch(DEFAULT_LOCALE).default(DEFAULT_LOCALE),
  errors: z.coerce
    .number()
    .min(MIN_ERRORS)
    .max(MAX_ERRORS)
    .catch(DEFAULT_ERRORS)
    .default(DEFAULT_ERRORS),
  seed: z.coerce
    .number()
    .int()
    .min(MIN_SEED)
    .max(MAX_SEED)
    .catch(() => random(MAX_SEED))
    .default(() => random(MAX_SEED)),
  page: z.coerce
    .number()
    .int()
    .nonnegative()
    .catch(DEFAULT_PAGE)
    .default(DEFAULT_PAGE),
});
