import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error';
import { config } from '../config/utils';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Something went wrong on the server';
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
