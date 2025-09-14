import { NextFunction, Request, Response } from 'express';
import { CelebrateError } from 'celebrate';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CelebrateError) {
    return res.status(400).send({ message: 'Ошибка валидации данных' });
  }

  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).send({ message: 'Маршрут не найден' });
};
