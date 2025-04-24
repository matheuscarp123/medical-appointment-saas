import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  errors?: any[];
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor';
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errors = err.errors || null;

  res.status(statusCode).json({
    status: 'error',
    message,
    code: errorCode,
    errors,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

// Classe personalizada para erros da API
export class ApiErrorHandler extends Error {
  statusCode: number;
  code: string;
  errors?: any[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    
    // Garantir que o instanceof funcione corretamente
    Object.setPrototypeOf(this, ApiErrorHandler.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', errors?: any[]) {
    return new ApiErrorHandler(message, 400, code, errors);
  }

  static unauthorized(message: string, code = 'UNAUTHORIZED', errors?: any[]) {
    return new ApiErrorHandler(message, 401, code, errors);
  }

  static forbidden(message: string, code = 'FORBIDDEN', errors?: any[]) {
    return new ApiErrorHandler(message, 403, code, errors);
  }

  static notFound(message: string, code = 'NOT_FOUND', errors?: any[]) {
    return new ApiErrorHandler(message, 404, code, errors);
  }

  static conflict(message: string, code = 'CONFLICT', errors?: any[]) {
    return new ApiErrorHandler(message, 409, code, errors);
  }

  static internal(message: string, code = 'INTERNAL_SERVER_ERROR', errors?: any[]) {
    return new ApiErrorHandler(message, 500, code, errors);
  }
}
