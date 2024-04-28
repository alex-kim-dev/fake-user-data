import express, { type Request } from 'express';
import dotenv from 'dotenv';
import { random } from 'underscore';
import cors from 'cors';

import { Query, ResponseBody } from '../shared/types';
import {
  Locale,
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  MAX_ERRORS,
  MAX_SEED,
  MIN_ERRORS,
  MIN_SEED,
  USERS_PER_PAGE,
} from '../shared/constants';

import { FakeUserGenerator } from './lib/FakeUserGenerator';

dotenv.config({ path: '.env.local' });
const { PORT, CLIENT_URL } = process.env;

const corsOptions = {
  origin: CLIENT_URL,
};

const app = express();

const parseQuery = (query) => {
  const locale = Object.values(Locale).some((loc) => loc === query.lang)
    ? query.lang
    : DEFAULT_LOCALE;

  const errors = Math.min(
    Math.max(parseFloat(query.errors) || DEFAULT_ERRORS, MIN_ERRORS),
    MAX_ERRORS,
  );

  const seed = Math.min(
    Math.max(parseInt(query.seed, 10) || random(MAX_SEED), MIN_SEED),
    MAX_SEED,
  );

  return { locale, errors, seed };
};

app.get(
  '/',
  cors(corsOptions),
  (req: Request<object, ResponseBody, object, Query>, res) => {
    const { locale, errors, seed } = parseQuery(req.query);
    const users = new FakeUserGenerator(locale, seed).generate(USERS_PER_PAGE);

    res.send({ query: { locale, errors, seed }, users });
  },
);

app.listen(PORT, () => {
  console.log(`Express app is listening at port ${PORT}`);
});
