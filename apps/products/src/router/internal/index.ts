import { NextFunction, Request, Response, Router } from 'express';
import { checkProduct } from '~/common';
import { getQuantityProduct, updateQuantity } from '~/controller';

export const router: Router = Router();

router.post(
    '/get-quantity',
    async (req: Request, _: Response, next: NextFunction) => {
        const id = req.body.id as string;
        const result = await getQuantityProduct({ id });
        next(result);
    },
);

router.put(
    '/update-quantity',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            id: string;
            quantity: number;
        };
        const result = await updateQuantity({ ...body });
        next(result);
    },
);

router.post(
    '/product',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as {
            id: string;
        };
        const result = await checkProduct({ ...body });
        next(result);
    },
);
