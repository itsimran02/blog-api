import { validationResult } from 'express-validator';

import type { Request, Response, NextFunction } from 'express';

const validationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'validation error',
      error: errors.mapped(),
    });
    return;
  }
  next();
};

export default validationError;
