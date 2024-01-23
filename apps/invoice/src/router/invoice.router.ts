import { Payload, verifyRole, verifyToken } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    addProduct,
    changeQuantity,
    createInvoiceOffline,
    findInvoices,
    updateStatus,
} from '~/controller';
import {
    AddProductBody,
    FindReqQuery,
    UpdateQuantityBody,
    UpdateStatusBody,
} from '~/interface/request';
import { getProductDetails, getQuantity } from '~/service';

export const router: Router = Router();

router.get(
    '/',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findInvoices(query);
        next(result);
    },
);

//TODO: Offline
router.post(
    '/offline/',
    verifyToken,
    // verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const { name: name_user } = req.payload as Payload;
        const type = req.body.type as string;
        const result = await createInvoiceOffline({
            name_user,
            type,
        });
        next(result);
    },
);

router.post(
    '/offline/addProduct',
    verifyToken,
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as AddProductBody;
        const token: string | undefined = req.header('token');
        const respone = await getProductDetails({ ...body }, token);
        const data = {
            ...body,
            ...respone,
        };
        const result = await addProduct({ ...data });
        next(result);
    },
);

router.put(
    '/offline/update-quantity',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as UpdateQuantityBody;
        const result = await changeQuantity({ ...body });
        next(result);
    },
);

//TODO: Online
router.put(
    '/update',
    verifyToken,
    async (req: Request, _: Response, next: NextFunction) => {
        const { id: id_user, name: name_user } =
            req.payload as Payload;
        const body: UpdateStatusBody = req.body;
        const result = await updateStatus({
            id_user,
            name_user,
            ...body,
        });
        next(result);
    },
);
