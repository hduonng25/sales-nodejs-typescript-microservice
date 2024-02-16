import { NextFunction, Request, Response, Router } from 'express';
import {
    addProduct,
    cancelOrder,
    cancelOrderMany,
    changeQuantity,
    createOrderOnline,
    createOrderOffline,
    getOrderOffline,
    payOrder,
    payOrderOnline,
    payment,
    updateInvoice,
} from '~/controller';
import {
    AddProductBody,
    InvoiceReqBody,
    UpdateQuantityBody,
} from '~/interface/request';

export const router: Router = Router();

//TODO: Offline
router.get(
    '/offline/',
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getOrderOffline();
        next(result);
    },
);

router.post(
    '/offline/create-Order',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            name_user: string;
            type: string;
        };
        const result = await createOrderOffline({ ...body });
        next(result);
    },
);

router.post(
    '/offline/add-product',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as AddProductBody;
        const result = await addProduct({ ...body });
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

router.put(
    '/offline/cancel',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            code: string;
        };
        const result = await cancelOrder({ ...body });
        next(result);
    },
);

router.put(
    '/offline/cancelMany',
    async (req: Request, _: Response, next: NextFunction) => {
        const code = req.body.code as string[];
        const result = await cancelOrderMany({ code });
        next(result);
    },
);

router.put(
    '/offline/pay',
    async (req: Request, _: Response, next: NextFunction) => {
        const code = req.body.code as string;
        const result = await payOrder({ code });
        next(result);
    },
);

//TODO: Online
router.post(
    '/online/created',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as InvoiceReqBody;
        const result = await createOrderOnline({ ...body });
        next(result);
    },
);

router.put(
    '/online/pay',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            code: string;
        };
        const result = await payOrderOnline({ ...body });
        next(result);
    },
);

router.post(
    '/online/payment',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            orderCode: string;
        };
        const result = await payment({ ...body });
        next(result);
    },
);

router.put(
    '/online/update',
    async (req: Request, _: Response, next: NextFunction) => {
        const orderCode = req.body.orderCode;
        const result = await updateInvoice({ orderCode: orderCode });
        next(result);
    },
);
