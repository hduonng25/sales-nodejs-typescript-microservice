import { NextFunction, Request, Response, Router } from 'express';
import {
    createProduct,
    getProduct,
    getProductByID,
    inactiveAndActiveDetails,
    createNewProductDetails,
    setAvatarProductDetails,
    setImageProductDetails,
    updateProducts,
    updateQuantityProductsDetails,
    activeProduct,
    deleteProduct,
    deleteManyProduct,
} from '~/controller';
import {
    activeProductBody,
    activeProductDetails,
    createProductBody,
    newProductDetails,
    setImageProductDetailsBody,
    updateProductsBody,
    updateProductsDetails,
} from '~/interface/request/body';
import { FindReqQuery } from '~/interface/request/query';

export const router: Router = Router();

//TODO: product
router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await getProduct(query);
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
    '/active',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as activeProductBody;
        const result = await activeProduct(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteProduct({ id });
        next(result);
    },
);
router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyProduct({ id });
        next(result);
    },
);

//TODO: product details
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

router.post(
    '/new-details',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as newProductDetails;
        const result = await createNewProductDetails(body);
        next(result);
    },
);

router.put(
    '/active-details',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as activeProductDetails;
        const result = await inactiveAndActiveDetails(body);
        next(result);
    },
);
