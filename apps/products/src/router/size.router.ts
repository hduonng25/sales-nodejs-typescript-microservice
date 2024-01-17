import { validate, verifyRole, verifyToken } from 'app';
import { NextFunction, Request, Response, Router } from 'express';
import {
    createSize,
    deleteManySize,
    deleteSize,
    findSizes,
    getByIDSize,
    getListSizeByID,
    updateSize,
} from '~/controller';
import {
    CretaeSizeBody,
    FindReqQuery,
    UpdateSizeBody,
} from '~/interface/request';
import { createSizeSchema } from '~/middleware/validator';

export const router: Router = Router();

router.get(
    '/',
    async (req: Request, _: Response, next: NextFunction) => {
        const query = req.query as unknown as FindReqQuery;
        const result = await findSizes(query);
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
    '/list-id',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const { id_size }: { id_size: string[] } = req.body;
        const result = await getListSizeByID({ id_size });
        next(result);
    },
);

router.post(
    '/',
    verifyRole('ADMIN'),
    validate.body(createSizeSchema),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as CretaeSizeBody;
        const result = await createSize(body);
        next(result);
    },
);

router.put(
    '/',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const body = req.body as UpdateSizeBody;
        const result = await updateSize(body);
        next(result);
    },
);

router.put(
    '/delete',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string = req.body.id;
        const result = await deleteSize({ id });
        next(result);
    },
);

router.put(
    '/delete-many',
    verifyRole('ADMIN'),
    async (req: Request, _: Response, next: NextFunction) => {
        const id: string[] = req.body.id;
        const result = await deleteManySize({ id });
        next(result);
    },
);
