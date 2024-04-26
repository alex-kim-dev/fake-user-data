import express, { type Request } from 'express';
import dotenv from 'dotenv';
import { random } from 'underscore';

import { Locale } from './types';
import { FakeUserGenerator } from './lib/FakeUserGenerator';

const DEFAULT_LOCALE = Locale.en;
const MIN_SEED = 0;
const MAX_SEED = 9_999_999;
const DEFAULT_ERRORS = 0;
const MIN_ERRORS = 0;
const MAX_ERRORS = 10_000;
const USERS_PER_PAGE = 20;

dotenv.config({ path: '.env.local' });
const port = process.env.PORT;
const app = express();

interface RequestParams {}
interface ResponseBody {
  query: {
    locale: Locale;
    errors: number;
    seed: number;
  };
  data: ReturnType<FakeUserGenerator['generate']>;
}
interface RequestBody {}
interface RequestQuery {
  lang?: Locale;
  errors?: string;
  seed?: string;
}

const parseQuery = (query: RequestQuery) => {
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
  (
    req: Request<RequestParams, ResponseBody, RequestBody, RequestQuery>,
    res,
  ) => {
    const { locale, errors, seed } = parseQuery(req.query);
    const data = new FakeUserGenerator(locale, seed).generate(USERS_PER_PAGE);

    res.send({ query: { locale, errors, seed }, data });
  },
);

app.listen(port, () => {
  console.log(`Express app is listening at port ${port}`);
});
