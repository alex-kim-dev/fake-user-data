import { querySchema } from './schema.js';
import { z } from 'zod';

export type Seed = number;
export type UUID = string;

export interface User {
  id: UUID;
  fullName: string;
  address: string;
  phone: string;
}

export type Query = z.infer<typeof querySchema>;

export interface ResponseBody {
  query: Query;
  users: User[];
}
