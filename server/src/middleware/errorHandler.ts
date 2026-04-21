import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  
  res.status(500).json({
    code: 500,
    message: '服务器错误',
    data: null
  });
};

export default errorHandler;
