import express, { type Request } from 'express';
import dotenv from 'dotenv';
import { random } from 'underscore';
import cors from 'cors';

import { Query, ResponseBody } from '../shared/types';
import {
  Locale,
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  MIN_ERRORS,
  MAX_ERRORS,
  MIN_SEED,
  MAX_SEED,
  MIN_PAGE,
  MAX_PAGE,
  USERS_PER_PAGE,
} from '../shared/constants';

import { FakeUserGenerator } from './lib/FakeUserGenerator';
import { MistakesGenerator } from './lib/MistakesGenerator';

dotenv.config({ path: '.env.local' });
const { PORT, CLIENT_URL } = process.env;

const corsOptions = {
  origin: CLIENT_URL,
};

const app = express();

const parseQuery = (query: Query) => {
  const locale = Object.values(Locale).some((loc) => loc === query.locale)
    ? query.locale
    : DEFAULT_LOCALE;

  const errors = Math.min(
    Math.max(parseFloat(query.errors) || DEFAULT_ERRORS, MIN_ERRORS),
    MAX_ERRORS,
  );

  const seed = Math.min(
    Math.max(parseInt(query.seed, 10) || random(MAX_SEED), MIN_SEED),
    MAX_SEED,
  );

  const page = Math.min(
    Math.max(parseInt(query.page, 10) || DEFAULT_PAGE, MIN_PAGE),
    MAX_PAGE,
  );

  return { locale, errors, seed, page };
};

app.get(
  '/',
  cors(corsOptions),
  (req: Request<object, ResponseBody, object, Query>, res) => {
    const { locale, errors, seed, page } = parseQuery(req.query);
    const finalSeed = (seed + page) % MAX_SEED;

    const users = new FakeUserGenerator(locale, finalSeed).generate(
      USERS_PER_PAGE,
    );
    const usersWithMistakes = new MistakesGenerator(locale, finalSeed).add(
      users,
      ['fullName', 'address', 'phone'],
      errors,
    );

    res.send({
      query: {
        locale,
        errors: String(errors),
        seed: String(seed),
        page: String(page),
      },
      users: usersWithMistakes,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Express app is listening at port ${PORT}`);
});
