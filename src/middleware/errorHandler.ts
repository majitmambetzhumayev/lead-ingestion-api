import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request, //technically, req works as well as _req, but _req is more ts compliant
  res: Response,
  _next: NextFunction // same story here
) => {
  console.error('Error:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};