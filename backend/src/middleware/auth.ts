import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger'

export interface AuthRequest extends Request {
  user?: {
    id: string
    address: string
  }
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Access denied. No token provided.',
      })
      return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = decoded
    next()
  } catch (error) {
    logger.error('Auth middleware error:', error)
    res.status(401).json({
      status: 'error',
      message: 'Invalid token.',
    })
    return
  }
}

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      req.user = decoded
    }
    next()
  } catch (error) {
    // Continue without auth if token is invalid
    next()
  }
}
