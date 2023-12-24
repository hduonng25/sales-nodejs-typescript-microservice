import { NextFunction, Request, Response } from 'express';

//TODO: config middleware
export interface Middleware {
    (req: Request, res: Response, next: NextFunction): void;
}
