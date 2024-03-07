import { NextFunction, Request, Response, Router } from 'express';
import { checkUser } from '../../common';

export const router: Router = Router();

router.post(
    '/user',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            id: string;
        };
        const result = await checkUser({ ...body });
        next(result);
    },
);
