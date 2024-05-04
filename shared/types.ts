import { Locale } from './constants';

export type Seed = number;
export type UUID = string;

export interface User {
  id: UUID;
  fullName: string;
  address: string;
  phone: string;
}

export interface Query {
  locale: Locale;
  errors: string;
  seed: string;
  page: string;
}

export interface ResponseBody {
  query: Query;
  users: User[];
}

export interface State {
  locale: Locale;
  errors: string;
  seed: string;
  page: number;
}
