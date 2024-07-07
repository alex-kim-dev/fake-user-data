import { querySchemaWithDefaults } from '@fake-user-data/shared';
import type { Request, RequestHandler } from 'express';

export const validateQuery: RequestHandler = (req: Request, res, next) => {
  const { success, data, error } = querySchemaWithDefaults.safeParse(req.query);

  if (success) {
    req.parsedQuery = data;
    next();
  } else {
    res
      .status(400)
      .send(error.errors.map(({ path, message }) => ({ path, message })));
  }
};
