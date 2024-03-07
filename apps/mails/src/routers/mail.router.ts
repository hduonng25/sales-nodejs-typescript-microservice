import { NextFunction, Request, Response, Router } from 'express';
import { sendMailsCreateUser } from '../controller';
import { sendMailsCreateUserBody } from '../interface/request';
export const router: Router = Router();

router.post(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as sendMailsCreateUserBody;
        const result = await sendMailsCreateUser(body);
        next(result);
    },
);
