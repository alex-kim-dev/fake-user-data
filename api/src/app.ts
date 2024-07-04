import type { ResponseBody, User } from '@fake-user-data/shared';
import { PAGE, SEED } from '@fake-user-data/shared';
import cors from 'cors';
import dotenv from 'dotenv';
import { type CsvOutput, generateCsv, mkConfig } from 'export-to-csv';
import express, { type Request } from 'express';
import morgan from 'morgan';

import { FakeUserGenerator } from '~/lib/FakeUserGenerator';
import { MistakesGenerator } from '~/lib/MistakesGenerator';
import { validateQuery } from '~/middleware';
import type { Query } from '~/types';

dotenv.config();

const { PORT, CLIENT_URL } = process.env;
const csvConfig = mkConfig({ useKeysAsHeaders: true });
const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(morgan('dev'));
app.use(express.json());
app.use(validateQuery);

app.get('/', (req: Request<object, ResponseBody, object, Query>, res) => {
  if (!req.parsedQuery) throw new Error("Can't access parsed query");

  const { locale, errors, seed, page } = req.parsedQuery;
  const finalSeed = (seed + page) % SEED.MAX;

  const users = new FakeUserGenerator(locale, finalSeed).generate(PAGE.USERS);
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
  if (!req.parsedQuery) throw new Error("Can't access parsed query");

  const { locale, errors, seed, page: lastPage } = req.parsedQuery;
  const users: User[] = [];

  for (let page = 0; page <= lastPage; page += 1) {
    const finalSeed = (seed + page) % SEED.MAX;
    const cleanUsers = new FakeUserGenerator(locale, finalSeed).generate(
      PAGE.USERS,
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
