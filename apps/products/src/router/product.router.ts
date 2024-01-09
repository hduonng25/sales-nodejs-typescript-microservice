import { NextFunction, Request, Response, Router } from 'express';
import {
    createProduct,
    getProduct,
    getProductByID,
    setAvatarProductDetails,
    setImageProductDetails,
    updateProducts,
    updateQuantityProductsDetails,
} from '~/controller';
import {
    createProductBody,
    setImageProductDetailsBody,
    updateProductsBody,
    updateProductsDetails,
} from '~/interface/request';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getProduct();
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await getProductByID({ id });
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

router.put(
    '/change-quantity-details',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateProductsDetails;
        const result = await updateQuantityProductsDetails(body);
        next(result);
    },
);

router.put(
    '/update-product',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateProductsBody;
        const result = await updateProducts(body);
        next(result);
    },
);

router.post(
    '/set-image',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as setImageProductDetailsBody;
        const result = await setImageProductDetails(body);
        next(result);
    },
);

router.put(
    '/set-avatar',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as setImageProductDetailsBody;
        const result = await setAvatarProductDetails(body);
        next(result);
    },
);
