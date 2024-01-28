import { Payload, verifyRole, verifyToken } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    findInvoices,
    getDetails,
    updateStatus,
} from '~/controller';
import { FindReqQuery, UpdateStatusBody } from '~/interface/request';

export const router: Router = Router();

//TODO: Online
router.get(
    '/online/',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findInvoices(query);
        next(result);
    },
);

router.put(
    '/online/update-status',
    verifyToken,
    async (req: Request, _: Response, next: NextFunction) => {
        const { id: id_user, name: name_user } =
            req.payload as Payload;
        const body: UpdateStatusBody = req.body;
        const data = {
            ...body,
            id_user,
            name_user,
        };
        const result = await updateStatus({ ...data });
        next(result);
    },
);

router.post(
    '/online/get-details',
    async (req: Request, _: Response, next: NextFunction) => {
        const code = req.body.code as string;
        const result = await getDetails({ code });
        next(result);
    },
);

//TODO: Offline
router.get(
    '/offline/',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findInvoices(query);
        next(result);
    },
);
