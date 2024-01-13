import { NextFunction, Request, Response, Router } from 'express';
import {
    createMetarials,
    deleteManyMetarials,
    deleteMetarial,
    getMetarials,
    getMetarialsByID,
    updateMetarial,
} from '~/controller';
import {
    createMaterialBody,
    updateMaterialBody,
} from '~/interface/request/body';
import { MetarialFindQuery } from '~/interface/request/query';
export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as MetarialFindQuery;
        const result = await getMetarials(query);
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
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as createMaterialBody;
        const result = await createMetarials(body);
        next(result);
    },
);

router.put(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as updateMaterialBody;
        const result = await updateMetarial(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.body;
        const result = await deleteMetarial({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManyMetarials({ id });
        next(result);
    },
);
