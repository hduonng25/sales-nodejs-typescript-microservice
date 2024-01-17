import { validate, verifyRole, verifyToken } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    createProduct,
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
    findProducts,
} from '~/controller';
import {
    FindReqQuery,
    activeProductBody,
    activeProductDetails,
    createProductBody,
    newProductDetails,
    setImageProductDetailsBody,
    updateProductsBody,
    updateProductsDetails,
} from '~/interface/request';
import {
    activeProductSchema,
    createProductSchema,
    deleteManyProductChema,
    deleteProductSchema,
    findSchema,
} from '~/middleware/validator';

export const router: Router = Router();

//TODO: product
router.get(
    '/',
    validate.query(findSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findProducts(query);
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
    verifyToken,
    verifyRole('ADMIN'),
    validate.body(createProductSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createProductBody;
        console.log(req.payload);
        const result = await createProduct(body);
        next(result);
    },
);

router.put(
    '/active',
    verifyToken,
    verifyRole('ADMIN'),
    validate.body(activeProductSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as activeProductBody;
        const result = await activeProduct(body);
        next(result);
    },
);

router.put(
    '/delete',
    verifyToken,
    verifyRole('ADMIN'),
    validate.body(deleteProductSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteProduct({ id });
        next(result);
    },
);
router.put(
    '/delete-many',
    verifyToken,
    verifyRole('ADMIN'),
    validate.body(deleteManyProductChema),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyProduct({ id });
        next(result);
    },
);

//TODO: product details
router.put(
    '/change-quantity-details',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateProductsDetails;
        const result = await updateQuantityProductsDetails(body);
        next(result);
    },
);

router.put(
    '/update-product',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateProductsBody;
        const result = await updateProducts(body);
        next(result);
    },
);

router.post(
    '/set-image',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as setImageProductDetailsBody;
        const result = await setImageProductDetails(body);
        next(result);
    },
);

router.put(
    '/set-avatar',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as setImageProductDetailsBody;
        const result = await setAvatarProductDetails(body);
        next(result);
    },
);

router.post(
    '/new-details',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as newProductDetails;
        const result = await createNewProductDetails(body);
        next(result);
    },
);

router.put(
    '/active-details',
    verifyToken,
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as activeProductDetails;
        const result = await inactiveAndActiveDetails(body);
        next(result);
    },
);
