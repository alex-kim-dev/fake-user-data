import type { Query } from '@fake-user-data/shared';

export type CharSet = 'text' | 'phone';

declare module 'express' {
  export interface Request {
    parsedQuery?: Query;
  }
}
