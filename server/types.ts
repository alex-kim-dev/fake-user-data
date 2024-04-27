/* eslint-disable no-shadow */

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

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
  errors: number;
  seed: number;
}

export interface ResponseBody {
  query: Query;
  users: User[];
}
