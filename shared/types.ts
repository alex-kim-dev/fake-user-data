import { Locale } from './constants';

export type Seed = number;
export type UUID = string;

export interface User {
  index: number;
  id: UUID;
  fullName: string;
  address: string;
  phone: string;
}

export interface Query {
  locale: Locale;
  errors: string;
  seed: string;
}

export interface ResponseBody {
  query: Query;
  users: User[];
}
