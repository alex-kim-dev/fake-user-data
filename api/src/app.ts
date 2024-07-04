import type { Query, ResponseBody, User } from '@fake-user-data/shared';
import {
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  Locale,
  MAX_ERRORS,
  MAX_PAGE,
  MAX_SEED,
  MIN_ERRORS,
  MIN_PAGE,
  MIN_SEED,
  USERS_PER_PAGE,
} from '@fake-user-data/shared';
import cors from 'cors';
import dotenv from 'dotenv';
import { type CsvOutput, generateCsv, mkConfig } from 'export-to-csv';
import express, { type Request } from 'express';
import morgan from 'morgan';
import { random } from 'underscore';

import { FakeUserGenerator } from './lib/FakeUserGenerator';
import { MistakesGenerator } from './lib/MistakesGenerator';

dotenv.config();
const { PORT, CLIENT_URL } = process.env;

const csvConfig = mkConfig({ useKeysAsHeaders: true });

const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());

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

app.get('/', (req: Request<object, ResponseBody, object, Query>, res) => {
  const { locale, errors, seed, page } = parseQuery(req.query);
  const finalSeed = (seed + page) % MAX_SEED;

  const users = new FakeUserGenerator(locale, finalSeed).generate(
    USERS_PER_PAGE,
  );
  const usersWithMistakes = new MistakesGenerator(locale, finalSeed).add(
    users,
    ['fullName', 'address', 'phone'],
    errors,
  ) as User[];

  res.send({
    query: {
      locale,
      errors: String(errors),
      seed: String(seed),
      page: String(page),
    },
    users: usersWithMistakes,
  });
});

app.get('/export', (req: Request<object, CsvOutput, object, Query>, res) => {
  const { locale, errors, seed, page: lastPage } = parseQuery(req.query);
  const users: User[] = [];

  for (let page = 0; page <= lastPage; page += 1) {
    const finalSeed = (seed + page) % MAX_SEED;
    const cleanUsers = new FakeUserGenerator(locale, finalSeed).generate(
      USERS_PER_PAGE,
    );
    const usersWithMistakes = new MistakesGenerator(locale, finalSeed).add(
      cleanUsers,
      ['fullName', 'address', 'phone'],
      errors,
    ) as User[];
    users.push(...usersWithMistakes);
  }

  const usersWithIndex = users.map((user, i) => ({ index: i + 1, ...user }));
  const csv = generateCsv(csvConfig)(usersWithIndex);

  res.type('text/csv').attachment('export.csv').send(csv);
});

app.listen(PORT, () => {
  console.log(`Express app is listening at port ${PORT}`);
});
