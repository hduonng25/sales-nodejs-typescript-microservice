import { NextFunction, Request, Response, Router } from 'express';
import {
    createSize,
    deleteManySize,
    deleteSize,
    getByIDSize,
    getSize,
    updateSize,
} from '~/controller';
import { CretaeSizeBody, UpdateSizeBody } from '~/interface/request';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const result = await getSize();
        next(result);
    },
);

router.get(
    '/:id',
    async (req: Request, _: Response, next: NextFunction) => {
        const { id } = req.params;
        const result = await getByIDSize({ id });
        next(result);
    },
);

router.post(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as CretaeSizeBody;
        const result = await createSize(body);
        next(result);
    },
);

router.put(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as UpdateSizeBody;
        const result = await updateSize(body);
        next(result);
    },
);

router.put(
    '/delete',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteSize({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManySize({ id });
        next(result);
    },
);
