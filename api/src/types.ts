import { z } from 'zod';

import type { querySchema } from '~/schema';

export type Query = z.infer<typeof querySchema>;

export type CharSet = 'text' | 'phone';

declare module 'express' {
  export interface Request {
    parsedQuery?: Query;
  }
}
