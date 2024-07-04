import { z } from 'zod';

import type { querySchema } from '~/schema';

export type Query = z.infer<typeof querySchema>;

declare module 'express' {
  export interface Request {
    parsedQuery?: Query;
  }
}
