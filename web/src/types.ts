import { Locale } from '@fake-user-data/shared';

export interface Query {
  locale: Locale;
  errors: string;
  seed: string;
  page: string;
}

export interface State {
  locale: Locale;
  errors: string;
  seed: string;
  page: number;
}
