import { ERRORS, Locale, PAGE, SEED } from './constants';
import { random } from 'underscore';
import { z } from 'zod';

export const querySchema = z.object({
  locale: z.nativeEnum(Locale),
  errors: z.coerce.number().min(ERRORS.MIN).max(ERRORS.MAX),
  seed: z.coerce.number().int().min(SEED.MIN).max(SEED.MAX),
  page: z.coerce.number().int().nonnegative(),
});

export const querySchemaWithDefaults = z.object({
  locale: querySchema.shape.locale
    .catch(Locale.default)
    .default(Locale.default),
  errors: querySchema.shape.errors
    .catch(ERRORS.DEFAULT)
    .default(ERRORS.DEFAULT),
  seed: querySchema.shape.seed
    .catch(() => random(SEED.MAX))
    .default(() => random(SEED.MAX)),
  page: querySchema.shape.page.catch(PAGE.DEFAULT).default(PAGE.DEFAULT),
});
