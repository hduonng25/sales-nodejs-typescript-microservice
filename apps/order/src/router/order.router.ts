import { NextFunction, Request, Response, Router } from 'express';
import {
    addProduct,
    cancelOrder,
    changeQuantity,
    createOrderOffline,
    getOrderOffline,
} from '~/controller';
import {
    AddProductBody,
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
