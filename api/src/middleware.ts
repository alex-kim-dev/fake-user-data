import type { Request, RequestHandler } from 'express';

import { querySchema } from '~/schema';

export const validateQuery: RequestHandler = (req: Request, res, next) => {
  const { success, data, error } = querySchema.safeParse(req.query);

  if (success) {
    req.parsedQuery = data;
    next();
  } else {
    res
      .status(400)
      .send(error.errors.map(({ path, message }) => ({ path, message })));
  }
};
