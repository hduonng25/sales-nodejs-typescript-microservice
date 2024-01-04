import { NextFunction, Request, Response, Router } from 'express';
import { createProduct, getProduct } from '~/controller';
import { createProductBody } from '~/interface/request';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getProduct();
        next(result);
    },
);

router.post(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createProductBody;
        const result = await createProduct(body);
        next(result);
    },
);
