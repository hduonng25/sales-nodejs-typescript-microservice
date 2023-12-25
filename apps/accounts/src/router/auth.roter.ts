import { NextFunction, Request, Response, Router } from 'express';
import { login } from '~/controller';
import { loginBody } from '~/interface/request';

export const router: Router = Router();

router.post('/', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body as loginBody;
    const result = await login({ ...body });
    next(result);
});
