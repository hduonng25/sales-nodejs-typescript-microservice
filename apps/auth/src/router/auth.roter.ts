import { NextFunction, Request, Response, Router } from 'express';
import { login, newToken } from '~/controller';
import { loginBody } from '~/interface/request';

export const router: Router = Router();

router.post('/', async (req: Request, _: Response, next: NextFunction) => {
    const body = req.body as loginBody;
    const result = await login({ ...body });
    next(result);
});

router.post(
    '/refresh-token',
    async (req: Request, _: Response, next: NextFunction) => {
        const token = req.header('refresh-token') as string;
        const result = await newToken(token);
        next(result);
    },
);
