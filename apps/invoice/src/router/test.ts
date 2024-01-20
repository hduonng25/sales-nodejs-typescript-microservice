import { NextFunction, Request, Response, Router } from 'express';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        let result = 'demo';
        next(result);
    },
);
