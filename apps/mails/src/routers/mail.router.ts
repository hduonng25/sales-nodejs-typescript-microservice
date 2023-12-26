import { NextFunction, Request, Response, Router } from 'express';
import { sendMailsCreateUser } from '~/controller';
import { sendMailsCreateUserBody } from '~/interface/request';
export const router: Router = Router();

router.post(
    '/',
    async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        const body = request.body as sendMailsCreateUserBody;
        const result = await sendMailsCreateUser(body);
        next(result);
    },
);
