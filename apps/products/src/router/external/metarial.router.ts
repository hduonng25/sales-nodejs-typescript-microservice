import { verifyRole, verifyToken } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    createMetarials,
    deleteManyMetarials,
    deleteMetarial,
    findMetarials,
    getMetarialsByID,
    updateMetarial,
} from '~/controller';
import {
    FindReqQuery,
    createMaterialBody,
    updateMaterialBody,
} from '~/interface/request';
export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findMetarials(query);
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await getMetarialsByID({ id });
        next(result);
    },
);

router.post(
    '/',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createMaterialBody;
        const result = await createMetarials(body);
        next(result);
    },
);

router.put(
    '/',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateMaterialBody;
        const result = await updateMetarial(body);
        next(result);
    },
);

router.put(
    '/delete',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.body;
        const result = await deleteMetarial({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyMetarials({ id });
        next(result);
    },
);
