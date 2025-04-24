import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebase-admin';

// Interface para estender o Request do Express com o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role?: string;
      };
    }
  }
}

export interface AuthUser {
  uid: string;
  email: string;
  companyId: string;
  [key: string]: any;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Acesso não autorizado. Token de autenticação não fornecido.'
      });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      // companyId deve estar nos custom claims do usuário
      if (!decodedToken.companyId) {
        return res.status(403).json({
          status: 'error',
          message: 'Usuário sem empresa associada (companyId)'
        });
      }
      req.user = {
        ...decodedToken,
        companyId: decodedToken.companyId as string
      };
      
      next();
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(403).json({
        status: 'error',
        message: 'Token inválido ou expirado.'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno no servidor durante a autenticação.'
    });
  }
};

// Middleware para verificar se o usuário tem determinado papel (role)
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Usuário não autenticado.'
      });
    }

    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso não autorizado para este recurso.'
      });
    }

    next();
  };
};
